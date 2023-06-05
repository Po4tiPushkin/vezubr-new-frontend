import { observable, computed, action } from 'mobx';
import TariffCarBaseWork from './TariffCarBaseWork';
import TariffCarService from './TariffCarService';
import TariffCarBaseWorkMileage from './TariffCarBWMileage';
import validateTariffBase from '../validators/validateTariffBase';
import { Utils } from '@vezubr/common/common';
import TariffCarParam from './TariffCarParam';

class TariffCar {
  _baseWorks = new Map();

  _services = new Map();

  _params = new Map();

  _mileageBaseWorks = new Map();

  _uuid;

  static getKey({ vehicleTypeId, bodyTypes: bodyTypesInput = [] } = {}) {
    const bodyTypes = [...bodyTypesInput];
    bodyTypes.sort((a, b) => ~~a - ~~b);
    return `${vehicleTypeId}:${bodyTypes.join('-')}`;
  }

  static getObject(key) {
    const [vehicleTypeIdString, bodyTypesString] = key.split(':');
    const vehicleTypeId = ~~vehicleTypeIdString;

    const bodyTypes = (bodyTypesString && bodyTypesString.split('-').map((b) => ~~b)) || [];

    return {
      vehicleTypeId,
      bodyTypes,
    };
  }

  @observable _vehicleTypeId;

  @observable _bodyTypes;

  @observable _vehicleTypeName;

  _tariff;

  constructor({ vehicleTypeId, serviceCosts, baseWorkCosts, tariff, bodyTypes, paramsCosts, mileageBaseWorks }) {
    this._tariff = tariff;
    this._uuid = Utils.uuid;
    this.setVehicleTypeId(vehicleTypeId);
    this.setBodyTypes(bodyTypes);
    this._setBaseWorks({ baseWorkCosts });
    this._setServices({ serviceCosts });
    if (paramsCosts) {
      this._setParams({ paramsCosts })
    }
    if (mileageBaseWorks) {
      this._setMileageBW(mileageBaseWorks)
    }
  }

  get uuid() {
    return this._uuid;
  }

  get firstLoad() {
    return this._firstLoad
  }

  set firstLoad(load) {
    if (typeof load === 'boolean');
    this._firstLoad = load
  }

  @computed
  get key() {
    return this.uuid;
  }

  addBaseWork({ cost, costPerHour, hoursWork, hoursInnings }) {
    const baseWork = new TariffCarBaseWork({
      car: this,
      hoursWork,
      hoursInnings,
      cost,
      costPerHour,
    });

    this._baseWorks.set(TariffCarBaseWork.getKey({ hoursWork, hoursInnings }), baseWork);
  }

  @action
  removeBaseWork({ hoursWork, hoursInnings }) {
    const key = TariffCarBaseWork.getKey({ hoursWork, hoursInnings });
    if (this._baseWorks.has(key)) {
      this._baseWorks.delete(key);
    }
  }

  addMileageBW({ cost, mileage, workMinutes, pointsCount }) {
    const baseWork = new TariffCarBaseWorkMileage({
      car: this,
      cost,
      mileage,
      workMinutes,
      pointsCount
    });

    this._mileageBaseWorks.set(TariffCarBaseWorkMileage.getKey({ cost }), baseWork);
    this.clearError();
  }

