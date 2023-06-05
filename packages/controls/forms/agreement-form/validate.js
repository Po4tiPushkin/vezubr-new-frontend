export const agreementNumberValidator = (date, required) => {
  if (required && !date) {
    return 'Выберите номер договора';
  }
};

export const signedAtValidator = (date, required) => {
  if (required && !date) {
    return 'Выберите дату подписания';
  }
};

export const agreementTypeValidator = (date, required) => {
  if (required && !date) {
    return 'Выберите тип договора';
  }
};

export const contractTypeValidator = (date, required) => {
  if (required && !date) {
    return 'Выберите тип договора';
  }
};
