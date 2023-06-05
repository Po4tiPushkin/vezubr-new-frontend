import { observable, computed, action } from 'mobx';
import FieldCostInterface from './FieldCostInterface';
import validateTariffBase from '../validators/validateTariffBase';

class TariffLoaderBaseWork extends FieldCostInterface {
  static getKey({ hoursWork }) {
    return `${hoursWork}`;
  }

  @observable _cost = null;

  _hoursWork;

  _loader;

  constructor({ hoursWork, cost = null, costPerHour = null, loader }) {
    super();
    this._hoursWork = hoursWork;
    this._loader = loader;

    const setCost = cost !== null ? cost : costPerHour;

    this.setCost(setCost);
  }

  get hoursWork() {
    return this._hoursWork;
  }

  get key() {
    return this.constructor.getKey({
      hoursWork: this._hoursWork,
    });
  }

  get error() {
    return null;
  }

  @computed
  get cost() {
    return this._cost;
  }

  @action
  setCost(cost) {
    this._cost = cost;
  }

  get loader() {
    return this._loader;
  }
}

export default TariffLoaderBaseWork;
