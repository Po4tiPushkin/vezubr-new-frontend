export const filterNameValidator = (input, required) => {
  if (required && !input) {
    return 'Введите название фильтра';
  }
};
