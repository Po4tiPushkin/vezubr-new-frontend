import { observable, computed, action } from 'mobx';
import validateTariffFixed from '../validators/validateTariffFixed';
import * as Order from '@vezubr/order/form';
import TariffBase from './TariffBase';
import { isNumber, uuid } from '@vezubr/common/utils';
import { convertRouteTypes } from '../utils';

class TariffFixed extends TariffBase {
  _type = 3;

  @observable.struct _addresses = [];
  @observable.struct _cities = [];
  @observable.struct _routeType = APP == "dispatcher" ? 1 : 0;
  @observable.struct _countTimeLimit = null;
  @action
  setTariff({
    id,
    type,
    title,
    dayHourFrom,
    dayHourTill,
    addresses,
    cities,
    serviceCosts,
    serviceParams,
    routeType,
    contractorId,
    territoryId,
  }) {

    if (cities) {
      const newCities = cities.map(el => {
        el.isNew = false
        return el
      })
      this.setCities(newCities);
    } else if (addresses) {
      this.setAddresses(addresses);
    }
    this._clearErrors();
    this.setId(id);
    this.setTitle(title);
    this.setDayHourTill(dayHourTill);
    this.setDayHourFrom(dayHourFrom);
    this._setVehiclesFromTariff({ serviceCosts, paramsCosts: serviceParams });
    this.addDefaultVehicleIfNeed();
    this.setRouteType(convertRouteTypes(routeType));
    this.setContractorId(contractorId);
    if (territoryId) {
      this.setTerritoryId(territoryId);
    }
  }

  @action
  setTerritoryId(territoryId) {
    this._territoryId = territoryId;
    if (validateTariffFixed.isNumber(territoryId)) {
      this.clearError('territoryId');
    }
  }

  @action
  setAddresses(addresses) {
    this._addresses = addresses;
    this._errors['addresses'] = validateTariffFixed.addresses(addresses);
  }

  @computed
  get addresses() {
    return this._addresses;
  }

  @action
  setCities(cities) {
    this._cities = cities;
    this._errors['cities'] = validateTariffFixed.cities(cities);
  }

  @computed
  get cities() {
    return this._cities;
  }

  @computed
  get routeType() {
    return this._routeType;
  }

  @action
  setRouteType(type) {
    this._routeType = type;
    this.clearError('routeType');
  }

  @computed
  get countTimeLimit() {
    return this._countTimeLimit
  }

  @action
  setCountTimeLimit(value) {
    this._countTimeLimit = value
  }

  @action
  getValidateData() {
    const errors = {
      ...this._errors,
    };

    const {
      id,
      type,
      dayHourFrom,
      dayHourTill,
      addresses: addressesInput,
      title,
      countTimeLimit,
      routeType,
      territoryId,
      cities,
    } = this;

    if (!isNumber(dayHourFrom)) {
      errors.dayHourFrom = 'Некорректное время';
    }

    if (!isNumber(dayHourTill)) {
      errors.dayHourTill = 'Некорректное время';
    }

    if (!validateTariffFixed.noEmptyString(title)) {
      errors.title = 'Поле обязательное';
    }

    if (!territoryId) {
      errors.territoryId = 'Выберите регион';
    }

    const addresses = Order.Utils.getAddressesSave(addressesInput);

    if (this._routeType === 0) {
      const errorAddresses = validateTariffFixed.addresses(addressesInput);

      if (errorAddresses) {
        errors['addresses'] = errorAddresses;
      }
      errors['cities'] = false;
    } else {
      const errorCities = validateTariffFixed.cities(cities);

      if (errorCities) {
        errors['cities'] = errorCities;
      }
      errors['addresses'] = false;
    }

    let serviceCosts = [];
    let serviceParams = []

    const vehicleErrors = {};

    for (const vehicle of this._vehicles) {
      if (!vehicle.vehicleTypeId) {
        continue;
      }

      const { key: vehicleKey } = vehicle;

      const useMainServicesLength = this.useMainServices.length;
      const useMainServices = useMainServicesLength > 0;
      const useServiceParams = this.useServiceParams.length > 0;
      let useMainServicesError = false;
      const currMainServicesData = [];

      if (useMainServices) {
        for (const serviceItem of this.mainServices) {
          const serviceItemData = vehicle.getServiceData(serviceItem);
          if (serviceItemData === null) {
            useMainServicesError = true;
            vehicle.getService(serviceItem).setError('Обязательное поле');
          } else {
            currMainServicesData.push(serviceItemData);
          }
        }
      }
      if (useServiceParams) {
        for (const paramItem of this.params) {
          const paramItemData = vehicle.getParamData(paramItem);
          if (paramItemData) {
            serviceParams.push(paramItemData);
          }
        }
      }

      const currServicesData = [...currMainServicesData, ...vehicle.getServicesDataByListService(this.serviceData)];

      if (vehicle.bodyTypes.length === 0) {
        vehicleErrors[vehicleKey] = 'Не выбран тип кузова';
      } else if (useMainServices && useMainServicesError) {
        vehicleErrors[vehicleKey] = 'Заполните обязательные поля';
      }
      // else if (!currServicesData.length) {
      //   vehicleErrors[vehicleKey] = 'Не заполнено ни одно поле в услугах';
      // }

      serviceCosts = serviceCosts.concat(currServicesData);
    }

    if (!this._vehicles.find(el => el.vehicleTypeId)) {
      errors.tariffScale = 'Тарифная сетка должна иметь хотя бы одну машину';
    }

    let routeTypeParsed = convertRouteTypes(routeType);
    if (!routeTypeParsed) {
      errors.routeType = 'Выберите вариант маршрута';
    }
    const values = {
      ...(id ? { id } : {}),
      title,
      type,
      dayHourFrom,
      dayHourTill,
      addresses,
      serviceCosts,
      cities,
      territoryId,
      countTimeLimit,
      routeType: routeTypeParsed,
      serviceParams
    };

    let hasError = false;

    for (const errValue of Object.values(errors)) {
      if (errValue) {
        hasError = true;
        break;
      }
    }

    if (Object.keys(vehicleErrors).length > 0) {
      hasError = true;
    }

    this._errors = errors;
    this._vehicleErrors = vehicleErrors;

    return {
      values,
      hasError,
    };
  }
}

export default TariffFixed;
