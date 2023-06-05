import t from '../../localization';
export default {
  bodyHeightInCm: (val) => {
    if (!val) return;
    val = parseFloat(val);
    return isNaN(val)
      ? 'Введите число'
      :
      val < 1 || val > 4
        ? t.error('outOfRange')
        : false;
  },

  bodyVolume: (val) => {
    val = parseFloat(val);
    return isNaN(val)
      ? t.error('required').replace('$$param', t.order('bodyVolume'))
      : val <= 0
        ? t.error('outOfRange')
        : false;
  },

  volume: (val, form, extra) => {
    if (extra?.disabled) {
      return false;
    }
    const parsedVal = parseFloat(val);
    if (extra?.range?.min && extra?.range?.max && !isNaN(val)) {
      if (parsedVal < extra?.range?.min || parsedVal > extra?.range?.max) {
        return t.error('outOfRange')
      }
    }
    return isNaN(val)
      ? t.error('required').replace('$$param', t.order('bodyVolume'))
      : val <= 0
        ? t.error('outOfRange')
        : false;
  },

  bodyLengthInCm: (val) => {
    if (!val) return;
    val = parseFloat(val);
    return isNaN(val)
      ? 'Введите число'
      :
      val < 1 || val > 15
        ? t.error('outOfRange')
        : false;
  },

  bodyWidthInCm: (val) => {
    if (!val) return;
    val = parseFloat(val);
    return isNaN(val)
      ? 'Введите число'
      :
      val < 1 || val > 4
        ? t.error('outOfRange')
        : false;
  },

  producer: (val) => {
    return false;
  },

  liftingCapacityInKg: (val, form, extra) => {
    val = parseFloat(val);
    if (extra?.range?.min && extra?.range?.max && !isNaN(val)) {
      if (val < extra?.range?.min || val > extra?.range?.max) {
        return t.error('outOfRange')
      }
    }
    return isNaN(val)
      ? t.error('required').replace('$$param', t.order('lift_cap'))
      : false;
  },

  liftingCapacityInKgTransport: (val) => {
    val = parseFloat(val);
    return isNaN(val)
      ? t.error('required').replace('$$param', t.order('lift_cap_transport'))
      : val < 0 || val > 19
        ? t.error('needToCreateTractor')
        : false;
  },

  palletsCapacity: (val, form, extra) => {
    if (extra?.disabled) {
      return false;
    }
    val = parseFloat(val);

    if ((extra?.range?.min || extra?.range?.min === 0) && extra?.range?.max && !isNaN(val)) {
      if (val < extra?.range?.min || val > extra?.range?.max) {
        return t.error('outOfRange')
      }
    }
    return isNaN(val)
      ?
      t.error('required').replace('$$param', t.order('palletsCapacity'))
      :
      (!val && val !== 0) ? t.error('required').replace('$$param', t.order('palletsCapacity')) : false
  },

  heightFromGroundInCm: (val = '') => {
    val = val ? (Number.isInteger(val) ? val : parseInt(val.replace(/\D/g, ''))) : false;
    return !val || (!Number.isInteger(val) && `${val}`.length <= 100)
      ? t.error('required').replace('$$param', t.order('maxHeightFromGround'))
      : false;
  },

  plateNumber: (val) => {
    return !val || (!Number.isInteger(val) && `${val}`.length < 6)
      ? t.error('required').replace('$$param', t.order('transportNumber'))
      : false;
  },

  markAndModel: (val) => (!val.length ? t.error('required').replace('$$param', t.order('model')) : false),

  bodyType: (bodyType) => (!bodyType && !bodyType?.val ? t.error('required').replace('$$param', t.order('bodyType')) : false),

  yearOfManufacture: (val) => (!val ? t.error('selectFromLst') : false),

  ownerType: (ownerType) => (!ownerType ? t.error('selectFromLst') : false),

  temperatureMin: (val) => {
    if (!val && val !== 0) {
      return 'Это поле обязательно для заполнения'
    }
    if (Number.isNaN(+val)) {
      return 'Введите число'
    }
    return false
  },

  temperatureMax: (val) => {
    if (!val && val !== 0) {
      return 'Это поле обязательно для заполнения'
    }
    if (Number.isNaN(+val)) {
      return 'Введите число'
    }
    return false
  },

  vin: (val) => {
    if (val !== null && val !== '' && !/^[A-HJ-NPR-Z0-9]{17}$/.test(val)) {
      return t.error('required').replace('$$param', t.order('vin'));
    }
    return false;
  },

  sanitaryPassportExpiresAtDate: (val) => (!val ? t.error('Годен до - обязательное поле') : false),

  liftingCapacityMin: (val, form, extra) => {
    val = parseFloat(val);
    if (isNaN(val)) {
      return t.error('required').replace('$$param', t.order('lift_cap'))
    }
    if (extra?.max) {
      if (val > extra?.max) {
        return 'Минимальная грузоподьемность не может быть больше паспортной'
      }
    }
    if (form?.liftingCapacityMax) {
      if (val > form.liftingCapacityMax) {
        return 'Минимальная грузоподьемность не может быть больше максимальной'
      }
    }
    return false
  },

  liftingCapacityMax: (val, form, extra) => {
    val = parseFloat(val);
    if (isNaN(val)) {
      return t.error('required').replace('$$param', t.order('lift_cap'))
    }
    if (extra?.min) {
      if (val < extra?.min) {
        return 'Максимальная грузоподьемность не может быть меньше паспортной'
      }
    }
    return false
  },

  platformHeight: (val, form, extra) => {
    if (extra?.disabled) {
      return false;
    }
    val = parseFloat(val);
    if (!val && val !== 0) {
      return 'Это поле обязательно для заполнения'
    }
    if (Number.isNaN(+val)) {
      return 'Введите число'
    }
    if (extra?.range?.min && extra?.range?.max) {
      if (val < extra?.range?.min || val > extra?.range?.max) {
        return t.error('outOfRange')
      }
    }
    return false;
  },
  platformLength: (val, form, extra) => {
    if (extra?.disabled) {
      return false;
    }
    val = parseFloat(val);
    if (!val && val !== 0) {
      return 'Это поле обязательно для заполнения'
    }
    if (Number.isNaN(+val)) {
      return 'Введите число'
    }
    if (extra?.range?.min && extra?.range?.max) {
      if (val < extra?.range?.min || val > extra?.range?.max) {
        return t.error('outOfRange')
      }
    }
    return false;
  },
  carCount: (val, form, extra) => {
    if (extra?.disabled) {
      return false;
    }
    val = parseFloat(val);
    if (!val && val !== 0) {
      return 'Это поле обязательно для заполнения'
    }
    if (Number.isNaN(+val)) {
      return 'Введите число'
    }
    if (extra?.range?.min && extra?.range?.max) {
      if (val < extra?.range?.min || val > extra?.range?.max) {
        return t.error('outOfRange')
      }
    }
    return false;
  },
  compartmentCount: (val, form, extra) => {
    if (extra?.disabled) {
      return false;
    }
    val = parseFloat(val);
    if (!val && val !== 0) {
      return 'Это поле обязательно для заполнения'
    }
    if (Number.isNaN(+val)) {
      return 'Введите число'
    }
    if (extra?.range?.min && extra?.range?.max) {
      if (val < extra?.range?.min || val > extra?.range?.max) {
        return t.error('outOfRange')
      }
    }
    return false;
  },

  category: (val) => {
    if (!val && +val !== 0) {
      return 'Это поле обязательно для заполнения'
    }
    return false
  },
  isSideLoadingAvailable: (val) => false,
  isTopLoadingAvailable: (val) => false,
  hasHydrolift: (val) => false,
  hasPalletsJack: (val) => false,
  hasFastening: (val) => false,
  hasConics: (val) => false,
  isThermograph: (val) => false,

};
