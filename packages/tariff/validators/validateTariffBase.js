export default {
  noEmptyString: (str) => !!str.trim(),
  isNumber: (nmb) => typeof nmb === 'number' && !isNaN(nmb),
};
