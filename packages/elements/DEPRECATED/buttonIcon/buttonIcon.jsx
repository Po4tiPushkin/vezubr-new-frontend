import React from 'react';
import PropTypes from 'prop-types';

import Button from '../button/button';
import Icon from '../icon/icon';

const ButtonIcon = ({ children, icon, svgIcon, className, ...other }) => {
  let iconComponent = null;
  let classNames = (className || '').split(' ');
  if (icon) {
    iconComponent = <Icon name={icon} />;
    classNames.push(`button-icon-${icon}`);
  } else if (svgIcon) {
    iconComponent = <Icon name={svgIcon} />;
    classNames.push(`button-icon-${svgIcon}`);
  }

  if (other.disabled) {
    classNames.push('disabled');
  }

  if (!other.default) {
    classNames.push('regular');
  }

  classNames.push('element-button-icon');

  classNames = classNames.join(' ');

  return other.default ? (
    <Button className={classNames} {...other}>
      {iconComponent} {children}
    </Button>
  ) : (
    <button className={classNames} {...other}>
      {iconComponent} {children}
    </button>
  );
};

ButtonIcon.propTypes = {
  icon: PropTypes.string,
  svgIcon: PropTypes.string,
};

export default ButtonIcon;
