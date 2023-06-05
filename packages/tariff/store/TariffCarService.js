import { observable, computed, action } from 'mobx';
import FieldCostInterface from './FieldCostInterface';
import validateTariffBase from '../validators/validateTariffBase';

class TariffCarService extends FieldCostInterface {
  static getKey({ article }) {
    return article;
  }

  _article;

  _car;

  @observable _error = null;

  @observable _costPerService = null;

  constructor({ article, car, costPerService: costPerServiceInput }) {
    super();
    this._article = article;
    this._car = car;

    const { defaultServiceValues } = car.tariff;
    const costPerService =
      typeof costPerServiceInput !== 'undefined' ? costPerServiceInput : defaultServiceValues?.[article];

    this.setCostPerService(costPerService);
  }

  get article() {
    return this._article;
  }

  get key() {
    return this.constructor.getKey({
      _article: this._article,
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
    return this.costPerService;
  }

  @action
  setCost(cost) {
    this.setCostPerService(cost);
  }

  @action
  setCostPerService(cost) {
    this._costPerService = cost;
    if (validateTariffBase.isNumber(cost)) {
      this.clearError();
      this.car.clearError();
    }
  }

  @computed
  get costPerService() {
    return this._costPerService;
  }

  get car() {
    return this._car;
  }
}

export default TariffCarService;