  @action
  removeMileageBW({ cost }) {
    const key = TariffCarBaseWorkMileage.getKey({ cost });
    if (this._mileageBaseWorks.has(key)) {
      this._mileageBaseWorks.delete(key);
    }
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

  getBaseWork(keyAny) {
    const key = typeof keyAny === 'object' ? TariffCarBaseWork.getKey(keyAny) : keyAny;

    if (this._baseWorks.has(key)) {
      return this._baseWorks.get(key);
    }

    return null;
  }

  get baseWorkData() {
    const baseWorkData = [];

    const { vehicleTypeId, bodyTypes } = this;

    if (!vehicleTypeId) {
      return baseWorkData;
    }

    for (const [, baseWork] of this._baseWorks) {
      const { hoursWork, hoursInnings, cost } = baseWork;

      if (!validateTariffBase.isNumber(cost)) {
        continue;
      }

      baseWorkData.push({
        vehicleTypeId,
        bodyTypes,
        hoursWork,
        hoursInnings,
        cost,
      });
    }

    return baseWorkData;
  }

  get baseWorkDataClone() {
    const baseWorkData = [];

    const { vehicleTypeId, bodyTypes } = this;

    if (!vehicleTypeId) {
      return baseWorkData;
    }

    for (const [, baseWork] of this._baseWorks) {
      const { hoursWork, hoursInnings, cost } = baseWork;

      if (!validateTariffBase.isNumber(cost)) {
        cost = null;
      }

      baseWorkData.push({
        vehicleTypeId,
        bodyTypes,
        hoursWork,
        hoursInnings,
        cost,
      });
    }

    return baseWorkData;
  }


  _setBaseWorks({ baseWorkCosts }) {
    this._baseWorks.clear();

    for (const baseWorkCost of baseWorkCosts) {
      this.addBaseWork(baseWorkCost);
    }
  }

  getMileageBW(keyAny) {
    const key = typeof keyAny === 'object' ? TariffCarBaseWorkMileage.getKey(keyAny) : keyAny;

    if (this._mileageBaseWorks.has(key)) {
      return this._mileageBaseWorks.get(key);
    }
    else {
      return {
        getValue: () => { },
        setValue: () => { },
        getError: () => { }
      }
    }
  }

  get mileageBWData() {
    const baseWorkData = [];

    const { vehicleTypeId, bodyTypes } = this;

    if (!vehicleTypeId) {
      return baseWorkData;
    }

    for (const [, baseWork] of this._mileageBaseWorks) {
      const { cost, mileage, workMinutes, pointsCount } = baseWork;

      if (!validateTariffBase.isNumber(cost)) {
        continue;
      }

      baseWorkData.push({
        vehicleTypeId,
        bodyTypes,
        mileage,
        workMinutes,
        pointsCount,
        cost,
      });
    }

    return baseWorkData;
  }

  get mileageBWDataClone() {
    const baseWorkData = [];

    const { vehicleTypeId, bodyTypes } = this;

    if (!vehicleTypeId) {
      return baseWorkData;
    }

    for (const [, baseWork] of this._mileageBaseWorks) {
      const { cost, mileage, workMinutes, pointsCount } = baseWork;

      if (!validateTariffBase.isNumber(cost)) {
        cost = null;
      }

      baseWorkData.push({
        vehicleTypeId,
        bodyTypes,
        mileage,
        workMinutes,
        pointsCount,
        cost,
      });
    }

    return baseWorkData;
  }

  _setMileageBW(baseWorkCosts) {
    this._mileageBaseWorks.clear();

    for (const baseWorkCost of baseWorkCosts) {
      this.addMileageBW(baseWorkCost);
    }
  }

  addService({ article, costPerService }) {
    const service = new TariffCarService({
      car: this,
      article,
      costPerService,
    });

    this._services.set(TariffCarService.getKey({ article }), service);
  }

  @action
  removeService({ article }) {
    const key = TariffCarService.getKey({ article });
    if (this._services.has(key)) {
      this._services.delete(key);
    }
  }

  addParam({ parameter, value }) {
    const service = new TariffCarParam({
      car: this,
      parameter,
      value,
    });

    this._params.set(TariffCarParam.getKey({ parameter }), service);
  }

  get services() {
    const services = [];

    for (const [serviceKey, service] of this._services) {
      services.push(service);
    }

    return services;
  }

  get params() {
    const params = [];

    for (const [paramKey, param] of this._params) {
      params.push(param)
    }
    return params;
  }

  getServiceData(serviceItem) {
    const { bodyTypes, vehicleTypeId } = this;
    const { costPerService, article } = this.getService(serviceItem);

    if (!validateTariffBase.isNumber(costPerService)) {
      return null;
    }

    return {
      vehicleTypeId,
      bodyTypes,
      article,
      costPerService,
    };
  }

  getParamData(paramItem) {
    const { bodyTypes, vehicleTypeId } = this;
    const { value, parameter } = this.getParam(paramItem);

    if (!validateTariffBase.isNumber(value)) {
      return null;
    }

    return {
      vehicleTypeId,
      bodyTypes,
      parameter,
      value,
    };
  }

  getServicesDataByListService(serviceList) {
    const serviceData = [];

    for (const serviceItem of serviceList) {
      const serviceDataItem = this.getServiceData(serviceItem);

      if (serviceDataItem === null) {
        continue;
      }

      serviceData.push(serviceDataItem);
    }

    return serviceData;
  }

  getParamsDataByListParam(paramList) {
    const paramData = [];

    for (const paramItem of paramList) {
      const paramDataItem = this.getParamData(paramItem);

      if (paramDataItem === null) {
        continue;
      }

      paramData.push(paramDataItem);
    }

    return paramData;
  }

  getService(keyAny) {
    const key = typeof keyAny === 'object' ? TariffCarService.getKey(keyAny) : keyAny;

    if (this._services.has(key)) {
      return this._services.get(key);
    }

    return null;
  }

  getParam(keyAny) {
    const key = typeof keyAny === 'object' ? TariffCarParam.getKey(keyAny) : keyAny;

    if (this._params.has(key)) {
      return this._params.get(key);
    }

    return null;
  }

  _setServices({ serviceCosts }) {
    this._services.clear();

    for (const serviceCost of serviceCosts) {
      this.addService(serviceCost);
    }
  }

  _setParams({ paramsCosts }) {
    this._params.clear();

    for (const paramCost of paramsCosts) {
      this.addParam(paramCost);
    }
  }

  get tariff() {
    return this._tariff;
  }

  @computed
  get vehicleTypeId() {
    return this._vehicleTypeId;
  }

  @action
  setBodyTypes(bodyTypesInput) {
    const bodyTypes = bodyTypesInput.sort((a, b) => a - b);

    this._bodyTypes = bodyTypes;

    if (bodyTypes.length > 0) {
      this.clearError();
    }
  }

  @computed
  get bodyTypes() {
    return this._bodyTypes;
  }

  @computed
  get bodyTypesList() {
    return this._bodyTypes.map(({ id, title }) => ({
      id,
      title,
    }));
  }

  @action
  setVehicleTypeId(vehicleTypeId) {
    this._vehicleTypeId = vehicleTypeId;
    this._vehicleTypeName = this.tariff.getVehicleTypeName(this._vehicleTypeId);
  }

  @computed
  get vehicleTypeName() {
    return this._vehicleTypeName;
  }
}

export default TariffCar;
