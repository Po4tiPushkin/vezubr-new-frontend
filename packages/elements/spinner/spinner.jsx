import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../DEPRECATED/icon/icon';

const Spinner = ({ children, className, ...other }) => {
  let classNames = (className || '').split(' ');
  classNames.push('lds-spinner');
  const items = Array.from({ length: 12 }, (item, index) => <div key={index} />);
  const loader = (
    <div className={`spinner-wrapper ${other.loaderClass || ''}`} style={{}}>
      {items}
    </div>
  );
  classNames = classNames.join(' ');
  return (
    <div className={classNames} {...other} style={{ position: 'relative' }}>
      {loader}
    </div>
  );
};
export default Spinner;
