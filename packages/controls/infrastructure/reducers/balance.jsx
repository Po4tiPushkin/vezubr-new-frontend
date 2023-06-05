import defaultStore from './defaultStore';

const balanceReducer = (state = defaultStore.availableBalance, action) => {
  switch (action.type) {
    case 'SET_BALANCE':
      return action.availableBalance;
    default:
      return state;
  }
};

export default balanceReducer;
