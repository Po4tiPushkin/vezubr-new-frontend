import t from '../../localization';
import Static from '../../constants/static';
import { validateDateForDriver } from '../../utils/date';

export default {
  applicationPhone: (phone, values) => {
    return false;
  },

  contactPhone: (phone, values) => {
    return false;
  },

  name: (name, values) => {
    return !name.length || name.length < 2 || name.length >= 200
      ? t.error('required').replace('$$param', t.driver('firstName'))
      : false;
  },

  passportIssuedBy: (passportIssuedBy, values) => {
    return !passportIssuedBy.length || passportIssuedBy.length < 2 || passportIssuedBy.length >= 200
      ? t.error('required').replace('$$param', t.driver('issueBy'))
      : false;
  },

  passportId: (val, values) => {
    if (!val) return t.error('required').replace('$$param', t.driver('passportId'));
    if (!/^[0-9]{0,10}$/g.test(val)) return 'Поле должно содержать только цифры от 0 до 9'
    return values?.passportRusResident && `${val}`.length !== 10 ? t.error('exact').replace('$$max', 10) : false;
  },

  passportUnitCode: (val, values) => {
    let err = false;
    if (!val) {
      err = t.error('requiredField');
    }
    else if (!values?.passportRusResident) {
      return err;
    }
    else if (val.replaceAll(/_/g, "").length !== 7) {
      err = t.error('exact').replace('$$max', 7);
    }
    return err;
  },

  placeOfBirth: (placeOfBirth, values) => {
    return (!placeOfBirth.length || placeOfBirth.length < 2 || placeOfBirth.length >= 200)
      ? t.driver('providePob')
      : false;
  },

  registrationAddress: (val, values) => {
    return !val ? t.error('requiredField') : false;
  },

  surname: (surname, values) => {
    return !surname.length || surname.length < 2 || surname.length >= 200
      ? t.error('required').replace('$$param', t.driver('lastName'))
      : false;
  },

  country: (country, values) => {
    return (!country.length)
      ? t.driver('providePob')
      : false;
  },

  dateOfBirth: (dateOfBirth, values) => {
    return validateDateForDriver(dateOfBirth, 'DD.MM.YYYY', true);
  },

  passportIssuedAtDate: (passportIssuedAtDate, values) => {
    return validateDateForDriver(passportIssuedAtDate, 'DD.MM.YYYY', true);
  },

  sanitaryBookExpiresAtDate: (sanitaryBookExpiresAtDate, values) => {
    return validateDateForDriver(sanitaryBookExpiresAtDate, 'DD.MM.YYYY', false, true, values.hasSanitaryBook);
  },

  patronymic: (patronymic, values) => {
    return (values?.passportRusResident && (!patronymic.length || patronymic.length < 2 || patronymic.length >= 200))
      ? t.error('required').replace('$$param', t.driver('patranomy'))
      : false;
  },

  specialities: (specialities, values) => {
    return specialities.length <= 0 ? 'Необходима хотя бы одна специальность' : false;
  }
};