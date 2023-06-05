import { observable, computed, action } from 'mobx';
// import _uniq from 'lodash/uniq';
import _pullAll from 'lodash/pullAll';
// import _difference from 'lodash/difference';
import RouteVehicle from './RouteVehicle';
import { computedFn } from 'mobx-utils';
import validateRoute from "../validators/validateRoute";
// import _groupBy from 'lodash/groupBy';
// import _union from 'lodash/union';

class Base {
  @observable _id;

  @observable _vehicles = [];

  _vehicleTypesList;

  _vehicleTypes;

  _veerouteTypesList;

  _veerouteTypes;

  @observable _cargoPlaceIds = [];

  @observable _configuration = 'optimize_distance';

  @observable _errors = {};

  @observable _vehicleErrors = {};

  constructor(params) {
    const { vehicleTypes, veeroutePlanTypes } = params;
    this._clearErrors();
    this._setVeeroutePlanTypes(veeroutePlanTypes);
    this._setVehicleTypes(vehicleTypes);
    this._init(params);
  }

  _init() {
    this.addDefaultVehicleIfNeed();
  }

  @computed
  get veeroutePlanTypes() {
    return this._veerouteTypesList;
  }

  _setVeeroutePlanTypes(veerouteTypes) {
    this._veerouteTypesList = veerouteTypes;
    this._veerouteTypes = {};

    for (const type of veerouteTypes) {
      this._veerouteTypes[type.id] = type;
    }
  }

  _setVehicleTypes(vehicleTypesList) {
    this._vehicleTypesList = vehicleTypesList;

    this._vehicleTypes = {};

    for (const vehicle of vehicleTypesList) {
      this._vehicleTypes[vehicle.id] = vehicle;
    }
  }

  getVehicleTypeName(vehicleTypeId) {
    return this._vehicleTypes?.[vehicleTypeId]?.name || 'Новая машина';
  }

  get allVehicleTypeIds() {
    return this._vehicleTypesList.map(({ id }) => ~~id);
  }

  @action
  _clearErrors() {
    this._errors = {};
    this._vehicleErrors = {};
  }

  @action
  clearError(errorField) {
    this._errors[errorField] = null;
  }

  getError = computedFn(function (errorField) {
    return (this._errors?.[errorField]) || null;
  });

  @action
  clearVehicleError(vehicleKey) {
    delete this._vehicleErrors[vehicleKey];
  }

  getVehicleError = computedFn(function (vehicleKey) {
    return this._vehicleErrors?.[vehicleKey] || null;
  });

  @action
  getValidateData() {
    console.warn('you must implement the getValidateData');
  }

  @computed
  get availableVehicleTypeIds() {
    const allVehicleTypeIds = this.allVehicleTypeIds;

    const excludedVehicleTypeIds = [];

    _pullAll(allVehicleTypeIds, excludedVehicleTypeIds);

    if (!allVehicleTypeIds.length) {
      return null;
    }

    return allVehicleTypeIds;
  }

  @computed
  get cargoPlaceIds() {
    return this._cargoPlaceIds;
  }

  @action
  setCargoPlaceIds(val) {
    this._cargoPlaceIds = val;
  }

  @action
  addDefaultVehicleIfNeed() {
    for (const vehicle of this._vehicles) {
      if (vehicle._vehicleTypeId === 0) {
        return;
      }
    }

    if (this.availableVehicleTypeIds) {
      this.addVehicle({ vehicleTypeId: 0, vehicleCount: null, vehicleStartAt: null, vehicleEndAt: null });
    }
  }

  _createVehicle({
    vehicleTypeId,
    vehicleCount,
    vehicleStartAt,
    vehicleEndAt,
  } = {}) {
    return new RouteVehicle({
      vehicleTypeId,
      vehicleCount,
      vehicleStartAt,
      vehicleEndAt,
      tariff: this,
    });
  }

  @action
  setConfiguration(val) {
    this._configuration = val;
    if (validateRoute.noEmptyConfiguration(val)) {
      this.clearError('configuration');
    }
  }

  @computed
  get configuration() {
    return this._configuration;
  }

  @action
  addVehicle(params) {
    this._vehicles.push(this._createVehicle(params));
  }

  @action
  removeVehicle(vehicle) {
    this._vehicles = this._vehicles.filter((v) => v !== vehicle);
    this.addDefaultVehicleIfNeed();
  }

  @action
  clearVehicles() {
    this._vehicles = [];
  }

  @action
  setId(id) {
    this._id = id;
  }

  @computed
  get id() {
    return this._id;
  }

  @computed
  get dataSource() {
    const dataSource = [];

    for (const vehicle of this._vehicles) {
      dataSource.push({
        vehicleKey: vehicle.key,
        vehicleTypeId: vehicle.vehicleTypeId,
        vehicle,
      });
    }

    return dataSource;
  }
}

export default Base;
