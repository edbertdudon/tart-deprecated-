//
//  HomeContent.js
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
//  Notes:
//  - Jobs must persist to stay as loading -- use redux-persist
//  - Jobs is fetched every minute if there are jobs -- isJobsActive to track
//  - listJobs waits for cluster to be active, use jobFiller as replacement in case cluster is not yet active
//
//  Known Issues:
//  - how to keep worksheets in redux for app instance even after refresh
//  - clicking RUN repetitively sometimes set loading indicator off -- runId gets rerendered a second time.
//
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import DataSource from './datasource';
import LoadingDataSource from './loadingdatasource';
import NewDataSource from './newdatasource';
import useRecursiveTimeout from '../../functions/useRecursiveTimeout.ts';
import { withFirebase } from '../Firebase';

const terminalStates = new Set(['DONE', 'ERROR', 'CANCELLED']);

const queueStates = new Set(['PENDING', 'SETUP_DONE', 'RUNNING']);

export function shouldReloadTimer(jobs) {
  if (jobs[0].status === 'failed list jobs') return (false);

  return jobs.some((job) => !terminalStates.has(job.status.state));
}

export function getJobId(worksheetname, jobs) {
  if (jobs[0].status !== 'failed list jobs') {
    for (let i = 0; i < jobs.length; i += 1) {
      if (worksheetname === jobs[i].labels.worksheet
        && queueStates.has(jobs[i].status.state)) {
        return jobs[i].reference.jobId;
      }
    }
  }
}

// Set Temporary Job and then useRecursiveTimeout runs listJobs -- waits for cluster to be active in server
export function submitJob(worksheetname, jobs) {
  const fillerJobs = [];
  if (jobs[0].status !== 'failed list jobs') {
    for (let i = 0; i < jobs.length; i += 1) {
      if (jobs[i].reference.jobId.startsWith('filler job')) fillerJobs.push(jobs[i]);
    }
  }

  const jobFiller = {
    status: { state: 'PENDING' },
    labels: { worksheet: worksheetname.replace(/\s/g, '').toLowerCase() },
    reference: { jobId: `filler job ${fillerJobs.length + 1}` },
  };

  if (jobs[0].status === 'failed list jobs') {
    return ([jobFiller]);
  }

  return ([...jobs, jobFiller]);
}

// Deletes temporary Job and then list Jobs then useRecursiveTimeout
// will be called once more (unless theres different jobs running)
export function cancelJob(runId, jobs) {
  let currentJob;
  for (let i = 0; i < jobs.length; i += 1) {
    if (jobs[i].reference.jobId === runId) {
      currentJob = i;
    }
  }

  let newJobs = [
    ...jobs.slice(0, currentJob),
    ...jobs.slice(currentJob + 1),
  ];

  if (newJobs.length < 1) newJobs = [{ status: 'failed list jobs' }];

  return newJobs;
}

const Content = ({
  firebase, authUser, worksheets, jobs, notifications, onSetWorksheets,
  onSetJobs, isJobsActive, onSetIsJobsActive, onSetNotifications,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    firebase.doListWorksheets(authUser.uid).then((res) => {
      onSetWorksheets(res.items);
      setLoading(false);
    });

    firebase.doListJobs(authUser.uid)
      .then((res) => {
        if (!('error' in res)) {
          onSetJobs(res);
        }
      })
      .then(() => onSetIsJobsActive(
        shouldReloadTimer(jobs),
      ));
  }, []);

  // Checks every ** 1 minutes *** for finished jobs
  useRecursiveTimeout(() => {
    if (isJobsActive === false) return;

    // Wait for promise to complete before scheduling the next iteration (synchronous)
    firebase.doListJobs(authUser.uid).then((res) => {
      // Checks for changes in job before downloading new worksheets created
      if (res.some((job) => terminalStates.has(job.status.state))) {
        firebase.doListWorksheets(authUser.uid).then((ws) => {
          onSetWorksheets(ws.items);
        });
      }
      return res;
    })
      .then((res) => onSetJobs(res))
      .then(() => onSetIsJobsActive(
        shouldReloadTimer(jobs),
      ));
  }, 60000);

  const handleJobSubmit = (worksheetname) => {
    onSetIsJobsActive(true);

    onSetJobs(
      submitJob(worksheetname, jobs),
    );

    onSetNotifications(
      notifications.concat({
        key: `Job started: ${worksheetname}`,
        type: 'notification',
      }),
    );
  };

  const handleJobCancel = (runId, worksheetname) => {
    onSetJobs(
      cancelJob(runId, jobs),
    );

    onSetNotifications(
      notifications.concat({
        key: `Job started: ${worksheetname}`,
        type: 'notification',
      }),
    );
  };

  return (
    <div className="home-content">
      {loading
        ? <LoadingDataSource />
        : (
          <>
            {worksheets.map((worksheet) => (
              <DataSource
                filename={worksheet.name}
                runId={getJobId(worksheet.name.replace(/\s/g, '').toLowerCase(), jobs)}
                onJobSubmit={handleJobSubmit}
                onJobCancel={handleJobCancel}
                key={worksheet.name}
              />
            ))}
          </>
        )}
      <NewDataSource />
    </div>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  worksheets: (state.worksheetsState.worksheets || []),
  jobs: (state.jobsState.jobs || [{ status: 'failed list jobs' }]),
  isJobsActive: (state.isJobsActiveState.isJobsActive || false),
  notifications: (state.notificationsState.notifications || []),
});

const mapDispatchToProps = (dispatch) => ({
  onSetWorksheets: (worksheets) => dispatch({ type: 'WORKSHEETS_SET', worksheets }),
  onSetJobs: (jobs) => dispatch({ type: 'JOBS_SET', jobs }),
  onSetIsJobsActive: (isJobsActive) => dispatch({ type: 'ISJOBSACTIVE_SET', isJobsActive }),
  onSetNotifications: (notifications) => dispatch({ type: 'NOTIFICATIONS_SET', notifications }),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withFirebase,
)(Content);
