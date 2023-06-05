export const camelCaseToSnakeCase = str => str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const getNumberAddition = (number, one, two, five) => {
  const preLastDigit = (number % 100) / 10;

  if (Math.floor(preLastDigit) == 1) {
    return five
  }

  switch (number % 10) {
    case 1: return one;
    case 2:
    case 3:
    case 4:
      return two;
    default:
      return five;
  }
}

export const snakeCaseToCamelCase = str =>
  str.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );