const INITIAL_STATE = {
  spreadsheet: null,
};

const applySetSpreadsheet = (state, action) => ({
  ...state,
  spreadsheet: {
    ...state.spreadsheet,
    spreadsheet: action.spreadsheet,
  },
});

function spreadsheetReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SPREADSHEET_SET': {
      return applySetSpreadsheet(state, action);
    }
    default:
      return state;
  }
}

export default spreadsheetReducer;
