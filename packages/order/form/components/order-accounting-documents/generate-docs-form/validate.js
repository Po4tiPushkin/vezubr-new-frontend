export const documentNumberValidator = (date, required) => {
  if (required && !date) {
    return 'Введите номер счета';
  } else if (date.length > 24) {
    return 'Максимально допустимая длина 24 символа';  
  }
};

export const documentDateValidator = (date, required) => {
  if (required && !date) {
    return 'Введите дату счета';
  }
};
