const INITIAL_STATE = {
  jobs: null,
};

const applySetJobs = (state, action) => ({
  ...state,
  jobs:action.jobs
});

function jobsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'JOBS_SET': {
      return applySetJobs(state, action);
    }
    default:
      return state;
  }
}

export default jobsReducer;