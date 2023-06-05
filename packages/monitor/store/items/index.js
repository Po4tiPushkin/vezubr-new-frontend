import MonitorItemVehicle from './MonitorItemVehicle';
import MonitorItemOrder from './MonitorItemOrder';

export { MonitorItemOrder, MonitorItemVehicle };

const types = {
  [MonitorItemOrder.type]: MonitorItemOrder,
  [MonitorItemVehicle.type]: MonitorItemVehicle,
};

export default types;
