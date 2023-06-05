import { observable, computed, action } from 'mobx';
import FieldCostInterface from './FieldCostInterface';

class TariffLoaderDistance extends FieldCostInterface {
  static getKey({ distance }) {
    return `${distance}`;
  }

  @observable _cost = null;

  _distance;

  _loader;

  constructor({ distance, cost = null, loader }) {
    super();
    this._distance = distance;
    this._loader = loader;

    this.setDistance(distance);
    this.setCost(cost);
  }

  @computed
  get distance() {
    return this._distance;
  }

  @action
  setDistance(distance) {
    this._distance = distance;
  }

  get key() {
    return this.constructor.getKey({
      distance: this._distance,
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
    return this._loader
  }
}

export default TariffLoaderDistance;
