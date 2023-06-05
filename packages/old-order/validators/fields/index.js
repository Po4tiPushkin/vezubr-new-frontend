import { validateEmpty } from '@vezubr/common/validators/fields';
import { PHONE_PLACEHOLDER } from '../../constants';

export function validateAddressItemLoadingType({ disabledLoadingTypesByVehicleAndBody, loadingTypeId, isRequired }) {
  if (isRequired && !loadingTypeId) {
    return 'Не указан тип погрузки/разгрузки';
  }

  if (disabledLoadingTypesByVehicleAndBody && loadingTypeId && disabledLoadingTypesByVehicleAndBody?.indexOf(loadingTypeId) !== -1) {
    return 'Некорректный тип погрузки/разгрузки';
  }

  return null;
}

export function validateMinLengthValue(inputValue, minLength = 3) {
  if (inputValue?.length < minLength) {
    return `Имя адреса должно содержать не менее ${minLength} символов`;
  }

  return null;
}

export function validateAddressItemPhone(phoneInput, isRequired) {
  const phone = phoneInput ? phoneInput.replace(PHONE_PLACEHOLDER, '') : '';

  if (isRequired && !!validateEmpty(phone)) {
    return 'Телефон обязателен для заполнения';
  }

  if (phone) {
    const phonePreparing = phone.replace(/\D/g, '');
    if (phonePreparing.length > 0 && phonePreparing.length < 11) {
      return 'Некорректный номер телефона';
    }
  }

  return null;
}
