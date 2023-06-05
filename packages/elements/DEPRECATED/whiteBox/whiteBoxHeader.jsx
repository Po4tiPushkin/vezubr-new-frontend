import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

function WhiteBoxHeader(props) {
  const { children, icon, addon, className } = props;
  return (
    <div className={cn('white-box-header', className)}>
      {icon && <div className={'white-box-icon-wrapper'}>{icon}</div>}
      <h3>{children}</h3>
      {addon}
    </div>
  );
}

WhiteBoxHeader.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  addon: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default WhiteBoxHeader;
