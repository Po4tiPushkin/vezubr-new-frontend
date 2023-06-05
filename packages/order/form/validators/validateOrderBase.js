import t from '@vezubr/common/localization';
import validateAddressItem from './validateAddressItem';
import { validateEmpty } from '@vezubr/common/validators/fields';
import * as Address from '@vezubr/address';
import moment from 'moment';
import { CONTOUR_MAIN_ID } from '@vezubr/common/constants/contour';

export default (regular) => ({
  addresses: Address.Validators.createValidateAddresses(validateAddressItem, (addresses, data) => {
    let field = null;
    const { trackPolyline, trackEncoder } = data;

    if (!addresses.length) {
      field = t.error('provideAddress');
    } else if (addresses.length < 2) {
      field = 'Минимум две точки адреса должно быть';
    } else if (addresses.length > 1 && (!trackPolyline || !trackEncoder)) {
      field = 'Не смог построить маршрут';
    }

    return field;
  }),

  assessedCargoValue: (val, data) => {
    const { insurance, isInsuranceRequired } = data;

    if (insurance || isInsuranceRequired) {
      if (validateEmpty(val)) {
        return 'Укажите стоимость товара для страховки';
      }
    }

    return null;
  },

  cargoCategoryId: (val, data) => {
    const { insurance, isInsuranceRequired } = data;

    if (insurance || isInsuranceRequired) {
      if (validateEmpty(val)) {
        return 'Укажите тип товара для страховки';
      }
    }

    return null;
  },

  toStartAtDate: (toStartAtDate, data) => {
    //set dependence
    data.addresses;

    if (!toStartAtDate || !/^\d{4}\-\d{2}\-\d{2}$/.test(toStartAtDate)) {
      return 'Выберите дату';
    }

    const { pickedDate } = data;

    const setDate = pickedDate ? pickedDate.clone() : moment(toStartAtDate, 'YYYY-MM-DD');

    if (!regular && setDate.isBefore(moment(), 'date')) {
      return 'Рейс не может быть создан в прошлом';
    }

    const { transportOrderMaxWorkingDays } = data;

    if (!regular && setDate.isAfter(moment().add(1, 'month'), 'date')) {
      return 'Слишком далеко в будущем';
    }

    return null;
  },

  toStartAtTime: (toStartAtTime, data) => {
    //set dependence
    data.addresses;

    if (!toStartAtTime || !/^\d{2}:\d{2}$/.test(toStartAtTime)) {
      return 'Выберите время';
    }

    const { pickedDate } = data;
    if (!regular && pickedDate && pickedDate.isBefore(moment().add(5, 'minutes'))) {
      return t.error('orderIn5MinAdvance');
    }
    return null;
  },

  vehicleType: (vehicleType) => !vehicleType && 'Выберите тип ТС',

  bodyTypes: (bodyTypes) => bodyTypes.length === 0 && 'Выберите хотя бы один тип кузова',

  startOfPeriod: (startOfPeriod) => regular && !startOfPeriod && 'Выберите дату',

  endOfPeriod: (endOfPeriod) => regular && !endOfPeriod && 'Выберите дату',

  offset: (offset) => regular && !offset && 'Обязательное поле',

  unit: (unit) => regular && !unit && 'Обязательное поле',

  amount: (amount) => {
    if (!regular) {
      return null
    }
    if (!amount || (Array.isArray(amount) && (amount?.length === 0 || (amount.length === 1 && !amount[0])))) {
      return 'Обязательное поле'
    }
    return null
  },

  loadersRequiredOnAddress: (loadersRequiredOnAddress, data) => {
    const { loadersCountRequired } = data;

    if (loadersCountRequired > 0 && !loadersRequiredOnAddress) {
      return 'Необходимо выбрать адрес для специалистов';
    }

    return null;
  },

  loadersTime: (loadersTime, data) => {
    const { loadersCountRequired } = data;

    if (loadersCountRequired > 0) {
      if (validateEmpty(loadersTime)) {
        return 'Укажите время';
      }

      if (!/^\d{2}:\d{2}$/.test(loadersTime)) {
        return 'Некорректное время';
      }
    }

    return null;
  },

  contourTree: (contourTree, data) => {
    //set dependences
    const { requiredContours, requiredProducers } = data;

    if (!contourTree.length) {
      return 'Выберите контур или подрядчика';
    }
    return null;
  },

  client: (client) => {
    if (APP === 'dispatcher' && !client) {
      return 'Укажите грузовладельца';
    }
    return null;
  },

  clientRate: (clientRate, data) => {
    const { useClientRate, selectingStrategy } = data;

    if (selectingStrategy === 2) {
      return null
    }

    if ((selectingStrategy === 1 && useClientRate && !clientRate) || (selectingStrategy !== 1 && !clientRate)) {
      return 'Укажите ставку';
    }

    return null;
  },

  bargainsEndDate: (bargainsEndDate, data) => {
    //set dependence
    data.toStartAtDate;
    data.toStartAtTime;

    const { selectingStrategy, pickedDate, bargainsEndDateTimePicker } = data;

    if (selectingStrategy === 1) {
      return null;
    }

    if (!bargainsEndDate || !/^\d{4}\-\d{2}\-\d{2}$/.test(bargainsEndDate)) {
      return 'Выберите дату';
    }

    const bargainsDateTime =
      (bargainsEndDateTimePicker && bargainsEndDateTimePicker.clone()) || moment(bargainsEndDate, 'YYYY-MM-DD');

    if (bargainsDateTime.isBefore(moment(), 'date')) {
      return 'Нельзя завершить торги в прошлом';
    }

    if (pickedDate && bargainsDateTime.isAfter(pickedDate, 'date')) {
      return 'Нельзя завершить торги позже даты подачи';
    }

    return null;
  },

  bargainsEndTime: (bargainsEndTime, data) => {
    //set dependence
    data.toStartAtDate;
    data.toStartAtTime;

    const { selectingStrategy, bargainsEndDateTimePicker, pickedDate } = data;

    if (selectingStrategy === 1) {
      return null;
    }

    if (!bargainsEndTime || !/^\d{2}:\d{2}:\d{2}$/.test(bargainsEndTime)) {
      return 'Выберите время';
    }

    if (bargainsEndDateTimePicker) {
      if (bargainsEndDateTimePicker.isBefore(moment().add(15, 'minutes'))) {
        return 'Торг можно закончить, не ранее чем, через 15 минут';
      }

      if (pickedDate && bargainsEndDateTimePicker.isAfter(pickedDate.clone().subtract(30, 'minutes'))) {
        return 'Нельзя завершить торги позже чем за 30 минут до даты подачи';
      }
    }

    return null;
  },

  insurance: (insurance, data) => {
    const { requiredContours } = data;

    if (!insurance && requiredContours.indexOf(CONTOUR_MAIN_ID) !== -1) {
      return 'Для контура Везубр страховка обязательна';
    }

    return null;
  },

  // bidStep: (bidStep, data) => {
  //   const { useBidStep, selectingStrategy } = data;
  //   if (regular || selectingStrategy === 1) {
  //     return null
  //   };

  //   if (useBidStep && !bidStep) {
  //     return 'Необходимо указать шаг торгов'
  //   }

  //   return null
  // },

  vehicleTemperatureMax: (vehicleTemperatureMax, data) => {
    if (data.bodyTypes.find(el => el === 2)) {
      if (!vehicleTemperatureMax && vehicleTemperatureMax !== 0) {
        return 'Укажите максимальную температуру'
      }
    }
    return null
  },

  vehicleTemperatureMin: (vehicleTemperatureMin, data) => {
    if (data.bodyTypes.find(el => el === 2)) {
      if (!vehicleTemperatureMin && vehicleTemperatureMin !== 0) {
        return 'Укажите минимальную температуру'
      }
    }
    return null
  },
  clientNumber: (value, data) => {
    console.log(data?.numerationType, value)
    if (APP === 'client' && data?.numerationType === 'numeration_client' && !regular && value?.length < 3) {
      return 'Поле Идентификатор Рейса должно содержать как минимум 3 символа'
    }
    return null
  }

});
