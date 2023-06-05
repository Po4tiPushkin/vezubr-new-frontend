import { observable, computed, action, runInAction } from 'mobx';
import _uniq from 'lodash/uniq';
import _pullAll from 'lodash/pullAll';
import _difference from 'lodash/difference';
import TariffCar from './TariffCar';
import TariffCarBaseWork from './TariffCarBaseWork';
import TariffCarService from './TariffCarService';
import { computedFn } from 'mobx-utils';
import validateTariffBase from '../validators/validateTariffBase';
import { Utils } from '@vezubr/common/common';
import { isNumber } from '@vezubr/common/utils';
import { getArrayFromMapWithMerge, getPlaceholder } from '../utils';
import _groupBy from 'lodash/groupBy';
import _union from 'lodash/union';

class TariffBase {
  @observable _id;

  _type = 0;

  @observable _vehicles = [];

  @observable _editable = true;

  @observable _title = '';

  _contractorId = null;

  _vehicleTypesList;

  _vehicleTypes;

  _bodyTypes;

  _defaultServiceValues;

  _loaderSpecialities;

  @observable _additionalServices = [];

  @observable _services = {};

  @observable _baseWorks = {};

  @observable _errors = {};

  @observable _vehicleErrors = {};

  _orderServices;
  _serviceParams;

  @observable _useServiceParams = [];

  @observable _useMainServices = [];

  @observable _dayHourFrom = 0;

  @observable _dayHourTill = 24;

  @observable _territoryId = 1;

  _isClone = false;

  _placeholders = null;

  constructor(params) {
    const {
      vehicleTypes,
      orderServices,
      defaultServiceValues = {},
      vehicleBodies,
      editable,
      loaderSpecialities,
      additionalServices
    } = params;
    this._clearErrors();
    this._setDefaultServiceValues(defaultServiceValues);
    this._setVehicleTypes(vehicleTypes);
    this._setOrderServices(orderServices);
    this._setBodyTypes(vehicleBodies);
    this._setEditable(editable);
    this._setLoaderSpecialities(loaderSpecialities);
    this._setAdditionalServices(additionalServices);
    this._init(params);
  }

  _init(params) {
    const {
      tariff,
      useServices,
      useMainServices,
      defaultBaseWorks,
      defaultDistanceCosts,
      isLoader,
      useServiceParams,
      serviceParams,
      clone,
      placeholders
    } = params;

    if (defaultBaseWorks) {
      this._resetBaseWorks(defaultBaseWorks);
    }

    if (useMainServices) {
      this.setUseMainServices(useMainServices);
    }

    if (defaultDistanceCosts && !tariff) {
      this._resetDistanceCosts(defaultDistanceCosts);
    }
    if (serviceParams) {
      this.setServiceParams(serviceParams)
    }

    if (useServiceParams) {
      this.setUseServiceParams(useServiceParams)
    }

    if (tariff) {
      this.setTariff(tariff);
    }

    if (clone) {
      this._placeholders = placeholders;
      this._isClone = clone;
    }

    if (isLoader) {
      this.addDefaultLoaderIfNeed();
    }
    else {
      this.addDefaultVehicleIfNeed();
    }
  }

  @action
  setUseServiceParams(useServiceParamsInput) {
    this._useServiceParams = useServiceParamsInput;
    for (const vehicle of this._vehicles) {
      for (const param of this.params) {
        if (!vehicle.getParam(param)) {
          vehicle.addParam(param);
        }
      }
    }
  }

  @action
  setServiceParams(serviceParams) {
    this._serviceParams = serviceParams;
  }

  @computed
  get params() {
    return this._useServiceParams.map((parameter) => {
      const service = this._serviceParams?.[parameter];
      const name = service?.name || 'Неизвестная услуга';
      return {
        parameter,
        title:
          name +
          ', ' +
          (service?.unitValue || '₽')
      };
    });
  }

  @computed
  get useServiceParams() {
    return this._useServiceParams;
  }

  @computed
  get serviceParams() {
    return this._serviceParams;
  }

  _setDefaultServiceValues(defaultServiceValues) {
    this._defaultServiceValues = defaultServiceValues;
  }

  get defaultServiceValues() {
    return this._defaultServiceValues;
  }

