const mapActionReducer = (state = {}, action) => {
  switch (action.type) {
    case 'MAP_ACTION':
      return action.payload;
    default:
      return state;
  }
};

export default mapActionReducer;
