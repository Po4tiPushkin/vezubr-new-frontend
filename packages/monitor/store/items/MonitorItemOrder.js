import { observable, computed, action, runInAction } from 'mobx';
import { MONITOR_ORDER_REQUIREMENTS } from '../../constants';
import { formatOrder } from '../../utils';
import MonitorItemBase from './MonitorItemBase';

class MonitorItemOrder extends MonitorItemBase {
  static getIdFromDirtyData(data) {
    return data.id || data.orderId;
  }

  static get type() {
    return `order`;
  }

  @computed
  get data() {
    return formatOrder(this._data);
  }

  @computed
  get position() {
    const { vehicle, firstPoint } = this.data;

    let latitude, longitude;

    latitude = vehicle?.lastGpsLatitude || firstPoint?.latitude;
    longitude = vehicle?.lastGpsLongitude || firstPoint?.longitude;

    if (latitude && longitude) {
      return {
        latitude,
        longitude,
      };
    }

    return null;
  }

  @computed
  get groupBy() {
    return this.data.requestId;
  }

  @computed
  get requestId() {
    return this.data.requestId;
  }

  @computed
  get orderType() {
    return this.data.orderType;
  }

  @computed
  get hasProblem() {
    return this.data.hasProblem;
  }

  @computed
  get problems() {
    return this.data.problems
  }

  get type() {
    return this.constructor.type;
  }

  @computed
  get uiState() {
    return this.data.uiState;
  }

  @computed
  get selectingStrategy() {
    return this.data.selectingStrategy;
  }

  @computed
  get republishStrategyType() {
    return this.data.republishStrategyType;
  }

  @computed
  get strategyType() {
    return this.data.strategyType
  }

  setUiState(state) {
    if (this.data.uiState) {
      this.data.uiState.state = state;
    }
  }
  @computed
  get requirements() {
    return MONITOR_ORDER_REQUIREMENTS.map(el => {
      if (this.data[el]) {
        return el;
      }
    }).filter(el => el);
  }
}

export default MonitorItemOrder;
