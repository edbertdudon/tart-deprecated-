const INITIAL_STATE = {
  notifications: null,
};

const applySetNotifications = (state, action) => ({
  ...state,
  notifications:action.notifications
});

function notificationsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'NOTIFICATIONS_SET': {
      return applySetNotifications(state, action);
    }
    default:
      return state;
  }
}

export default notificationsReducer;
