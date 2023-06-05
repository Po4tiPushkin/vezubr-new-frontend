export function setMonitorTabNotification(data) {
  return (dispatch) => dispatch({ type: 'SET_MONITOR_NOTIFICATIONS', payload: data });
}
export function setActiveTab(tab) {
  return (dispatch) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
}
