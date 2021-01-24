//
//  DataSource
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdilTable } from '@mdi/light-js';
import { mdiStop, mdiLoading, mdiDotsHorizontal } from '@mdi/js';

import { getMaxNumberCustomSheet, xtos, addCopyToName } from '../../functions';
import EditableInput from '../EditableInput';
import withDropdown from '../Dropdown';
import { OFF_COLOR } from '../../constants/off-color';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const DATASOURCE_DROPDOWN = [
  { key: 'Open', type: 'item' },
  { key: 'Duplicate', type: 'item' },
  { key: 'Rename', type: 'item' },
  { key: 'Download as xlsx', type: 'item' },
  { key: 'Move to trash', type: 'item' },
];

const Item = ({ text, onDropdown }) => <MenuItem onClick={() => onDropdown(text)}>{text}</MenuItem>;

const ContextMenuDropdown = ({ name, onDropdown }) => (
  <ContextMenu id={`right-click${name}`}>
    <MenuItem onClick={() => onDropdown(DATASOURCE_DROPDOWN[0].key)} onContextMenu={(e) => e.preventPropognation()}>
      {DATASOURCE_DROPDOWN[0].key}
    </MenuItem>
    <Item text={DATASOURCE_DROPDOWN[1].key} onDropdown={onDropdown} />
    <Item text={DATASOURCE_DROPDOWN[2].key} onDropdown={onDropdown} />
    <Item text={DATASOURCE_DROPDOWN[3].key} onDropdown={onDropdown} />
    <Item text={DATASOURCE_DROPDOWN[4].key} onDropdown={onDropdown} />
  </ContextMenu>
);

