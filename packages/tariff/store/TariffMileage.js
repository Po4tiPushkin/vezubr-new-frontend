import { observable, computed, action } from 'mobx';
import validateTariffHourly from '../validators/validateTariffHourly';
import TariffBase from './TariffBase';
import TariffCar from './TariffCar';
import TariffCarService from './TariffCarService';
import TariffCarBaseWorkMileage from './TariffCarBWMileage';
import { Utils } from '@vezubr/common/common';
import { isNumber } from '@vezubr/common/utils';
import { getArrayFromMapWithMerge, getPlaceholder } from '../utils';
import _groupBy from 'lodash/groupBy';
import _union from 'lodash/union';
class TariffMilage extends TariffBase {
  _type = 4;

  @action
  setTariff({
    id,
    title,
    territoryId,
    dayHourTill,
    dayHourFrom,
    baseWorkCosts,
    serviceCosts,
    serviceParams,
    contractorId,
  }) {
    this._clearErrors();
    this.setId(id);
    this.setTitle(title);
    this.setContractorId(contractorId)
    if (territoryId) {
      this.setTerritoryId(territoryId);
    }
    this.setDayHourTill(dayHourTill);
    this.setDayHourFrom(dayHourFrom);
    this._setVehiclesFromTariff({ baseWorkCosts, serviceCosts, paramsCosts: serviceParams });
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
  _resetBaseWorks(defaultBaseWorks) {
    this._baseWorks = {};

    for (const baseWork of defaultBaseWorks) {
      const key = TariffCarBaseWorkMileage.getKey(baseWork);
      if (!this._baseWorks[key]) {
        const { cost } = baseWork;
        this._baseWorks[key] = { cost };
      }
    }
  }

  @action
  addBaseWork({ cost }) {
    const key = TariffCarBaseWorkMileage.getKey({ cost });
    if (!this._baseWorks[key]) {
      for (const vehicle of this._vehicles) {
        vehicle.addMileageBW({ cost });
      }
      this._baseWorks[key] = { cost };
      return true;
    }

    return false;
  }

  @action
  removeBaseWork({ cost }) {
    const key = TariffCarBaseWorkMileage.getKey({ cost });
    if (this._baseWorks[key]) {
      delete this._baseWorks[key];

      for (const vehicle of this._vehicles) {
        vehicle.removeMileageBW({ cost });
      }
    }
  }

  @computed
  get baseWorks() {
    const baseWorks = Object.values(this._baseWorks);
    return baseWorks.sort((a1, a2) => {
      const hoursWorkCompare = Utils.stdCompare(a1.cost, a2.cost);
      if (hoursWorkCompare !== 0) {
        return hoursWorkCompare;
      }
      return Utils.stdCompare(a1.cost, a2.cost);
    });
  }

  _createVehicle({
    vehicleTypeId,
    bodyTypes,
    baseWorkCosts: baseWorkCostsInput,
    serviceCosts: serviceCostsInput,
    paramsCosts: paramsCostsInput,
  } = {}) {
    const baseWorkCosts = getArrayFromMapWithMerge(this.baseWorks, TariffCarBaseWorkMileage.getKey, baseWorkCostsInput);
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
      mileageBaseWorks: baseWorkCosts,
      serviceCosts,
      paramsCosts,
      tariff: this,
      baseWorkCosts: [],
    });
  }

  onFillMargin(margin, marginFilled) {
    if (!this._placeholders || !margin ) {
      return;
    }
    this._vehicles?.forEach(el => {
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
      };
    });
    return true
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
      title,
      countTimeLimit,
      territoryId,
    } = this;

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


    let serviceCosts = [];
    let serviceParams = [];
    let baseWorkCosts = [];
    const vehicleErrors = {};

    for (const vehicle of this._vehicles) {
      if (!vehicle.vehicleTypeId) {
        continue;
      }

      const { key: vehicleKey, mileageBWData: inputBaseWorkData } = vehicle;

      const useMainServicesLength = this.useMainServices.length;
      const useMainServices = useMainServicesLength > 0;
      const useServiceParams = this.useServiceParams.length > 0;
      let useMainServicesError = false;
      const currMainServicesData = [];
      let currBaseWorkData = []
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
      let baseWorkErrors = false;
      if (inputBaseWorkData) {
        for (const baseWork of inputBaseWorkData) {
          const baseWorkItem = vehicle.getMileageBW({ cost: baseWork.cost });
          const validated = baseWorkItem.validate();
          if (!baseWorkErrors) {
            baseWorkErrors = !!Object.keys(baseWorkItem.errors).length;
          }
          if (!validated) {
            currBaseWorkData.push(baseWork)
          }
        }
      }

      const currServicesData = [...currMainServicesData, ...vehicle.getServicesDataByListService(this.serviceData)];
      baseWorkCosts = baseWorkCosts.concat(currBaseWorkData);

      if (vehicle.bodyTypes.length === 0) {
        vehicleErrors[vehicleKey] = 'Не выбран тип кузова';
      } else if (useMainServices && useMainServicesError) {
        vehicleErrors[vehicleKey] = 'Заполните обязательные поля';
      } else if (currBaseWorkData.length === 0) {
        vehicleErrors[vehicleKey] = 'Нужно задать хотя бы одну минимальную стоимость';
      } else if (baseWorkErrors) {
        vehicleErrors[vehicleKey] = 'Заполните обязательные поля'
      }
      // else if (!currServicesData.length) {
      //   vehicleErrors[vehicleKey] = 'Не заполнено ни одно поле в услугах';
      // }
      serviceCosts = serviceCosts.concat(currServicesData);
    }

    if (!this._vehicles.find(el => el.vehicleTypeId)) {
      errors.tariffScale = 'Тарифная сетка должна иметь хотя бы одну машину';
    }

    const values = {
      ...(id ? { id } : {}),
      title,
      type,
      dayHourFrom,
      dayHourTill,
      serviceCosts,
      territoryId,
      serviceParams,
      baseWorkCosts: baseWorkCosts.map(el => { el.cost *= 100; return el })
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

export default TariffMilage;