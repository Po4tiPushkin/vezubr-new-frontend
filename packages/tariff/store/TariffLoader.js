import { observable, computed, action } from 'mobx';
import TariffLoaderBaseWork from './TariffLoaderBaseWork';
import TariffLoaderService from './TariffLoaderService';
import TariffLoaderDistance from './TariffLoaderDistance';
import validateTariffBase from '../validators/validateTariffBase';
import { Utils } from '@vezubr/common/common';

class TariffLoader {
  _baseWorks = new Map();

  _services = new Map();

  _distance = new Map();

  _uuid;

  static getKey({ speciality }) {
    return speciality;
  }

  @observable _speciality;

  @observable _specialityName;

  _tariff;

  constructor({ speciality, serviceCosts, baseWorkCosts, tariff, distanceCosts }) {
    this._tariff = tariff;
    this._uuid = Utils.uuid;
    this.setSpeciality(speciality);
    this._setBaseWorks({ baseWorkCosts });
    this._setServices({ serviceCosts });
    this._setDistance({ distanceCosts });
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

  addDistance({ distance, cost }) {
    const distanceItem = new TariffLoaderDistance({
      distance,
      cost,
      loader: this,
    });
    this._distance.set(TariffLoaderDistance.getKey({ distance }), distanceItem);
  }

  @action
  removeDistance({ distance }) {
    const key = TariffLoaderDistance.getKey({ distance });
    if (this._distance.has(key)) {
      this._distance.delete(key);
    }
  }

  getDistance(keyAny) {
    const key = typeof keyAny === 'object' ? TariffLoaderDistance.getKey(keyAny) : keyAny;

    if (this._distance.has(key)) {
      return this._distance.get(key);
    }

    return null;
  }

  get distanceData() {
    const distanceData = [];
    const { speciality } = this;

    if (!speciality) {
      return distanceData;
    }


    for (const [, baseCost] of this._distance) {
      const { distance, cost } = baseCost;

      distanceData.push({
        distance,
        cost,
        speciality
      });
    }

    return distanceData;
  }

  addBaseWork({ cost, costPerHour, hoursWork }) {
    const baseWork = new TariffLoaderBaseWork({
      loader: this,
      hoursWork,
      cost,
      costPerHour,
    });

    this._baseWorks.set(TariffLoaderBaseWork.getKey({ hoursWork }), baseWork);
  }

  @action
  removeBaseWork({ hoursWork }) {
    const key = TariffLoaderBaseWork.getKey({ hoursWork });
    if (this._baseWorks.has(key)) {
      this._baseWorks.delete(key);
    }
  }

  @action
  clearError() {
    this.tariff.clearVehicleError(this.key);
  }

  @action
  remove() {
    this.tariff.removeLoader(this);
    this.clearError();
  }

  getBaseWork(keyAny) {
    const key = typeof keyAny === 'object' ? TariffLoaderBaseWork.getKey(keyAny) : keyAny;

    if (this._baseWorks.has(key)) {
      return this._baseWorks.get(key);
    }

    return null;
  }

  get baseWorkData() {
    const baseWorkData = [];

    const { speciality } = this;

    if (!speciality) {
      return baseWorkData;
    }

    for (const [, baseWork] of this._baseWorks) {
      const { hoursWork, cost } = baseWork;

      if (!validateTariffBase.isNumber(cost)) {
        continue;
      }

      baseWorkData.push({
        hoursWork,
        cost,
        speciality,
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

  _setDistance({ distanceCosts }) {
    this._distance.clear();

    for (const distanceCost of distanceCosts) {
      this.addDistance(distanceCost);
    }
  }

  addService({ article, costPerService }) {
    const service = new TariffLoaderService({
      loader: this,
      article,
      costPerService,
    });

    this._services.set(TariffLoaderService.getKey({ article }), service);
  }

  get services() {
    const services = [];

    for (const [serviceKey, service] of this._services) {
      services.push(service);
    }

    return services;
  }

  getServiceData(serviceItem) {
    const { speciality } = this;
    const { costPerService, article } = this.getService(serviceItem);

    if (!validateTariffBase.isNumber(costPerService)) {
      return null;
    }

    return {
      speciality,
      article,
      costPerService,
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

  getService(keyAny) {
    const key = typeof keyAny === 'object' ? TariffLoaderService.getKey(keyAny) : keyAny;

    if (this._services.has(key)) {
      return this._services.get(key);
    }

    return null;
  }

  _setServices({ serviceCosts }) {
    this._services.clear();

    for (const serviceCost of serviceCosts) {
      this.addService(serviceCost);
    }
  }

  get tariff() {
    return this._tariff;
  }

  @computed
  get speciality() {
    return this._speciality;
  }

  @action
  setSpeciality(speciality) {
    this._speciality = speciality;
    this._specialityName = this.tariff.getSpecialityName(this._speciality);
  }

  @computed
  get specialityName() {
    return this._specialityName;
  }
}

export default TariffLoader;
