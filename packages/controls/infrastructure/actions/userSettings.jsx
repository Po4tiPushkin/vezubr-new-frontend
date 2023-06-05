export function setUserSetting(settings) {
  return (dispatch) => dispatch({ type: 'USER_SETTINGS_SET', settings });
}

export function updateUserSetting(settings) {
  return (dispatch) => dispatch({ type: 'USER_SETTINGS_UPDATE', settings });
}
