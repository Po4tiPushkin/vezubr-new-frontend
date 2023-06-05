import { observable, computed, action, runInAction } from 'mobx';
import moment from 'moment';
import { formatVehicle } from '../../utils';
import MonitorItemBase from './MonitorItemBase';
import { MONITOR_VEHICLE_ACTUAL_MINUTE } from '../../constants';

class MonitorItemVehicle extends MonitorItemBase {
  static getIdFromDirtyData(data) {
    return data.id || data.vehicleId;
  }

  static get type() {
    return `vehicle`;
  }

  @computed
  get data() {
    return formatVehicle(this._data);
  }

  get type() {
    return this.constructor.type;
  }

  @computed
  get position() {
    const { lastGpsLatitude, lastGpsLongitude } = this.data;

    const latitude = lastGpsLatitude;
    const longitude = lastGpsLongitude;

    if (latitude && longitude) {
      return {
        latitude,
        longitude,
      };
    }

    return null;
  }

  @computed
  get isActual() {
    const { lastApiCallAt, lastGpsSentAt } = this.data;
    if (lastApiCallAt || lastGpsSentAt) {
      const lastUp = moment.unix(lastApiCallAt || lastGpsSentAt);
      return lastUp.isValid() && this._store.time.diff(lastUp, 'minute') < MONITOR_VEHICLE_ACTUAL_MINUTE;
    }
    return false;
  }

  @computed
  get isFree() {
    return this.data?.isFreeVehicle;
  }

  @computed
  get hasProblem() {
    return false;
  }

  @computed
  get groupBy() {
    return this.data.id;
  }

  @computed
  get problems() {
    return []
  }
}

export default MonitorItemVehicle;
