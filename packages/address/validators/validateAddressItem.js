import { validateEmpty } from '@vezubr/common/validators/fields';

export default {
  addressString: (addressString) => validateEmpty(addressString),
  cityName: (cityName) => validateEmpty(cityName) && 'Город не определился',
  timeZoneId: (timeZoneId) => validateEmpty(timeZoneId) && 'Часовой пояс не определился',
  cityFiasId: (cityFiasId) => validateEmpty(cityFiasId) && 'FiasId города не определился',
  latitude: (latitude) => validateEmpty(latitude) && 'Широта не определилась',
  longitude: (latitude) => validateEmpty(latitude) && 'Долгота не определилась',
  pointOwnerInn: (inn) => (inn && isNaN(+inn)) ? 'Инн должен содержать только числа'  : false,
};
