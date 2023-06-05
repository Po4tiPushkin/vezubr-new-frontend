import defaultStore from './defaultStore';

const sidebarReducer = (state = defaultStore.sidebarState, action) => {
  switch (action.type) {
    case 'SET_NAV_STATE':
      return action.sidebarState;
    default:
      return state;
  }
};

export default sidebarReducer;
