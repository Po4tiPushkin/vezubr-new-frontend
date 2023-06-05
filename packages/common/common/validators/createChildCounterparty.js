
export default {
  inn: (inn) => {
    if (!inn) {
      return 'Заполните поле';
    }
    if (inn && ((inn.length !== 12 && inn.length !== 10))) {
    
      return 'ИНН должен состоять из 10 или 12 цифр';
    }
    return false
  },
  kpp: (val) => {
    if (val && (isNaN(val) || val.length !== 9)) {
      return 'КПП должен состоять из 9 цифр'
    }
    return false;
  },
  role: (val) => {
    if (!val) {
      return 'Обязательное поле'
    }
    return false
  }
}