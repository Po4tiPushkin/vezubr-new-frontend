const auctionsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_FILTERED_AUCTIONS_SUCCESS':
      return action.payload;
    default:
      return state;
  }
};

export default auctionsReducer;
