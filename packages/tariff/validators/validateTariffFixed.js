import validateTariffBase from './validateTariffBase';
import * as Order from '@vezubr/order/form';
import * as Address from '@vezubr/address';
import t from '@vezubr/common/localization';
import { TARIFF_DISABLED_LOADING_TYPES } from '../constants';

const validatorAddress = Address.Validators.createValidateAddresses(
  Order.Validators.validateAddressItem,
  (addresses, data) => {
    let field = null;

    if (!addresses.length) {
      field = t.error('provideAddress');
    } else if (addresses.length < 2) {
      field = 'Должно быть минимум две точки адреса';
    }

    return field;
  },
);

export default {
  ...validateTariffBase,
  addresses: (addresses) => validatorAddress(addresses, { disabledLoadingTypes: TARIFF_DISABLED_LOADING_TYPES }),
  producerIds: (producerIds) => (!producerIds || !producerIds?.length) && 'Выберите подрядчика',
  dateStart: (dateStart) => !dateStart && 'Выберите дату начала действия тарифа',
  dateLimit: (dateStart) => !dateStart && 'Выберите дату окончания действия тарифа',
  cities: (cities) => cities.length < 2 && 'Должно быть минимум два города',
  countTimeLimit: (countTimeLimit) =>
    (!countTimeLimit || typeof countTimeLimit !== 'number' || isNaN(countTimeLimit)) &&
    'Укажите кол-во запланированных рейсов по ставке',
};
