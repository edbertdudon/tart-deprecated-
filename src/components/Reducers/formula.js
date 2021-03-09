const INITIAL_STATE = {
  formula: null,
};

const applySetFormula = (state, action) => ({
  ...state,
  formula: action.formula,
});

function formulaReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'FORMULA_SET': {
      return applySetFormula(state, action);
    }
    default:
      return state;
  }
}

export default formulaReducer;
