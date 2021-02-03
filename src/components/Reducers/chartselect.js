const INITIAL_STATE = {
  chartSelect: null,
};

const applySetChartSelect = (state, action) => ({
  ...state,
  chartSelect: action.chartSelect,
});

function chartSelectReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'CHARTSELECT_SET': {
      return applySetChartSelect(state, action);
    }
    default:
      return state;
  }
}

export default chartSelectReducer;
