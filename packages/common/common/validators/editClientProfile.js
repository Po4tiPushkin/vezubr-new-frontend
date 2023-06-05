import t from '../../localization';
import Static from '../../constants/static';

const patterns = Static.patterns;

export default {
  checkingAccount: (val) => {
    return !val
      ? t.error('requiredField')
      : val.toString().length !== 20
      ? t.error('exact').replace('$$max', 20)
      : false;
  },

  bik: (val) => {
    return !val ? t.error('requiredField') : val.toString().length !== 9 ? t.error('exact').replace('$$max', 9) : false;
  },

  phone: (phone) => {
    if (!phone || phone === '+7 (') return t.error('requiredField');
    phone = parseInt(phone.replace(/\D/g, ''));
    return !(Number.isInteger(phone) && `${phone}`.length > 10) ? t.error('requiredField') : false;
  },

  addressPost: (addressPost) => {
    return !addressPost ? t.error('requiredField') : false;
  },

  taxationSystem: (taxationSystem) => {
    return !taxationSystem || !taxationSystem.val ? t.error('requiredField') : false;
  },
};
