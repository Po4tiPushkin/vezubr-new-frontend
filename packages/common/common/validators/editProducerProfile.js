import t from '../../localization';
import Static from '../../constants/static';

const patterns = Static.patterns;

export default {
  checkingAccountNumber: (val) => {
    return val ? val.toString().length !== 20 && t.error('exact').replace('$$max', 20) : false;
  },

  bankBik: (val) => {
    return val ? val.toString().length !== 9 && t.error('exact').replace('$$max', 9) : false;
  },

  phone: (phone) => {
    if (!phone || phone === '+7 (') return false;
    phone = parseInt(phone.replace(/\D/g, ''));
    return !(Number.isInteger(phone) && `${phone}`.length > 10) ? t.error('wrongFormat') : false;
  },

  addressPost: (addressPost) => {
    return !addressPost ? t.error('requiredField') : false;
  },
};