  _setBodyTypes(vehicleBodies) {
    this._bodyTypes = vehicleBodies;
  }

  @computed
  get loaderSpecialities() {
    return this._loaderSpecialities;
  }

  _setLoaderSpecialities(specialities) {
    this._loaderSpecialities = specialities;
  }

  @computed
  get bodyTypesInVehicles() {
    const fullCountBodyTypes = this._bodyTypes.length;

    const bodyTypesByVehicleTypeIds = {};

    for (const vehicle of this._vehicles) {
      const { bodyTypes, vehicleTypeId, key } = vehicle;

      if (!bodyTypesByVehicleTypeIds?.[vehicleTypeId]) {
        bodyTypesByVehicleTypeIds[vehicleTypeId] = {
          bodyTypes: [],
          isFull: false,
        };
      }

      const current = bodyTypesByVehicleTypeIds[vehicleTypeId];
      current.bodyTypes = _uniq(current.bodyTypes.concat(bodyTypes));
      current.isFull = fullCountBodyTypes === current.bodyTypes.length;
    }

    return bodyTypesByVehicleTypeIds;
  }

  getBodyTypesName(bodyTypeId) {
    return this._bodyTypes.find((el) => el.id === bodyTypeId)?.title;
  }

  get bodyTypes() {
    return this._bodyTypes;
  }

