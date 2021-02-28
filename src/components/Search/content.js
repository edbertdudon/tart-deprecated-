import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import DataSourceSearch from './datasourcesearch';
import SearchSource from './searchsource';
import useRecursiveTimeout from '../../functions/useRecursiveTimeout.ts';
import {
  shouldReloadTimer, getJobId, cancelJob, checkJobChanges, submitJob,
} from '../Home/jobs';
import { withFirebase } from '../Firebase';

const SearchContent = ({
  firebase, authUser, search, jobs, isJobsActive,
  onSetJobs, onSetIsJobsActive, onSetWorksheets,
}) => {
  // console.log(search)
  useEffect(() => {
    firebase.doListJobs(authUser.uid)
      .then((res) => onSetJobs(res))
      .then(() => onSetIsJobsActive(
        shouldReloadTimer(jobs),
      ));
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
      .then(() => onSetIsJobsActive(
        shouldReloadTimer(jobs),
      ));
  }, 60000);

  const handleJobSubmit = (filename) => {
    onSetIsJobsActive(true);
    onSetJobs(
      submitJob(filename, jobs),
    );
  };

  const handleJobCancel = (runId) => {
    onSetJobs(
      cancelJob(runId, jobs),
    );
  };

  return (
    <div className="home-content">
      {search.input.length < 1
        ? <div className="home-content-search">Search your library</div>
        : ([...search.ws, ...search.is, ...search.cs].length < 1
          ? (
            <div className="home-content-search">
              {`No results found for "${search.input}"`}
            </div>
          )
          : (
            <div>
              {[...search.ws, ...search.is, ...search.cs].map((file, index) => (
                search.is.includes(file)
                  ? <SearchSource filename={file} key={index} />
          			  : (
            <DataSourceSearch
              filename={file}
              connections={search.cs}
              runId={getJobId(file.replace(/\s/g, '').toLowerCase(), jobs)}
              onJobSubmit={handleJobSubmit}
              onJobCancel={handleJobCancel}
              key={index}
            />
                  )
              ))}
            </div>
          )
        )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  search: (state.searchState.search || {
    input: '', ws: [], is: [], cs: [],
  }),
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
)(SearchContent);
