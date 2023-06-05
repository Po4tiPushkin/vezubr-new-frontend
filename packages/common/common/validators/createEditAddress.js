import t from '../../localization';
import Static from '../../constants/static';
const patterns = Static.patterns;

export default {
  addressString: (addressString) => (!addressString ? t.error('addressString') : false),
  contacts: (contacts) => (!contacts ? t.error('contactName') : false),
  phone: (phone) => {
    if (!phone) return t.error('phone');
    phone = parseInt(phone.replace(/\D/g, ''));
    return !phone || !(Number.isInteger(phone) && `${phone}`.length >= 10) ? t.error('phone') : false;
  },
  email: (email) => {
    if (!email) return false;
    else if (!patterns.email.test(email)) {
      return t.error('emailFormat');
    } else if (/[а-яА-ЯЁё]/.test(email)) {
      return t.error('emailFormat');
    }
    return false;
    //!email ? t.error('noEmail') : !patterns.email.test(email) ? t.error('emailFormat') : false
  },
  loadingType: (loadingType) => (!loadingType ? t.error('loadingMethod') : false),

  titleForFavourites: (val) => {
    if (!val) return false;
    return `${val}`.length < 2 ? t.error('more').replace('$$max', 2) : false;
  },
};