const DataSource = ({
  firebase, authUser, color, filename, worksheets, onSetWorksheetname,
  onSetWorksheets, runId, onJobSubmit, onJobCancel,
}) => {
  const [name, setName] = useState(filename);
  const [hover, setHover] = useState(false);
  const [hoverDropdown, setHoverDropdown] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleDropdown = (key) => {
    switch (key) {
      case DATASOURCE_DROPDOWN[0].key: {
        onSetWorksheetname(name);

        document.getElementById(`link-app-${name}`).click();
        break;
      }
      case DATASOURCE_DROPDOWN[1].key: {
        const newname = addCopyToName(worksheets, name);

        firebase.doDownloadWorksheet(authUser.uid, name).then((slide) => {
          const file = new File(
            [JSON.stringify(slide)],
            newname,
            { type: 'application/json' }
          );

          const uploadTask = firebase.doUploadWorksheet(authUser.uid, newname, file);
          uploadTask.on('state_changed', () => {}, () => {}, (snapshot) => {
            firebase.doListWorksheets(authUser.uid).then((res) => {
              onSetWorksheets(res.items);
            });
          });
        });

        break;
      }
      case DATASOURCE_DROPDOWN[2].key: {
        setReadOnly(false);
        break;
      }
      case DATASOURCE_DROPDOWN[3].key: {
        firebase.doDownloadWorksheet(authUser.uid, name).then((slide) => {
          xtos(slide, name);
        });
        break;
      }
      case DATASOURCE_DROPDOWN[4].key: {
        // const today = new Date().toLocaleDateString();
        // firebase.trash(authUser.uid).get().then((doc) => {
        //   if (doc.exists) {
        //     firebase.trash(authUser.uid).update({ [name]: today });
        //   } else {
        //     firebase.trash(authUser.uid).set({ [name]: today });
        //   }
        // });

        const ws = worksheets.findIndex((worksheet) => worksheet.name === name)
        onSetWorksheets([
          ...worksheets.slice(0, ws),
          ...worksheets.slice(ws + 1),
        ])
        break;
      }
    }
  };

  const handleRun = () => {
    onJobSubmit(name);

    firebase.doRunWorksheet(
      authUser.uid,
      name,
      `user/${authUser.uid}/${name}`,
      `gs://tart-90ca2.appspot.com/user/${authUser.uid}/`,
      'gs://tart-90ca2.appspot.com/scripts/sparkR.R',
    ).then((jobResp) => {
      if (jobResp === 'failed job') {
        onJobCancel(runId);
      };
    });
  };

  const handleCancel = () => {
    onJobCancel(runId);

    const ws = name.replace(/\s/g, '').toLowerCase()
    firebase.doCancelWorksheet(runId, authUser.uid, ws);
  };

  const handleCommitRename = (n) => {
    // setLoading(true);
    // setName(n);
    // firebase.doDownloadWorksheet(authUser.uid, name).then((slide) => {
    //   firebase.doUploadWorksheet(
    //     authUser.uid,
    //     n,
    //     new File([JSON.stringify(slide)], n, { type: 'application/json' }),
    //   ).then(() => {
    //     firebase.doDeleteWorksheet(authUser.uid, name).then(() => {
    //       // onListFilesLessTrash()
    //       setLoading(false);
    //       // onSetWorksheetname(n)
    //     });
    //   });
    // });
  };

  const handleOpen = () => onSetWorksheetname(name);

  const handleClose = () => setError('');

  const Run = () => (
    (runId === undefined || runId === '')
      ?	(
        <button
          className="datasource-button"
          onClick={handleRun}
          style={{ backgroundColor: hover && OFF_COLOR[color[authUser.uid]] }}
          onMouseEnter={() => setHover(!hover)}
          onMouseLeave={() => setHover(!hover)}
        >
          RUN
        </button>
      )
      :	(
        <button className="datasource-button" onClick={handleCancel} style={{ backgroundColor: OFF_COLOR[color[authUser.uid]] }}>
          <Icon path={mdiStop} size={1} />
        </button>
      )
  );

  const LinkToApp = () => (
    <Link to={{ pathname: ROUTES.WORKSHEET, filename: name }} onClick={handleOpen} id={`link-app-${name}`}>
      <div className="datasource-icon">
        {runId === undefined || runId === ''
				  ? <Icon path={mdilTable} size={5} />
				  : <Icon path={mdiLoading} size={5} spin />}
      </div>
    </Link>
  );

  return (
    <div className="datasource-thumbnail">
      {loading && <div className="datasource-loading-overlay" />}
      <ContextMenuTrigger className="datasource-dropdown" id={`right-click${name}`}>
        <LinkToApp />
        <div className="datasource-buttons-wrapper">
          <Run />
          <OptionWithDropdown
            text={<Icon path={mdiDotsHorizontal} size={0.9} />}
            items={DATASOURCE_DROPDOWN}
            onSelect={handleDropdown}
            color={OFF_COLOR[color[authUser.uid]]}
            style={{ left: '13px' }}
          />
        </div>
        <EditableInput
          value={name}
          readOnly={readOnly}
          onCommit={handleCommitRename}
          classname="datasource-editabletext"
          setReadOnly={setReadOnly}
          inputId={`datasource-editabletext-${name}`}
        />
      </ContextMenuTrigger>
      <ContextMenuDropdown name={name} onDropdown={handleDropdown} />
    </div>
  );
};

const Option = ({
  text, hover, onHover, isOpen, onOpen, color,
}) => (
  <div
    className="datasource-options"
    onClick={onOpen}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    style={{ backgroundColor: hover && color }}
  >
    {text}
  </div>
);

const OptionWithDropdown = withDropdown(Option);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  name: (state.worksheetnameState.name || ''),
  color: (state.colorState.colors || {}),
  worksheets: (state.worksheetsState.worksheets || []),
});

const mapDispatchToProps = (dispatch) => ({
  onSetWorksheetname: (name) => dispatch({ type: 'WORKSHEETNAME_SET', name }),
  onSetWorksheets: (worksheets) => dispatch({ type: 'WORKSHEETS_SET', worksheets }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DataSource);
