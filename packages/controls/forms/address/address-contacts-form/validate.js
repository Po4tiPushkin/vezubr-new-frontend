import { PATTERNS } from '@vezubr/common/constants/constants';

export const documentContactValidator = (data, required) => {
  if (required && !data) {
    return 'Введите имя';
  }
};

export const documentPhoneValidator = (date, required) => {
  if (required && !date) {
    return 'Введите номер телефона';
  }
};

export const documentEmailValidator = (data, required) => {
  if (required && !data) {
    return 'Введите электронную почту';
  }

  if (data && !PATTERNS.email.test(data)) {
    return 'Некорректный адрес электронной почты';
  }
};
