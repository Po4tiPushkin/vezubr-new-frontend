import { observable, computed, action } from 'mobx';
import FieldCostInterface from './FieldCostInterface';
import validateTariffBase from '../validators/validateTariffBase';

class TariffCarBaseWork extends FieldCostInterface {
  static getKey({ hoursWork, hoursInnings }) {
    return `${hoursWork}:${hoursInnings}`;
  }

  @observable _cost = null;

  _hoursWork;

  _hoursInnings;

  _car;

  constructor({ car, hoursWork, hoursInnings, cost = null, costPerHour = null }) {
    super();
    this._hoursWork = hoursWork;
    this._hoursInnings = hoursInnings;
    this._car = car;

    const setCost = cost !== null ? cost : costPerHour;

    this.setCost(setCost);
  }

  get hoursWork() {
    return this._hoursWork;
  }

  get hoursInnings() {
    return this._hoursInnings;
  }

  get key() {
    return this.constructor.getKey({
      hoursWork: this._hoursWork,
      hoursInnings: this._hoursWork,
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
    if (validateTariffBase.isNumber(cost)) {
      this.car.clearError();
    }
  }

  get car() {
    return this._car;
  }
}

export default TariffCarBaseWork;
