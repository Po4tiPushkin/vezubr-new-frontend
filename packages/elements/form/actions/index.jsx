import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Col as ColAnt } from '../../antd';

const Actions = ({ children, align: alignInput, className: classNameInput, ...otherProps }) => {
  const align = alignInput || 'right';
  const className = cn('vz-form-actions', `vz-form-actions--${align}`, classNameInput);

  return (
    <div {...otherProps} className={className}>
      {children}
    </div>
  );
};

Actions.propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf(['left', 'right', 'center']),
  className: PropTypes.string,
};

export default Actions;
