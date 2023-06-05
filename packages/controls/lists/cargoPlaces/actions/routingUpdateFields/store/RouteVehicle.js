import { observable, computed, action } from 'mobx';
import { Utils } from '@vezubr/common/common';

class RouteVehicle {

  _uuid;

  @observable _vehicleTypeId;

  @observable _vehicleCount;

  @observable _vehicleStartAt;

  @observable _vehicleEndAt;

  _tariff;

  constructor({ vehicleTypeId, vehicleCount, vehicleStartAt, vehicleEndAt, tariff }) {
    this._tariff = tariff;
    this._uuid = Utils.uuid;

    this.setVehicleTypeId(vehicleTypeId);
    this.setVehicleCount(vehicleCount);
    this.setVehicleStartAt(vehicleStartAt);
    this.setVehicleEndAt(vehicleEndAt);
  }

  get uuid() {
    return this._uuid;
  }

  @computed
  get key() {
    return this.uuid;
  }

  @action
  clearError() {
    this.tariff.clearVehicleError(this.key);
  }

  @action
  remove() {
    this.tariff.removeVehicle(this);
    this.clearError();
  }

  get tariff() {
    return this._tariff;
  }

  @computed
  get vehicleTypeId() {
    return this._vehicleTypeId;
  }

  @action
  setVehicleTypeId(vehicleTypeId) {
    this._vehicleTypeId = vehicleTypeId;
    this._vehicleTypeName = this.tariff.getVehicleTypeName(this._vehicleTypeId);
  }

  @computed
  get vehicleCount() {
    return this._vehicleCount;
  }

  @action
  setVehicleCount(vehicleCount) {
    this._vehicleCount = vehicleCount;
  }


  @computed
  get vehicleStartAt() {
    return this._vehicleStartAt;
  }

  @action
  setVehicleStartAt(vehicleStartAt) {
    this._vehicleStartAt = vehicleStartAt;
  }


  @computed
  get vehicleEndAt() {
    return this._vehicleEndAt;
  }

  @action
  setVehicleEndAt(vehicleEndAt) {
    this._vehicleEndAt = vehicleEndAt;
  }

  @computed
  get vehicleTypeName() {
    return this._vehicleTypeName;
  }
}

export default RouteVehicle;
