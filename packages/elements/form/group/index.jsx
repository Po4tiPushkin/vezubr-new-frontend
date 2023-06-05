import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Group = ({ title, children, className: classNameInput, ...otherProps }) => {
  const className = cn('vz-form-group', classNameInput);

  return (
    <div {...otherProps} className={className}>
      {title && <h4 className={'vz-form-group__title'}>{title}</h4>}
      {children}
    </div>
  );
};

Group.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  className: PropTypes.string,
};

export default Group;
