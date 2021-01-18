const INITIAL_STATE = {
  rightSidebar: null,
};

const applySetRightSidebar = (state, action) => ({
  ...state,
  rightSidebar: action.rightSidebar,
});

function rightSidebarReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'RIGHTSIDEBAR_SET': {
      return applySetRightSidebar(state, action);
    }
    default:
      return state;
  }
}

export default rightSidebarReducer;
