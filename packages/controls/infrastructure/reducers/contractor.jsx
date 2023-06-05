import defaultStore from './defaultStore';

const contractorReducer = (state = defaultStore.contractor, action) => {
  switch (action.type) {
    case 'SET_BY_EMPLOYEES':
      return { ...state, byEmployees: action.byEmployees };
    default:
      return state;
  }
};

export default contractorReducer;
