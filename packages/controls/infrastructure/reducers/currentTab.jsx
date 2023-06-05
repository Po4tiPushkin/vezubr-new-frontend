import defaultStore from './defaultStore';

const currentTabReducer = (state = defaultStore.currentTab, action) => {
  switch (action.type) {
    case 'SET_CURRENT_TAB':
      return action.payload;
    default:
      return state;
  }
};

export default currentTabReducer;
