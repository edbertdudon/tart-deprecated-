const INITIAL_STATE = {
  slides: null,
};

const applySetSlides = (state, action) => ({
  ...state,
  slides: action.slides,
});

function slidesReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SLIDES_SET': {
      return applySetSlides(state, action);
    }
    default:
      return state;
  }
}

export default slidesReducer;
