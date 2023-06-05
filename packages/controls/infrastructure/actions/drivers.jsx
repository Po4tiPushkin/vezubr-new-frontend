import { Drivers as DriversService } from '@vezubr/services';
import { Vehicle as VehicleService } from '@vezubr/services';

const getDrivers = () => {
  return async (dispatch) => {
    let payload;
    payload = await DriversService.list({});
    return dispatch({ type: 'GET_DRIVERS_SUCCESS', payload });
  };
};

const getVehicleList = (query = {}) => {
  return async (dispatch) => {
    let payload;
    payload = await VehicleService.list(query);
    return dispatch({ type: 'GET_VEHICLE_SUCCESS', payload });
  };
};

export { getDrivers, getVehicleList };
