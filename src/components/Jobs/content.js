import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import DataSourceJobs from './datasourcejobs';
import useRecursiveTimeout from '../../functions/useRecursiveTimeout.ts';
import {
  shouldReloadTimer, getJobId, cancelJob, checkJobChanges, submitJob,
} from '../Home/jobs';
import { withFirebase } from '../Firebase';

const withJobsContentNull = (Component) => (props) => (props.jobs[0].status === 'failed list jobs'
  ? <div className="home-content-search">No Jobs Running</div>
  : <Component {...props} />);

const JobsContentRunning = ({
  firebase, authUser, worksheets, jobs, isJobsActive, onSetJobs, onSetIsJobsActive, onSetWorksheets,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    firebase.doListWorksheets(authUser.uid).then((res) => {
      onSetWorksheets(res.items);
      setLoading(false);
    });

    firebase.doListJobs(authUser.uid)
      .then((res) => onSetJobs(res))
      .then(() => onSetIsJobsActive(shouldReloadTimer(jobs)));
  }, []);

  // Checks every ** 1 minutes *** for finished jobs
  useRecursiveTimeout(() => {
    if (isJobsActive === false) return;

    // Wait for promise to complete before scheduling the next iteration (synchronous)
    firebase.doListJobs(authUser.uid)
      .then((res) => {
        if (checkJobChanges(res)) {
          firebase.doListWorksheets(authUser.uid).then((r) => {
            onSetWorksheets(r.items);
          });
        }
        return res;
      })
      .then((res) => onSetJobs(res))
      .then(() => onSetIsJobsActive(shouldReloadTimer(jobs)));
  }, 60000);

  const handleJobSubmit = (filename) => {
    onSetIsJobsActive(true);
    onSetJobs(submitJob(filename, jobs));
  };

  const handleJobCancel = (runId) => onSetJobs(cancelJob(runId, jobs));

  return (
    <div>
      {worksheets.filter((worksheet) => {
        const label = worksheet.name.replace(/\s/g, '').toLowerCase();
        if (jobs[0].status !== 'failed list jobs') {
          const jobsList = jobs.map((job) => job.labels.worksheet);
          if (jobsList.includes(label)) {
            return worksheet;
          }
        }
      }).map((worksheet) => (
        <DataSourceJobs
          filename={worksheet.name}
          runId={getJobId(worksheet.name.replace(/\s/g, '').toLowerCase(), jobs)}
          onJobSubmit={handleJobSubmit}
          onJobCancel={handleJobCancel}
        />
      ))}
    </div>
  );
};

const JobsContent = ({
  firebase, authUser, jobs, worksheets, onSetJobs, isJobsActive, onSetIsJobsActive, onSetWorksheets,
}) => (
  <div className="home-content">
    <JobsContentWithConditionalRendering
      firebase={firebase}
      authUser={authUser}
      jobs={jobs}
      worksheets={worksheets}
      onSetJobs={onSetJobs}
      isJobsActive={isJobsActive}
      onSetIsJobsActive={onSetIsJobsActive}
      onSetWorksheets={onSetWorksheets}
    />
  </div>
);

const withConditiionalRenderings = compose(
  withJobsContentNull,
);

const JobsContentWithConditionalRendering = withConditiionalRenderings(JobsContentRunning);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  jobs: (state.jobsState.jobs || [{ status: 'failed list jobs' }]),
  isJobsActive: (state.isJobsActiveState.isJobsActive || false),
  worksheets: (state.worksheetsState.worksheets || []),
});

const mapDispatchToProps = (dispatch) => ({
  onSetJobs: (jobs) => dispatch({ type: 'JOBS_SET', jobs }),
  onSetIsJobsActive: (isJobsActive) => dispatch({ type: 'ISJOBSACTIVE_SET', isJobsActive }),
  onSetWorksheets: (worksheets) => dispatch({ type: 'WORKSHEETS_SET', worksheets }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(JobsContent);
