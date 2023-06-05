import { isNumber } from '@vezubr/common/utils';
import { observable, computed, action, override } from 'mobx';
import validateTariffHourly from '../validators/validateTariffHourly';
import TariffBase from './TariffBase';
import TariffLoaderBaseWork from './TariffLoaderBaseWork';
import TariffLoaderService from './TariffLoaderService';
import TariffLoaderDistance from './TariffLoaderDistance';
import TariffLoader from './TariffLoader';
import _difference from 'lodash/difference';
import { getArrayFromMapWithMerge } from '../utils';
import { computedFn } from 'mobx-utils';
import { Utils } from '@vezubr/common/common';
import _uniq from 'lodash/uniq';
import _pullAll from 'lodash/pullAll';
import _groupBy from 'lodash/groupBy';
import _union from 'lodash/union';
import { SERVICES_TO_SPECIALITIES } from '../constants';

class TariffLoaders extends TariffBase {
  _type = 2;

  @observable.struct _services = [];

  @observable _loaders = [];

  @observable.struct _loaderErrors = {};

  @observable _distanceCosts = {};

  getLoaderErrors() {
    return this._loaderErrors;
  }

  getLoaderError = computedFn(function (key) {
    return this._loaderErrors?.[key] || null;
  });

  clearLoaderErrors() {
    this._loaderErrors = {};
  }

  @action
  addBaseWork({ hoursWork }) {
    const key = TariffLoaderBaseWork.getKey({ hoursWork });
    if (!this._baseWorks[key]) {
      for (const loader of this._loaders) {
        loader.addBaseWork({ hoursWork });
      }
      this._baseWorks[key] = { hoursWork };
      return true;
    }
    return false;
  }

  @action
  removeBaseWork({ hoursWork }) {
    const key = TariffLoaderBaseWork.getKey({ hoursWork });
    if (this._baseWorks[key]) {
      delete this._baseWorks[key];
      for (const loader of this._loaders) {
        loader.removeBaseWork({ hoursWork });
      }
    }
  }

  @action
  _resetBaseWorks(defaultBaseWorks) {
    this._baseWorks = {};

    for (const baseWork of defaultBaseWorks) {
      const key = TariffLoaderBaseWork.getKey(baseWork);
      if (!this._baseWorks[key]) {
        const { hoursWork } = baseWork;
        this._baseWorks[key] = { hoursWork };
      }
    }
  }

  @action
  addDistance({ distance }) {
    const key = TariffLoaderDistance.getKey({ distance });
    if (!this._distanceCosts[key]) {
      for (const loader of this._loaders) {
        loader.addDistance({ distance });
      }
      this._distanceCosts[key] = { distance };
      return true;
    }
    return false;
  }

  @action
  removeDistance({ distance }) {
    const key = TariffLoaderDistance.getKey({ distance });
    if (this._distanceCosts[key]) {
      delete this._distanceCosts[key];
      for (const loader of this._loaders) {
        loader.removeDistance({ distance });
      }
    }
  }

  getSpecialityName(speciality) {
    if (speciality === -1) {
      return 'Добавить грузчика'
    }
    return this._loaderSpecialities.find(el => el.id === speciality)?.title
  }

  @action
  _resetDistanceCosts(defaultDistanceCosts) {
    this._distanceCosts = {};
    for (const baseCost of defaultDistanceCosts) {
      const { distance } = baseCost;
      const key = TariffLoaderDistance.getKey({ distance });
      if (!this._distanceCosts[key]) {
        this.addDistance({ distance })
      }
    }
  }


  @action
  setTariff({
    id,
    title,
    territoryId,
    dayHourTill,
    dayHourFrom,
    baseWorkCosts,
    serviceCosts,
    contractorId,
    distanceCosts,
  }) {
    this._clearErrors();
    this.setId(id);
    this.setTitle(title);
    this.setContractorId(contractorId);
    if (territoryId) {
      this.setTerritoryId(territoryId);
    }
    this.setDayHourTill(dayHourTill);
    this.setDayHourFrom(dayHourFrom);
    this._setLoadersFromTariff({ baseWorkCosts, serviceCosts, distanceCosts });
    this.addDefaultLoaderIfNeed();
  }

