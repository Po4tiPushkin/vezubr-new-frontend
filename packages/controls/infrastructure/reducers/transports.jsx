const transports = (state = [], action) => {
  switch (action.type) {
    case 'GET_VEHICLE_SUCCESS':
      return action.payload.data.vehicles;
    default:
      return state;
  }
};

export default transports;
