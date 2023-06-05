import t from '../../localization';
import Static from '../../constants/static';
import { validateDateForDriver } from '../../utils/date';

export default {
  applicationPhone: (phone, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return !phone ? t.error('required').replace('$$param', t.driver('appMobPhone')) : false;
  },

  driverLicenseIssuedBy: (driverLicenseIssuedBy, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return !driverLicenseIssuedBy.length || driverLicenseIssuedBy.length < 2 || driverLicenseIssuedBy.length >= 200
      ? t.error('required').replace('$$param', t.driver('issueBy'))
      : false;
  },

  driverLicenseName: (driverLicenseName, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return !driverLicenseName.length || driverLicenseName.length < 2 || driverLicenseName.length >= 200
      ? t.error('required').replace('$$param', t.driver('firstName'))
      : false;
  },

  driverLicenseId: (val, values) => {
    if (!val) return t.error('required').replace('$$param', t.driver('driverLicenseId'));
    return values?.dlRusResident && `${val}`.length !== 10 ? t.error('exact').replace('$$max', 10) : false;
  },

  driverLicensePlaceOfBirth: (driverLicensePlaceOfBirth, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return !driverLicensePlaceOfBirth.length ||
      driverLicensePlaceOfBirth.length < 2 ||
      driverLicensePlaceOfBirth.length >= 200
      ? t.error('required').replace('$$param', t.driver('licenceInfo'))
      : false;
  },

  driverLicenseSurname: (driverLicenseSurname, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return !driverLicenseSurname.length || driverLicenseSurname.length < 2 || driverLicenseSurname.length >= 200
      ? t.error('required').replace('$$param', t.driver('lastName'))
      : false;
  },

  name: (name, values) => {
    return !name.length || name.length < 2 || name.length >= 200
      ? t.error('required').replace('$$param', t.driver('firstName'))
      : false;
  },

  passportIssuedBy: (passportIssuedBy, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return !passportIssuedBy.length || passportIssuedBy.length < 2 || passportIssuedBy.length >= 200
      ? t.error('required').replace('$$param', t.driver('issueBy'))
      : false;
  },

  passportId: (val, values) => {
    if (!values?.passportRusResident) {
      return false
    }
    if (/\D/gm.test(val)) return 'Поле не должно содержать пробелов и иных символов кроме цифр'
    if (!val) return t.error('required').replace('$$param', t.driver('passportId'));
    return `${val}`.length !== 10 ? t.error('exact').replace('$$max', 10) : false;
  },

  passportUnitCode: (val, values, extra) => {
    if (extra?.producer) {
      return false;
    }
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

  placeOfBirth: (placeOfBirth, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return (!placeOfBirth.length || placeOfBirth.length < 2 || placeOfBirth.length >= 200)
      ? t.driver('providePob')
      : false;
  },

  registrationAddress: (val, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return !val ? t.error('requiredField') : false;
  },

  surname: (surname, values) => {
    return !surname.length || surname.length < 2 || surname.length >= 200
      ? t.error('required').replace('$$param', t.driver('lastName'))
      : false;
  },

  country: (country, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return (!country?.length)
      ? t.driver('providePob')
      : false;
  },

  dateOfBirth: (dateOfBirth, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return validateDateForDriver(dateOfBirth, 'DD.MM.YYYY', true);
  },

  passportIssuedAtDate: (passportIssuedAtDate, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return validateDateForDriver(passportIssuedAtDate, 'DD.MM.YYYY', true);
  },

  driverLicenseExpiresAtDate: (driverLicenseExpiresAtDate, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return validateDateForDriver(driverLicenseExpiresAtDate, 'DD.MM.YYYY', false, true)
  },

  driverLicenseDateOfBirth: (driverLicenseDateOfBirth, values, extra) => {
    if (extra?.producer) {
      return false;
    }
    return validateDateForDriver(driverLicenseDateOfBirth, 'DD.MM.YYYY', true);
  },

  sanitaryBookExpiresAtDate: (val, values) => {
    return values?.hasSanitaryBook && !val ? t.error('requiredField') : false
  },

  patronymic: (patronymic, values) => {
    return (values?.passportRusResident && (!patronymic.length || patronymic.length < 2 || patronymic.length >= 200))
      ? t.error('required').replace('$$param', t.driver('patranomy'))
      : false;
  }
};