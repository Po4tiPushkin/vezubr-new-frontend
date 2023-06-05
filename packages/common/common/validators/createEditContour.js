export default {
  title: (val) => {
    if (!val) {
      return 'Это поле обязательно для заполнения'
    }
    return false
  },
  type: (val) => {
    if (!val) {
      return 'Это поле обязательно для заполнения'
    }
    return false
  },
  comissionPayer: (val) => {
    if (!val) {
      return 'Это поле обязательно для заполнения'
    }
    return false
  },
  status: (val) => {
    if (!val) {
      return 'Это поле обязательно для заполнения'
    }
    return false
  },
  contractorAutoJoin: (val) => {
    return false
  },
  allowDocAccept: (val) => {
    return false
  },
  allowRegistries: (val) => {
    return false
  },
  allowActs: (val) => {
    return false
  },
}