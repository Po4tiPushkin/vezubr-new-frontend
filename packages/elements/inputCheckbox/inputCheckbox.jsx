import React from 'react';
import PropTypes from 'prop-types';

const InputCheckbox = ({ className, theme, ...props }) => {
  let classNames = (className || '').split(' ');

  classNames.push(`element-checkbox theme-${theme}`);

  classNames = classNames.join(' ');

  return <input type="checkbox" className={classNames} {...props} />;
};

InputCheckbox.defaultProps = {
  theme: 'default',
};

InputCheckbox.propTypes = {
  theme: PropTypes.string,
};

export default InputCheckbox;