  get bodyTypesList() {
    return this._bodyTypes;
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
  _resetBaseWorks(defaultBaseWorks) {
    this._baseWorks = {};

    for (const baseWork of defaultBaseWorks) {
      const key = TariffCarBaseWork.getKey(baseWork);
      if (!this._baseWorks[key]) {
        const { hoursWork, hoursInnings } = baseWork;
        this._baseWorks[key] = { hoursWork, hoursInnings };
      }
    }
  }

  _setOrderServices(services) {
    this._orderServices = services;
  }

  @computed
  get orderServices() {
    return this._orderServices
  }

  @computed
  get vehicleTypesList() {
    return this._vehicleTypesList;
  }

  @computed
  get additionalServices() {
    return this._additionalServices;
  }

  @action
  _setAdditionalServices(additionalServices) {
    this._additionalServices = additionalServices
  }

  @computed
  get services() {
    return this._services;
  }

  setServices(serviceCosts) {
    for (const service of serviceCosts) {
      this.addService(service)
    }
  }

  @computed
  get allServices() {
    const mainServices = this.useMainServices.map((article) => {
      const service = this._orderServices?.[article];
      const name = service?.name || 'Неизвестная услуга';
      return {
        article,
        title:
          name +
          ', ' +
          (service?.unitValue || '₽') +
          (article !== 1405 ? (service?.unit ? `/${service.unit.replace(/[\(\)]/gi, '')}` : '') : '/час'),
      };
    });
    const services = Object.values(this._services).map(({ article }) => {
      const service = this._orderServices?.[article];
      const name = service?.name || 'Неизвестная услуга';
      return {
        article,
        title:
          name +
          ', ' +
          (service?.unitValue || '₽') +
          (article !== 1405 ? (service?.unit ? `/${service.unit.replace(/[\(\)]/gi, '')}` : '') : '/час'),
      };
    })
    return [...mainServices, ...services]
  }

  @action
  setUseMainServices(servicesInput) {
    this._useMainServices = servicesInput;
    for (const vehicle of this._vehicles) {
      for (const service of this.allServices) {
        if (!vehicle.getService(service)) {
          vehicle.addService(service);
        }
      }
    }
  }

  @computed
  get useMainServices() {
    return this._useMainServices;
  }

  @computed
  get territoryId() {
    return this._territoryId;
  }

  @computed
  get mainServices() {
    return this.useMainServices.map((article) => {
      const service = this._orderServices?.[article];
      const name = service?.name || 'Неизвестная услуга';
      return {
        article,
        title:
          name +
          ', ' +
          (service?.unitValue || '₽') +
          (article !== 1405 ? (service?.unit ? `/${service.unit.replace(/[\(\)]/gi, '')}` : '') : '/час'),
      };
    });
  }

  @action
  setTariff(params) {
    console.warn('you must implement the setTariff');
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
    return (this._editable && this._errors?.[errorField]) || null;
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

  @action
  addBaseWork({ hoursWork, hoursInnings }) {
    const key = TariffCarBaseWork.getKey({ hoursWork, hoursInnings });
    if (!this._baseWorks[key]) {
      for (const vehicle of this._vehicles) {
        vehicle.addBaseWork({ hoursWork, hoursInnings });
      }
      this._baseWorks[key] = { hoursWork, hoursInnings };
      return true;
    }

    return false;
  }

  @action
  removeBaseWork({ hoursWork, hoursInnings }) {
    const key = TariffCarBaseWork.getKey({ hoursWork, hoursInnings });
    if (this._baseWorks[key]) {
      delete this._baseWorks[key];

      for (const vehicle of this._vehicles) {
        vehicle.removeBaseWork({ hoursWork, hoursInnings });
      }
    }
  }

  @computed
  get baseWorks() {
    const baseWorks = Object.values(this._baseWorks);
    return baseWorks.sort((a1, a2) => {
      const hoursWorkCompare = Utils.stdCompare(a1.hoursWork, a2.hoursWork);
      if (hoursWorkCompare !== 0) {
        return hoursWorkCompare;
      }
      return Utils.stdCompare(a1.hoursInnings, a2.hoursInnings);
    });
  }

  @action
  addService({ article }) {
    const key = TariffCarService.getKey({ article });
    if (!this._services[key]) {
      for (const vehicle of this._vehicles) {
        vehicle.addService({ article });
      }
      this._services[key] = { article };
      return true;
    }
    return false;
  }

  @action
  removeService({ article }) {
    const key = TariffCarService.getKey({ article });
    if (this._services[key]) {
      delete this._services[key];

      for (const vehicle of this._vehicles) {
        vehicle.removeService({ article });
      }
    }
  }

  get serviceData() {
    const serviceData = [];

    for (const baseCost of Object.values(this._services)) {
      const { article, cost } = baseCost;

      serviceData.push({
        article,
        cost,
      });
    }

    return serviceData;
  }

  @computed
  get availableVehicleTypeIds() {
    const allVehicleTypeIds = this.allVehicleTypeIds;

    const bodyTypesByVehicleTypeIds = this.bodyTypesInVehicles;

    const excludedVehicleTypeIds = [];

    for (const vehicleTypeIdString of Object.keys(bodyTypesByVehicleTypeIds)) {
      const vehicleTypeId = ~~vehicleTypeIdString;
      if (bodyTypesByVehicleTypeIds[vehicleTypeIdString].isFull) {
        excludedVehicleTypeIds.push(vehicleTypeId);
      }
    }

    _pullAll(allVehicleTypeIds, excludedVehicleTypeIds);

    if (!allVehicleTypeIds.length) {
      return null;
    }

    return allVehicleTypeIds;
  }

  @computed get placeholders() { return this._placeholders }

  @action
  addDefaultVehicleIfNeed() {
    if (!this.editable) {
      return;
    }

    for (const vehicle of this._vehicles) {
      if (vehicle._vehicleTypeId === 0) {
        return;
      }
    }

    if (this.availableVehicleTypeIds) {
      this.addVehicle({ vehicleTypeId: 0, bodyTypes: [] });
    }
  }

  _createVehicle({
    vehicleTypeId,
    bodyTypes,
    baseWorkCosts: baseWorkCostsInput,
    serviceCosts: serviceCostsInput,
    paramsCosts: paramsCostsInput,
  } = {}) {
    const baseWorkCosts = getArrayFromMapWithMerge(this.baseWorks, TariffCarBaseWork.getKey, baseWorkCostsInput);
    const serviceCosts = getArrayFromMapWithMerge(
      this.allServices,
      TariffCarService.getKey,
      serviceCostsInput,
    );
    const paramsCosts = getArrayFromMapWithMerge(
      this.params,
      TariffCarService.getKey,
      paramsCostsInput,
    )

    return new TariffCar({
      vehicleTypeId,
      bodyTypes,
      baseWorkCosts,
      serviceCosts,
      paramsCosts,
      tariff: this,
    });
  }

  @action
  _setVehiclesFromTariff({ baseWorkCosts, serviceCosts, paramsCosts }) {
    this.clearVehicles();
    let baseWorkCostsObj = {};
    let paramsCostsObj = {};
    if (baseWorkCosts) {
      this._resetBaseWorks(baseWorkCosts);
      baseWorkCostsObj = _groupBy(baseWorkCosts, (o) => TariffCar.getKey(o));
    }

    if (paramsCosts) {
      paramsCostsObj = _groupBy(paramsCosts, (o) => TariffCar.getKey(o))
    }

    const serviceCostsObj = _groupBy(serviceCosts, (o) => TariffCar.getKey(o));
    const existVehicleKeys = _union(Object.keys(baseWorkCostsObj), Object.keys(serviceCostsObj));

    this.setServices(serviceCosts.filter(el => this._additionalServices.includes(el.article)))

    for (const existVehicleKey of existVehicleKeys) {
      const serviceCosts = serviceCostsObj?.[existVehicleKey];
      const baseWorkCosts = baseWorkCostsObj?.[existVehicleKey];
      const paramsCosts = paramsCostsObj?.[existVehicleKey];
      const { vehicleTypeId, bodyTypes } = TariffCar.getObject(existVehicleKey);

      this.addVehicle({
        vehicleTypeId,
        bodyTypes,
        serviceCosts,
        baseWorkCosts,
        paramsCosts,
      });
    }
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
  setTitle(title) {
    this._title = title;
    if (validateTariffBase.noEmptyString(title)) {
      this.clearError('title');
    }
  }

  @computed
  get title() {
    return this._title;
  }

  @action
  setError(field, message) {
    if (this._errors[field] !== undefined) {
      this._errors[field] = message || null;
    }
  }

  @action
  setId(id) {
    this._id = id;
  }

  @action
  setContractorId(id) {
    this._contractorId = id;
  }

  @computed
  get contractorId() {
    return this._contractorId;
  }

  @computed
  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }
  @computed
  get isClone() {
    return this._isClone;
  }

  @action
  setDayHourTill(value) {
    this._dayHourTill = value;
    if (isNumber(value)) {
      this.clearError('dayHourTill');
    }
  }

  @computed
  get dayHourTill() {
    return this._dayHourTill;
  }

  @action
  setDayHourFrom(value) {
    this._dayHourFrom = value;
    if (isNumber(value)) {
      this.clearError('dayHourFrom');
    }
  }

  @computed
  get dayHourFrom() {
    return this._dayHourFrom;
  }

  @action
  _setEditable(flag) {
    this._editable = !!flag;
  }

  @action
  setEditable(flag) {
    this._setEditable(flag);
    this.addDefaultVehicleIfNeed();
  }

  @computed
  get editable() {
    return this._editable;
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

  onFillMargin(margin, marginFilled) {
    if (!this._placeholders || !margin) {
      return;
    }
    this._vehicles.forEach(el => {
      if (el.vehicleTypeId !== 0) {
        el.services.forEach(item => {
          const cost = item.cost || getPlaceholder(this._placeholders, el, item, 'services') || null;

          if (cost && item.cost !== 0) {
            if (marginFilled) {
              item.setCost(getPlaceholder(this._placeholders, el, item, 'services'))
            }
            else {
              if (margin.type === 'amount') item.setCost(cost - margin.value);
              else item.setCost(cost - cost * (margin.value / 100));
            }
          };
        });
        el.baseWorkDataClone.forEach(item => {
          const cost = item.cost || getPlaceholder(this._placeholders, el, item, 'baseWorks') || null;
          if (cost && item.cost !== 0) {
            if (marginFilled) {
              el.getBaseWork({ hoursWork: item.hoursWork, hoursInnings: item.hoursInnings })
                .setCost(getPlaceholder(this._placeholders, el, item, 'baseWorks'))
            }
            else {
              if (margin.type === 'amount')
                el.getBaseWork({ hoursWork: item.hoursWork, hoursInnings: item.hoursInnings }).setCost(cost - margin.value);
              else
                el.getBaseWork({ hoursWork: item.hoursWork, hoursInnings: item.hoursInnings })
                  .setCost(cost - cost * (margin.value / 100));
            }
          };
        });
      };
    });
  }
}

export default TariffBase;
