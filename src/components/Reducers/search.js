const INITIAL_STATE = {
  search: null,
};

const applySetSearch = (state, action) => ({
  ...state,
  search: action.search,
});

function searchReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SEARCH_SET': {
      return applySetSearch(state, action);
    }
    default:
      return state;
  }
}

export default searchReducer;
