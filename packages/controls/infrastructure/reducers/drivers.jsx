const driversReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_DRIVERS_SUCCESS':
      return action.payload.data.drivers;
    default:
      return state;
  }
};

export default driversReducer;
