import validateTariffBase from './validateTariffBase';

export default {
  ...validateTariffBase,
  producerIds: (producerIds) => (!producerIds || !producerIds?.length) && 'Выберите подрядчика',
  dateStart: (dateStart) => !dateStart && 'Выберите дату начала действия тарифа',
  dateLimit: (dateStart) => !dateStart && 'Выберите дату окончания действия тарифа',
  countTimeLimit: (countTimeLimit) =>
    (!countTimeLimit || typeof countTimeLimit !== 'number' || isNaN(countTimeLimit)) &&
    'Укажите кол-во запланированных рейсов по ставке',
};
