const invoicesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_FILTERED_INVOICES_SUCCESS':
      return action.payload;
    default:
      return state;
  }
};

export default invoicesReducer;
