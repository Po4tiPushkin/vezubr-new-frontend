import t from '../../localization';
import Static from '../../constants/static';
const patterns = Static.patterns;

export default {
  // type: (type) => (!type.key ? 'Нужно выбрать тип' : false),
  name: (name) => {
    if (!name) {
      return 'Поле должно быть заполнено';
    }
    if (`${name}`.match(patterns.userName)) {
      return 'Введено недопустимое значение. Запрещён ввод пробелов и знаков препинания'
    }
    return false
  },
  surname: (name) => {
    if (!name) {
      return 'Поле должно быть заполнено';
    }
    if (`${name}`.match(patterns.userName)) {
      return 'Введено недопустимое значение. Запрещён ввод пробелов и знаков препинания'
    }
  },
  patronymic: (name) => {
    if (!name) {
      return false;
    }
    if (`${name}`.match(patterns.userName)) {
      return 'Введено недопустимое значение. Запрещён ввод пробелов и знаков препинания'
    }
    return false;
  },
  // phone: (phone) => {
  //   phone = parseInt(phone.replace(/\D/g, ''));
  //   return !phone || !(Number.isInteger(phone) && `${phone}`.length >= 10) ? 'Поле должно быть заполнено числами' : false;
  // },
  email: (email) => (!email ? 'Поле должно быть заполнено' : !patterns.emailNew.test(email) ? 'Неверный формат почты' : false),
  timezone: (timezone) => (!timezone ? 'Поле должно быть заполнено' : false),
  role: (val) => !val ? 'Поле должно быть заполнено' : false,
  employeeRoles: (val) => !val || !val?.length ? 'Выберите из списка' : false,
  phone: (phone) => (!phone ? 'Поле должно быть заполнено' : false),
  timezone: (val) => !val || !val?.length ? 'Выберите из списка' : false,
  unit: (val) => false,
  hasDigitalSignature: () => false,
  digitalSignatureOperator: (val) => !val ? 'Поле должно быть заполнено' : false,
  digitalSignatureIdentifier: (val) => !val ? 'Поле должно быть заполнено' : false,
  digitalSignatureIssuedAtDate: (val) => !val ? 'Поле должно быть заполнено' : false,
  digitalSignatureValidTill: (val) => !val ? 'Поле должно быть заполнено' : false,
};