  @action
  setTerritoryId(territoryId) {
    this._territoryId = territoryId;
    if (validateTariffHourly.isNumber(territoryId)) {
      this.clearError('territoryId');
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

  get distanceData() {
    const distanceData = [];

    for (const baseCost of Object.values(this._distanceCosts)) {
      const { distance, cost } = baseCost;

      distanceData.push({
        distance,
        cost,
      });
    }

    return distanceData;
  }

  @action
  setUseServices(servicesInput) {
    this._useServices = servicesInput;
    for (const loader of this._loaders) {
      for (const service of this.services) {
        if (!loader.getService(service)) {
          loader.addService(service);
        }
      }
    }
  }

  @action
  setUseMainServices(servicesInput) {
    this._useMainServices = servicesInput;
    for (const loader of this._loaders) {
      for (const service of this.services) {
        if (!loader.getService(service)) {
          loader.addService(service);
        }
      }
    }
  }

  @computed
  get useMainServices() {
    return this._useMainServices;
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
  removeLoader(loader) {
    this._loaders = this._loaders.filter((v) => v !== loader);
    this.addDefaultLoaderIfNeed();
  }

  _createLoader({
    speciality,
    baseWorkCosts: baseWorkCostsInput,
    serviceCosts: serviceCostsInput,
    distanceCosts: distanceCostsInput
  } = {}) {
    const baseWorkCosts = getArrayFromMapWithMerge(this.baseWorks, TariffLoaderBaseWork.getKey, baseWorkCostsInput);
    const serviceCosts = getArrayFromMapWithMerge(
      [...this.services, ...this.mainServices],
      TariffLoaderService.getKey,
      serviceCostsInput,
    );

    const distanceCosts = getArrayFromMapWithMerge(this.distanceData, TariffLoaderDistance.getKey, distanceCostsInput)

    return new TariffLoader({
      speciality,
      baseWorkCosts,
      serviceCosts,
      distanceCosts,
      tariff: this,
    });
  }

  @action
  addLoader(params) {
    this._loaders.push(this._createLoader(params));
  }

  @action
  clearLoaders() {
    this._loaders = [];
  }

  @action
  addDefaultLoaderIfNeed() {
    if (!this.editable) {
      return;
    }

    for (const loader of this._loaders) {
      if (loader.speciality === -1) {
        return;
      }
    }
    this.addLoader({ speciality: -1 });
  }

  @action
  _setLoadersFromTariff({ baseWorkCosts, serviceCosts, distanceCosts }) {
    this.clearLoaders();

    let baseWorkCostsObj = {};
    let distanceCostsObj = {};

    if (baseWorkCosts) {
      this._resetBaseWorks(baseWorkCosts);
      baseWorkCostsObj = _groupBy(baseWorkCosts, (o) => TariffLoader.getKey(o));
    }
    if (distanceCosts) {
      this._resetDistanceCosts(distanceCosts);
      distanceCostsObj = _groupBy(distanceCosts, (o) => TariffLoader.getKey(o))
    }

    const serviceCostsObj = _groupBy(serviceCosts, (o) => TariffLoader.getKey(o));

    const existLoaderKeys = _union(Object.keys(baseWorkCostsObj), Object.keys(serviceCostsObj));
    for (const existLoaderKey of existLoaderKeys) {
      const serviceCosts = serviceCostsObj?.[existLoaderKey];
      const baseWorkCosts = baseWorkCostsObj?.[existLoaderKey];
      const distanceCosts = distanceCostsObj?.[existLoaderKey];
      this.addLoader({
        speciality: existLoaderKey,
        serviceCosts,
        baseWorkCosts,
        distanceCosts
      });
    }
  }

  @computed
  get availableLoaderSpecialities() {
    const availableSpecialitiesList = [];
    this._loaderSpecialities.forEach(el => {
      if (!this._loaders.find(item => item.speciality === el.id)) {
        availableSpecialitiesList.push(el)
      }
    })
    return availableSpecialitiesList;
  }

  @computed
  get dataSource() {
    const dataSource = [];
    for (const loader of this._loaders) {
      dataSource.push({
        loaderKey: loader.key,
        speciality: loader.speciality,
        loader,
      });
    }
    return dataSource;
  }

  @action
  getValidateData() {
    const errors = {
      ...this._errors,
    };

    const { id, type, dayHourTill, dayHourFrom, territoryId, title } = this;
    if (!isNumber(dayHourFrom)) {
      errors.dayHourFrom = 'Некорректное время';
    }

    if (!isNumber(dayHourTill)) {
      errors.dayHourTill = 'Некорректное время';
    }

    if (!validateTariffHourly.noEmptyString(title)) {
      errors.title = 'Поле обязательное';
    }

    if (!territoryId) {
      errors.territoryId = 'Выберите регион';
    }

    // let baseLoadersWorkCosts = this.baseWorkData.filter(el => el.cost);
    // let loadersWorkDistanceCosts = this.distanceData.filter(el => el.cost).map(el => { el.distance *= 1000; return el });
    // let loadersServiceCosts = this._services.map(el => {
    //   return {
    //     costPerService: this.getService(el).costPerService,
    //     article: el.article,
    //   }
    // }).filter(el => el.costPerService);

    let hasError = false;

    // if (!baseLoadersWorkCosts.find(el => el.cost)) {
    //   this._loaderErrors = 'Не заполнено ни одно поле работы в часах'
    //   hasError = true;
    // }

    // if (!loadersWorkDistanceCosts.find(el => el.cost)) {
    //   this._loaderErrors = 'Не заполнено ни одно поле работы в часах'
    //   hasError = true;
    // }

    const loaderErrors = {};

    let baseLoadersWorkCosts = [];
    let loadersServiceCosts = [];
    let loadersWorkDistanceCosts = [];
    const specialityServiceCosts = [];

    for (const loader of this._loaders) {
      if (!loader.speciality || loader.speciality === -1) {
        continue;
      }
      const { key, baseWorkData: currBaseWorkData, distanceData: currDistanceData } = loader;
      const useMainServicesLength = this.useMainServices.length;
      const useMainServices = useMainServicesLength > 0;
      let useMainServicesError = false;

      const currMainServicesData = [];

      if (useMainServices) {
        for (const serviceItem of this.mainServices) {
          const serviceItemData = loader.getServiceData(serviceItem);
          if (serviceItemData === null) {
            useMainServicesError = true;
            loader.getService(serviceItem).setError('Обязательное поле');
          } else {
            currMainServicesData.push(serviceItemData);
          }
        }
      }

      const currServicesData = [...currMainServicesData, ...loader.getServicesDataByListService(this.serviceData)];

      if (useMainServices && useMainServicesError) {
        loaderErrors[key] = 'Заполните обязательные поля';
      } else if (!currServicesData.length) {
        loaderErrors[key] = 'Не заполнено ни одно поле в услугах';
      } else if (!currBaseWorkData.length) {
        loaderErrors[key] = 'Не заполнено ни одно поле работы в часах';
      }
      loadersServiceCosts = loadersServiceCosts.concat(currServicesData);
      baseLoadersWorkCosts = baseLoadersWorkCosts.concat(currBaseWorkData);
      loadersWorkDistanceCosts = loadersWorkDistanceCosts.concat(currDistanceData);
      loadersServiceCosts.forEach(el => {
        const specialityService = SERVICES_TO_SPECIALITIES.find(item => item.article === el.article);
        if (specialityService) {
          specialityServiceCosts.push(
            {
              ...el,
              article: this._loaderSpecialities.find(val => val.id === el.speciality)?.[specialityService.name]
            })
        }
      })
      loadersServiceCosts = loadersServiceCosts.filter(el => !SERVICES_TO_SPECIALITIES.find(item => el.article === item.article))
    }

    if (
      (!baseLoadersWorkCosts.length ||
        (
          !loadersServiceCosts.length &&
          !specialityServiceCosts.length
        )) &&
      Object.keys(loaderErrors).length === 0
    ) {
      errors.tariffScale = 'Тарифная сетка должна иметь хотя бы одного специалиста';
    }

    for (const errValue of Object.values(errors)) {
      if (errValue) {
        hasError = true;
        break;
      }
    }

    if (Object.keys(loaderErrors).length > 0) {
      hasError = true;
    }

    this._errors = errors;
    this._loaderErrors = loaderErrors
    const values = {
      ...(id ? { id } : {}),
      type,
      dayHourFrom,
      dayHourTill,
      territoryId,
      title,
      baseLoadersWorkCosts,
      loadersServiceCosts,
      loadersWorkDistanceCosts: loadersWorkDistanceCosts.filter(el => el.cost),
      specialityServiceCosts,
    };
    return {
      values,
      hasError,
    };
  }
}

export default TariffLoaders;
