import defaultStore from './defaultStore';
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const topNavReducer = (state = defaultStore[`topNav${capitalize(APP)}`], action) => {
  switch (action.type) {
    // case 'SET_NAV_STATE':
    // 	return action.topNavState;

    case 'UPDATE_NAV_STATE':
      return action.topNavState;
    default:
      return state;
  }
};

export default topNavReducer;
