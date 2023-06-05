export const contractNumberValidator = (date, required) => {
  if (required && !date) {
    return 'Выберите номер договора';
  }
};

export const generatedDocsValidator = (generatedDocs, required) => {
  if (required && !generatedDocs) {
    return 'Выберите тип документов';
  }
};

export const signedAtValidator = (date, required) => {
  if (required && !date) {
    return 'Выберите дату подписания';
  }
};

export const paymentDelayValidator = (value) => {
  if (!value || +value === 0) {
    return;
  }
  if (!(value && +value) || value < 0 || value > 365) {
    return 'Отсрочка платежа должна быть от 0 до 365';
  }
};

export const periodRegistersValidator = (date, required) => {
  if (required && (date == undefined || date == null)) {
    return 'Выберите период формирования Реестров';
  }
};

export const typeAutomaticRegistersValidator = (date, required) => {
  if (required && !date && date !== 0) {
    return 'Выберите принцип автоматического формирования реестра';
  }
};

export const manualPeriodValidator = (date, required) => {
  if (required && (!date || !parseInt(date))) {
    return 'Укажите период';
  }

  if (required && parseInt(date) > 90) {
    return 'Период не должен превышать 90 дней';
  }
};
