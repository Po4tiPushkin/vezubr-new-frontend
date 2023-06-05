import t from '../../localization';

export default {
  number: (val) => {
    if (!val) {
      return 'Это поле обязательно для заполнения'
    }
    return false
  },
  title: (val) => {
    if (!val) {
      return 'Это поле обязательно для заполнения'
    }
    return false
  },
  fileId: () => false,
  orderType: () => false,
  premiumRate: (val) => {
    if (!val && val !== 0) {
      return 'Это поле обязательно для заполнения'
    }
    if (Number.isNaN(+val)) {
      return 'Введите число'
    }
    return false
  },
  minPremium: (val) => {
    if (!val && val !== 0) {
      return 'Это поле обязательно для заполнения'
    }
    if (Number.isNaN(+val)) {
      return 'Введите число'
    }
    return false
  },
  startsAt: (val) => {
    if (!val) {
      return 'Это поле обязательно для заполнения'
    }
    return false
  },
  maxAmountRestriction: (val) => {
    if (!val && val !== 0) {
      return 'Это поле обязательно для заполнения'
    }
    if (Number.isNaN(+val)) {
      return 'Введите число'
    }
    return false
  },

}