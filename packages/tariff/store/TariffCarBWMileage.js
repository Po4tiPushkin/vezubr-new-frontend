import { observable, computed, action } from 'mobx';
import validateTariffBase from '../validators/validateTariffBase';

class TariffCarBaseWorkMileage {
  static getKey({ cost }) {
    return `${cost}`;
  }

  @observable _cost;
  @observable _mileage = null;
  @observable _workMinutes = null;
  @observable _pointsCount = null;
  @observable _errors = {};
  _car;

  constructor({ cost, mileage = null, workMinutes = null, pointsCount = null, car }) {
    this._cost = cost;
    this._car = car;
    this._mileage = mileage;
    this._workMinutes = workMinutes;
    this._pointsCount = pointsCount;
  }

  get key() {
    return this.constructor.getKey({
      cost: this._cost,
    });
  }

  @computed get mileage() { return this._mileage }
  set mileage(value) { this._mileage = value; }

  @computed get workMinutes() { return this._workMinutes }
  set workMinutes(value) { this._workMinutes = value; }

  @computed get pointsCount() { return this._pointsCount }
  set pointsCount(value) { this._pointsCount = value; }

  @computed get cost() { return this._cost; }

  @computed get errors() { return this._errors }

  @action
  clearErrors() {
    this._errors = {};
  }

  @action
  validate() {
    this.clearErrors();
    const errorMsg = 'Это поле обязательно для заполнения';
    if (!this._mileage) {
      this._errors.mileage = errorMsg
    }
    if (!this._pointsCount) {
      this._errors.pointsCount = errorMsg;
    }
    if (!this._workMinutes) {
      this._errors.workMinutes = errorMsg;
    }
    if (Object.keys(this._errors).length === 3) {
      this._errors = {};
      return true;
    }
  }

  getError(type) {
    return this._errors[type]
  }

  getValue(type) {
    return this[type];
  }

  @action
  setValue(type, value) {
    this[type] = value;
    this._car.clearError();
    this.clearErrors();
  }

  @action
  setCost(value) {
    this._cost = value;
  }
}

export default TariffCarBaseWorkMileage;