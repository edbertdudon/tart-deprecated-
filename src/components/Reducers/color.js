const INITIAL_STATE = {
  colors: null,
};

const applySetColor = (state, action) => ({
  ...state,
  colors: {
    ...state.colors,
    [action.uid]: action.color,
  },
});

function colorReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'COLOR_SET': {
      return applySetColor(state, action);
    }
    default:
      return state;
  }
}

export default colorReducer;
