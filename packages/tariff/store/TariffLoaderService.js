import { observable, computed, action } from 'mobx';
import FieldCostInterface from './FieldCostInterface';
import validateTariffBase from '../validators/validateTariffBase';

class TariffLoaderService extends FieldCostInterface {
  static getKey({ article }) {
    return article;
  }

  _article;

  _loader;

  @observable _error = null;

  @observable _costPerService = null;

  constructor({ article, costPerService: costPerServiceInput, loader }) {
    super();
    this._article = article;
    this._loader = loader;

    const { defaultServiceValues } = loader.tariff;

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
      this.loader.clearError();
    }
  }

  @computed
  get costPerService() {
    return this._costPerService;
  }

  get loader() {
    return this._loader;
  }
}

export default TariffLoaderService;
