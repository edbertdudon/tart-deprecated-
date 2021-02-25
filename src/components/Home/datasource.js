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

const Item = ({ text, onDropdown }) => (
  <MenuItem onClick={() => onDropdown(text)}>{text}</MenuItem>
);

const ContextMenuDropdown = ({ filename, onDropdown }) => (
  <ContextMenu id={`right-click${filename}`}>
    <MenuItem
      onClick={() => onDropdown(DATASOURCE_DROPDOWN[0].key)}
      onContextMenu={(e) => e.preventPropognation()}
    >
      {DATASOURCE_DROPDOWN[0].key}
    </MenuItem>
    <Item text={DATASOURCE_DROPDOWN[1].key} onDropdown={onDropdown} />
    <Item text={DATASOURCE_DROPDOWN[2].key} onDropdown={onDropdown} />
    <Item text={DATASOURCE_DROPDOWN[3].key} onDropdown={onDropdown} />
    <Item text={DATASOURCE_DROPDOWN[4].key} onDropdown={onDropdown} />
  </ContextMenu>
);

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
        onSetWorksheetname(filename);

        document.getElementById(`link-app-${filename}`).click();
        break;
      }
      case DATASOURCE_DROPDOWN[1].key: {
        const newname = addCopyToName(worksheets, filename);

        firebase.doDownloadWorksheet(authUser.uid, filename).then((slide) => {
          const file = new File(
            [JSON.stringify(slide)],
            newname,
            { type: 'application/json' },
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
        firebase.doDownloadWorksheet(authUser.uid, filename).then((slide) => {
          xtos(slide, filename);
        });
        break;
      }
      case DATASOURCE_DROPDOWN[4].key: {
        firebase.doMoveToTrash(authUser.uid, filename);
        const ws = worksheets.findIndex((worksheet) => worksheet.name === filename);
        onSetWorksheets([
          ...worksheets.slice(0, ws),
          ...worksheets.slice(ws + 1),
        ]);
        break;
      }
    }
  };

  const handleRun = () => {
    onJobSubmit(filename);
    firebase.doRunWorksheet(
      authUser.uid,
      filename,
      `user/${authUser.uid}/worksheets/${name}`,
    ).then((jobResp) => {
      if (jobResp === 'failed job') {
        onJobCancel(runId);
      }
    });
  };

  const handleCancel = () => {
    onJobCancel(runId);
    firebase.doCancelWorksheet(
      runId,
      authUser.uid,
      filename.replace(/\s/g, '').toLowerCase(),
    );
  };

  const handleCommit = (name) => {
    setName(name);
    firebase.doRenameWorksheet(authUser.uid, filename, name);
  };

  const handleOpen = () => onSetWorksheetname(filename);

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
        <button
          className="datasource-button"
          onClick={handleCancel}
          style={{ backgroundColor: OFF_COLOR[color[authUser.uid]] }}
        >
          <Icon path={mdiStop} size={1} />
        </button>
      )
  );

  const LinkToApp = () => (
    <Link
      to={{ pathname: ROUTES.WORKSHEET, filename }}
      onClick={handleOpen}
      id={`link-app-${filename}`}
    >
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
      <ContextMenuTrigger className="datasource-dropdown" id={`right-click${filename}`}>
        <LinkToApp />
        <div className="datasource-buttons-wrapper">
          <Run />
          <OptionWithDropdown
            classname="dropdown-content-datasource"
            text={<Icon path={mdiDotsHorizontal} size={0.9} />}
            items={DATASOURCE_DROPDOWN}
            onSelect={handleDropdown}
            color={OFF_COLOR[color[authUser.uid]]}
          />
        </div>
        <EditableInput
          value={name}
          readOnly={readOnly}
          onCommit={handleCommit}
          classname="datasource-editabletext"
          setReadOnly={setReadOnly}
          inputId={`datasource-editabletext-${filename}`}
        />
      </ContextMenuTrigger>
      <ContextMenuDropdown filename={filename} onDropdown={handleDropdown} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  color: (state.colorState.colors || {}),
  worksheets: (state.worksheetsState.worksheets || []),
});

const mapDispatchToProps = (dispatch) => ({
  onSetWorksheetname: (worksheetname) => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname }),
  onSetWorksheets: (worksheets) => dispatch({ type: 'WORKSHEETS_SET', worksheets }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DataSource);
