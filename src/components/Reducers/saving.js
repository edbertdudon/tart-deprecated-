const INITIAL_STATE = {
  saving: false,
};

const applySetSaving = (state, action) => ({
  ...state,
  saving: action.saving,
});

function savingReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SAVING_SET': {
      return applySetSaving(state, action);
    }
    default:
      return state;
  }
}

export default savingReducer;
