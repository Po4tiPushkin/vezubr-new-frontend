export default {
  noEmptyString: (str) => !!str.trim(),
  noEmptyConfiguration: (val) => !!val,
  isNumber: (nmb) => typeof nmb === 'number' && !isNaN(nmb),
};
