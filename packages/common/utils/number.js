export const beautifyNumber = (num) => {
  let result = num;

  result = `${result}`.replace('.', ',');

  result = `${result}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return result;
};
