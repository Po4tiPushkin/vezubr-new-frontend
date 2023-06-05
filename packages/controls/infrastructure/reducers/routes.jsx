import defaultStore from './defaultStore';

const routesReducer = (state = defaultStore.routes, action) => {
  switch (action.type) {
    case 'SET_ROUTES':
      return action.routes;
    default:
      return state;
  }
};

export default routesReducer;
