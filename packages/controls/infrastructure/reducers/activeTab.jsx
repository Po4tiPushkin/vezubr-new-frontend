const activeTabReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return Object.assign({}, action.payload);
    default:
      return state;
  }
};
export default activeTabReducer;
