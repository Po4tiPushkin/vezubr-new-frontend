import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Col as ColAnt } from '../../antd';

const Col = ({ children, wrap, className: classNameInput, ...otherProps }) => {
  const className = cn('vz-form-col', classNameInput);

  return (
    <ColAnt {...otherProps} className={className}>
      {children}
    </ColAnt>
  );
};

Col.propTypes = {
  children: PropTypes.node,
  span: PropTypes.number,
  wrap: PropTypes.bool,
  className: PropTypes.string,
};

export default Col;
