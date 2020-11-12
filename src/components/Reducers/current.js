const INITIAL_STATE = {
  current: null,
};

const applySetCurrent = (state, action) => ({
  ...state,
  current: action.current
});

function currentReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'CURRENT_SET': {
      return applySetCurrent(state, action);
    }
    default:
      return state;
  }
}

export default currentReducer;
