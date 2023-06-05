const filtersReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_FILTERS':
      return (state = [...action.payload]);
    case 'GET_FILTERS':
      return state;
    case 'ADD_FILTER':
      return [...state, action.payload];
    case 'REMOVE_FILTER':
      return state.filter((filter) => filter !== action.payload);
    default:
      return state;
  }
};
export default filtersReducer;
