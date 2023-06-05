import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

function Textarea(props) {
  const { className: classNameInput, value: valueInput, children, ...otherProps } = props;

  const className = cn('cell-textarea', classNameInput);
  const defaultValue = valueInput || children || '';

  const propsTextarea = {
    ...otherProps,
    className,
    defaultValue,
  };

  return <textarea {...propsTextarea} />;
}

Textarea.defaultProps = {
  rows: 1,
};

Textarea.propTypes = {
  value: PropTypes.string,
  style: PropTypes.object,
  rows: PropTypes.number,
  className: PropTypes.string,
};

export default Textarea;
