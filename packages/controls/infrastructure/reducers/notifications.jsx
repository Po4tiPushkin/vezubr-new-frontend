import defaultStore from './defaultStore';

const notificationsReducer = (state = defaultStore.notifications, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return action.notifications;
    default:
      return state;
  }
};

export default notificationsReducer;
