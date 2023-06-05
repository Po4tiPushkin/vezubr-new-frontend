import defaultStore from './defaultStore';

const mapReducer = (state = defaultStore.map, action) => {
  switch (action.type) {
    case 'ADD_MAP':
      defaultStore.map = action.map;
      return action.map;
    case 'MAP_EVENTS':
      return action.actions;
    case 'DELETE_MAP':
      defaultStore.map = false;
      return false;
    default:
      return state;
  }
};

export default mapReducer;
