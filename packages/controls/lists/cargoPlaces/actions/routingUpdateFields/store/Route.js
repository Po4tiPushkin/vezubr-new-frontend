import { action } from 'mobx';
import validateRoute from '../validators/validateRoute';
import Base from './Base';
// import { isNumber } from '@vezubr/common/utils';
// import { TARIFF_FANTOM_SERVICE } from '../constants';

class Route extends Base {
  @action
  getValidateData() {
    const errors = {
      ...this._errors,
    };

    const { id, _vehicles, configuration, cargoPlaceIds } = this;

    if (!validateRoute.noEmptyConfiguration(configuration)) {
      errors.configuration = 'Поле обязательное';
    }

    const vehicleErrors = {};
    const resultVehicles = [];
    const resultCargoPlaceIds = [];

    for (const vehicle of _vehicles) {
      if (!vehicle.vehicleTypeId) {
        continue;
      }

      const { key: vehicleKey, vehicleTypeId, vehicleStartAt, vehicleEndAt, vehicleCount } = vehicle;

      if (!vehicleStartAt && !vehicleEndAt && !vehicleCount) {
        vehicleErrors[vehicleKey] = 'Не заполнено ни одно поле';
      } else if (!vehicle.vehicleCount) {
        vehicleErrors[vehicleKey] = 'Не выбрано кол-во ТС';
      } else if (!vehicleStartAt && !vehicleEndAt) {
        vehicleErrors[vehicleKey] = 'Не заполнены поля о смене работы';
      } else if (!vehicleStartAt) {
        vehicleErrors[vehicleKey] = 'Не заполнено поле "Смена работы с"';
      } else if (!vehicleEndAt) {
        vehicleErrors[vehicleKey] = 'Не заполнено поле "Смена работы до"';
      }

      resultVehicles.push({
        vehicleTypeId,
        vehicleStartAt: (vehicleStartAt && vehicleStartAt.format('YYYY-MM-DD HH:mm')) || vehicleStartAt,
        vehicleEndAt: (vehicleEndAt && vehicleEndAt.format('YYYY-MM-DD HH:mm')) || vehicleEndAt,
        vehicleCount,
      });
    }

    for (const id of cargoPlaceIds) {
      resultCargoPlaceIds.push(id);
    }

    if (resultVehicles.length === 0) {
      errors.tariffScale = 'Тарифная сетка должна иметь хотя бы одну машину';
    }

    const values = {
      ...(id ? { id } : {}),
      configuration,
      cargoPlaceIds: resultCargoPlaceIds,
      vehicles: resultVehicles,
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

export default Route;