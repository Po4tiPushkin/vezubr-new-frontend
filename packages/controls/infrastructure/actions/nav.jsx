export function updateNavState(topNavState) {
  return (dispatch) => dispatch({ type: 'UPDATE_NAV_STATE', payload: topNavState });
}
