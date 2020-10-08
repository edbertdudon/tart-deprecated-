const INITIAL_STATE = {
  worksheetname: null,
};

const applySetWorksheetname = (state, action) => ({
  ...state,
  worksheetname: {
    ...state.worksheetname,
    worksheetname: action.worksheetname,
  },
});

function worksheetnameReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'WORKSHEETNAME_SET': {
      return applySetWorksheetname(state, action);
    }
    default:
      return state;
  }
}

export default worksheetnameReducer;
