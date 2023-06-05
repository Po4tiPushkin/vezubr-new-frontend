import { isNumber } from '@vezubr/common/utils';
import { observable, computed, action } from 'mobx';
import validateTariffHourly from '../validators/validateTariffHourly';
import TariffBase from './TariffBase';

class TariffHourly extends TariffBase {
  _type = 1;

  @observable _roundMinutes = 60;

  @action
  setTariff({ id, type, title, territoryId, dayHourTill, dayHourFrom, baseWorkCosts, serviceCosts, contractorId, roundMinutes }) {
    this._clearErrors();
    this.setId(id);
    this.setTitle(title);
    this.setRound(roundMinutes);
    this.setContractorId(contractorId)
    if (territoryId) {
      this.setTerritoryId(territoryId);
    }
    this.setDayHourTill(dayHourTill);
    this.setDayHourFrom(dayHourFrom);
    this._setVehiclesFromTariff({ baseWorkCosts, serviceCosts });
    this.addDefaultVehicleIfNeed();
  }

  @action
  setTerritoryId(territoryId) {
    this._territoryId = territoryId;
    if (validateTariffHourly.isNumber(territoryId)) {
      this.clearError('territoryId');
    }
  }

  @action
  setRound(roundMinutes) {
    this._roundMinutes = roundMinutes;
  }

  @computed
  get roundMinutes() {
    return this._roundMinutes;
  }

  @action
  getValidateData() {
    const errors = {
      ...this._errors,
    };

    const { id, type, dayHourTill, dayHourFrom, territoryId, title, roundMinutes } = this;

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

    let baseWorkCosts = [];
    let serviceCosts = [];

    const vehicleErrors = {};

    for (const vehicle of this._vehicles) {
      if (!vehicle.vehicleTypeId) {
        continue;
      }

      const { key: vehicleKey, baseWorkData: currBaseWorkData } = vehicle;

      const useMainServicesLength = this.useMainServices.length;
      const useMainServices = useMainServicesLength > 0;
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

      const currServicesData = [...currMainServicesData, ...vehicle.getServicesDataByListService(this.serviceData)];

      if (vehicle.bodyTypes.length === 0) {
        vehicleErrors[vehicleKey] = 'Не выбран тип кузова';
      } else if (useMainServices && useMainServicesError) {
        vehicleErrors[vehicleKey] = 'Заполните обязательные поля';
      } else if (!currBaseWorkData.length && !currServicesData.length) {
        vehicleErrors[vehicleKey] = 'Не заполнено ни одно поле';
      } else if (!currBaseWorkData.length) {
        vehicleErrors[vehicleKey] = 'Не заполнено ни одно поле работы в часах';
      } 
      // else if (!currServicesData.length) {
      //   vehicleErrors[vehicleKey] = 'Не заполнено ни одно поле в услугах';
      // }

      baseWorkCosts = baseWorkCosts.concat(currBaseWorkData);
      serviceCosts = serviceCosts.concat(currServicesData);
    }

    if (!this._vehicles.find(el => el.vehicleTypeId)) {
      errors.tariffScale = 'Тарифная сетка должна иметь хотя бы одну машину';
    }

    const values = {
      ...(id ? { id } : {}),
      type,
      dayHourFrom,
      dayHourTill,
      territoryId,
      title,
      baseWorkCosts,
      serviceCosts,
      roundMinutes
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

export default TariffHourly;
