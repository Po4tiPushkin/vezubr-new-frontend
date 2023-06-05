export const validateRequiredInput = (val, required) => {
  if (required && !val) {
    return 'Заполните поле';
  }
};

export const validatePassword = (val) => {
  if (val && val.length < 6) {
    return 'Пароль должен быть не менее 6 символов'
  }
}

export const validateConfirmPassword = (val, password, required) => {
  if (required && !val) {
    return 'Заполните пароль';
  }

  if (val !== password) {
    return 'Пароли должны совпадать';
  }
};

export const validateInn = (inn, required) => {
  if (required && !inn) {
    return 'Заполните поле';
  }
  if (required && inn && ((inn.length !== 12 && inn.length !== 10))) {
    return 'ИНН должен состоять из 10 или 12 цифр';
  }
}

export const validateKpp = (kpp) => {
  if (!kpp || (!isNaN(kpp) && kpp?.length === 9 )) {
    return false;
  };
  return 'КПП должен состоять из 9 цифр';
}