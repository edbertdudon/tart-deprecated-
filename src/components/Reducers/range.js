const INITIAL_STATE = {
  range: null,
};

const applySetRange = (state, action) => ({
  ...state,
  range: action.range,
});

function rangeReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'RANGE_SET': {
      return applySetRange(state, action);
    }
    default:
      return state;
  }
}

export default rangeReducer;
