import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon/icon';

const Button = ({
  children,
  className,
  theme,
  rounded,
  wide,
  full,
  type,
  icon,
  disabled,
  iconNormal = false,
  loading = false,
  ...other
}) => {
  let classNames = (className || '').split(' ');
  classNames.push('element-button');
  icon ? classNames.push('icon-padding') : void 0;
  classNames.push(`theme-${theme}`);
  let loader = null;
  if (rounded) {
    classNames.push('rounded');
  }

  if (wide) {
    classNames.push('wide');
  }

  if (full) {
    classNames.push('full');
  }
  if (disabled) {
    classNames.push('disabled');
  }
  if (loading) {
    classNames.push('lds-spinner');
    classNames.push('disabled');
    const items = Array.from({ length: 12 }, (item, index) => <div key={index} />);
    loader = <div className={`spinner-wrapper ${other.loaderClass || ''}`}>{items}</div>;
  }

  classNames = classNames.join(' ');
  return (
    <button type={type} className={classNames} {...other}>
      {icon && !loader ? (
        <span className={'icon-content'}>
          <Icon name={icon} className={!iconNormal ? 'icon-small' : ''} />
          <p className={'margin-bottom-0 margin-top-2'}>{children}</p>
        </span>
      ) : (
        loader || children
      )}
    </button>
  );
};

Button.defaultProps = {
  theme: 'simple',
  type: 'button',
  rounded: false,
  wide: false,
};

Button.propTypes = {
  theme: PropTypes.string,
  type: PropTypes.string,
  rounded: PropTypes.bool,
  wide: PropTypes.bool,
};

export default Button;
