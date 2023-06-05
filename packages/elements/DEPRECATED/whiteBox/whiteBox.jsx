import React from 'react';
import PropTypes from 'prop-types';
function WhiteBox({ children, className, style }) {
  let classNames = (className || '').split(' ');
  classNames.push('white-box');
  classNames = classNames.join(' ');
  return (
    <div className={classNames} style={style}>
      <div className="white-box-container">{children}</div>
    </div>
  );
}

WhiteBox.propTypes = {
  children: PropTypes.node,
  header: PropTypes.object,
};

export default WhiteBox;
