import defaultStore from './defaultStore';

const userReducer = (state = defaultStore.user, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.user;
    default:
      return state;
  }
};

export default userReducer;
