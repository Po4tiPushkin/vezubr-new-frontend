const defaultState = {
  selection: null,
  execution: null,
  'paper-check': null,
};

function getNotifications(arr) {
  let danger = 0,
    warning = 0;
  for (let el of arr) {
    if (el.problem || el.problems?.length) {
      danger++;
    } else if (el.user_notification) {
      warning++;
    }
  }
  return (
    {
      danger,
      warning,
    } || null
  );
}

const tabNotificationsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_MONITOR_NOTIFICATIONS':
      const { payload } = action;
      if (APP === 'client') {
        const { executing = {}, selecting = {}, documents_check = {} } = payload;
        state.execution = getNotifications(executing?.orders);
        state.selection = getNotifications(selecting?.orders);
        state['paper-check'] = getNotifications(documents_check?.orders);
      } else {
        const { execution = [], selection = [], paperCheck = [] } = payload;
        state.execution = getNotifications(execution);
        state.selection = getNotifications(selection);
        state['paper-check'] = getNotifications(paperCheck);
      }
      return Object.assign({}, state);
    default:
      return state;
  }
};

export default tabNotificationsReducer;
