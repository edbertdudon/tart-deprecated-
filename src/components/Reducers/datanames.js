const INITIAL_STATE = {
  dataNames: null,
};

const applySetDataNames = (state, action) => ({
  ...state,
  dataNames: action.dataNames,
});

function dataNamesReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'DATANAMES_SET': {
      return applySetDataNames(state, action);
    }
    default:
      return state;
  }
}

export default dataNamesReducer;
