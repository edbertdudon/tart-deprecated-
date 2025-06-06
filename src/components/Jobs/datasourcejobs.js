//
//  DataSourceJobs
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
// Known Issues:
// Download button produces json link instead of a file pdf, excel, txt, csv, etc.
//

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdilTable } from '@mdi/light-js';
import { mdiStop, mdiLoading } from '@mdi/js';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const DataSourceJobs = ({
  firebase, authUser, color, filename, runId, onJobSubmit, onJobCancel, onSetWorksheet,
}) => {
  const [hover, setHover] = useState(false);

  const handleRun = () => {
    onJobSubmit(filename);
    firebase.doRunWorksheet(
      authUser.uid,
      filename,
      `user/${authUser.uid}/worksheets/${filename}`,
    ).then((jobResp) => {
      if (jobResp === 'failed job') onJobCancel(runId);
    });
  };

  const handleCancel = () => {
    onJobCancel(runId);
    firebase.doCancelWorksheet(runId, authUser.uid, filename.replace(/\s/g, '').toLowerCase());
  };

  const handleOpen = () => {
    document.getElementById(`link-app-${filename}`).click();
    onSetWorksheet(filename, authUser.uid);
  };

  const Run = () => (
    (runId === undefined || runId === '')
      ?	(
        <button
          className="datasource-button"
          onClick={handleRun}
          style={{ backgroundColor: hover && color[authUser.uid] }}
          onMouseEnter={() => setHover(!hover)}
          onMouseLeave={() => setHover(!hover)}
        >
          RUN
        </button>
      ) : (
        <button className="datasource-button" onClick={handleCancel} style={{ backgroundColor: color[authUser.uid] }}>
          <Icon path={mdiStop} size={1} />
        </button>
      )
  );

  const LinkToApp = () => (
    <Link to={{ pathname: ROUTES.WORKSHEET, filename }} onClick={handleOpen} id={`link-app-${filename}`}>
      <div className="datasource-icon">
        {runId === undefined || runId === ''
          ? <Icon path={mdilTable} size={5} />
          : <Icon path={mdiLoading} size={5} spin />}
      </div>
    </Link>
  );

  return (
    <div className="datasource-thumbnail">
      <LinkToApp />
      <div className="datasource-buttons-wrapper">
        <Run />
      </div>
      <div className="datasource-editabletext">{filename.replace(/\.[^/.]+$/, '')}</div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  color: (state.colorState.colors || {}),
});

const mapDispatchToProps = (dispatch) => ({
  onSetWorksheetname: (worksheetname) => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DataSourceJobs);
