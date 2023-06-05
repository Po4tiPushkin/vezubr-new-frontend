import PropTypes from 'prop-types';

const ErrorItemProp = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.bool,
  PropTypes.number,
  PropTypes.arrayOf(PropTypes.string),
]);

export { ErrorItemProp };
