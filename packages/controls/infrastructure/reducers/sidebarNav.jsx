import defaultStore from './defaultStore';

const sidebarNavReducer = (state = defaultStore[`${APP}SidebarNav`], action) => {
  switch (action.type) {
    case 'SET_SIDEBAR_NAV':
      return action.sidebarNav;
    default:
      return state;
  }
};

export default sidebarNavReducer;
