import React from 'react';
import PropTypes from 'prop-types';

const NotifyBadge = ({ children, className, type, ...other }) => {
  let classNames = (className || '').split(' ');
  type === 'message' ? classNames.push('message-badge') : classNames.push('notify-badge');

  classNames.push(type || '');

  classNames = classNames.join(' ');

  return (
    <div className={classNames} {...other}>
      {children}
    </div>
  );
};

NotifyBadge.defaultProps = {
  type: 'warning',
};

NotifyBadge.propTypes = {
  type: PropTypes.string,
};

export default NotifyBadge;
