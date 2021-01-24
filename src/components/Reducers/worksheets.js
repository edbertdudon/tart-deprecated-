const INITIAL_STATE = {
  worksheets: null,
};

const applySetWorksheets = (state, action) => ({
  ...state,
  worksheets: action.worksheets,
});

function worksheetsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'WORKSHEETS_SET': {
      return applySetWorksheets(state, action);
    }
    default:
      return state;
  }
}

export default worksheetsReducer;
