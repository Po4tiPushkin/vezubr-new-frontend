import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Row as RowAnt } from '../../antd';

const Row = ({ children, wrap, className: classNameInput, gutter: gutterInput, ...otherProps }) => {
  const gutter = gutterInput || [8, 8];

  const className = cn('vz-form-row', { 'vz-form-row--wrap': wrap }, classNameInput);

  return (
    <div className={className}>
      <RowAnt type={'flex'} {...otherProps} gutter={gutter} className={'vz-form-row__native'}>
        {children}
      </RowAnt>
    </div>
  );
};

Row.propTypes = {
  children: PropTypes.node,
  wrap: PropTypes.bool,
  gutter: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
  justify: PropTypes.string,
  align: PropTypes.string,
};

export default Row;
