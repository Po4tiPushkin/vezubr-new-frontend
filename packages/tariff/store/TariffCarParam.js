import { observable, computed, action } from 'mobx';
import FieldCostInterface from './FieldCostInterface';
import validateTariffBase from '../validators/validateTariffBase';

class TariffCarParam extends FieldCostInterface {
  static getKey({ parameter }) {
    return parameter;
  }

  _parameter;

  _car;

  @observable _error = null;

  @observable _value = null;

  constructor({ parameter, car, value: valueInput }) {
    super();
    this._parameter = parameter;
    this._car = car;

    const { defaultServiceValues } = car.tariff;
    const value =
      typeof valueInput !== 'undefined' ? valueInput : defaultServiceValues?.[parameter];

    this.setValue(value);
  }

  get parameter() {
    return this._parameter;
  }

  get key() {
    return this.constructor.getKey({
      _parameter: this._parameter,
    });
  }

  @action
  setError(errorValue) {
    this._error = errorValue;
  }

  @action
  clearError() {
    this.setError(null);
  }

  @computed
  get error() {
    return this._error;
  }

  @computed
  get cost() {
    return this.value;
  }

  @action
  setCost(cost) {
    this.setValue(cost);
  }

  @action
  setValue(cost) {
    this._value = cost;
    if (validateTariffBase.isNumber(cost)) {
      this.clearError();
      this.car.clearError();
    }
  }

  @computed
  get value() {
    return this._value;
  }

  get car() {
    return this._car;
  }
}

export default TariffCarParam;