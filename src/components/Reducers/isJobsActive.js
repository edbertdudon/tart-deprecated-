const INITIAL_STATE = {
  isJobsActive: false,
};

const applySetIsJobsActive = (state, action) => ({
	...state,
    isJobsActive:action.isJobsActive
});

function isJobsActiveReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case 'ISJOBSACTIVE_SET': {
			return applySetIsJobsActive(state, action);
		}
		default:
			return state;
	}
}

export default isJobsActiveReducer;
