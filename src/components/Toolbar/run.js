//
//  run.js
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { useHistory } from 'react-router-dom';
import Header from './header';
import { submitJob, getJobId, cancelJob } from '../Home/content';
import * as ROUTES from '../../constants/routes';
// import OFF_COLOR from '../../constants/off-color';
import { withFirebase } from '../Firebase';

const RUN_DROPDOWN = [
  { key: 'Run', type: 'item', path: ROUTES.HOME },
];

const Run = ({
  firebase, authUser, worksheetname, jobs, rightSidebar, notifications,
  onSetRightSidebar, onSetJobs, onSetIsJobsActive, onSetNotifications,
}) => {
  const history = useHistory();

  const handleRun = (key) => {
    switch (key) {
      case RUN_DROPDOWN[0].key: {
        onSetIsJobsActive(true);
        onSetJobs(
          submitJob(worksheetname, jobs),
        );
        onSetNotifications(
          notifications.concat({ key: `Job started: ${worksheetname}`, type: 'notification' }),
        );

        firebase.doRunWorksheet(
          authUser.uid,
          worksheetname,
          `user/${authUser.uid}/worksheets/${worksheetname}`,
        ).then((jobResp) => {
          if (jobResp === 'failed job') {
            const runId = getJobId(worksheetname.replace(/\s/g, '').toLowerCase(), jobs);

            onSetJobs(
              cancelJob(runId, jobs),
            );
            onSetNotifications(
              notifications.concat({ key: `Job cancelled: ${worksheetname}`, type: 'notification' }),
            );
          }
        });

        history.push(ROUTES.HOME);
        break;
      }
      default:
    }
  };

  const handleToggle = (select) => {
    if (rightSidebar !== select) {
      onSetRightSidebar(select);
      return;
    }
    onSetRightSidebar('none');
  };

  return (
    <Header
      classname="dropdown-content"
      text="Run"
      items={RUN_DROPDOWN}
      onSelect={handleRun}
      // color={OFF_COLOR[color[authUser.uid]]}
    />
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  // color: (state.colorState.colors || {}),
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  rightSidebar: (state.rightSidebarState.rightSidebar || 'none'),
  jobs: (state.jobsState.jobs || [{ status: 'failed list jobs' }]),
  isJobsActive: (state.isJobsActiveState.isJobsActive || false),
  notifications: (state.notificationsState.notifications || []),
});

const mapDispatchToProps = (dispatch) => ({
  onSetRightSidebar: (rightSidebar) => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
  onSetJobs: (jobs) => dispatch({ type: 'JOBS_SET', jobs }),
  onSetIsJobsActive: (isJobsActive) => dispatch({ type: 'ISJOBSACTIVE_SET', isJobsActive }),
  onSetNotifications: (notifications) => dispatch({ type: 'NOTIFICATIONS_SET', notifications }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Run);
