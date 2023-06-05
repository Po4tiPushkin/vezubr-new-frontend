import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

function Header(props) {
  const { children, icon, iconStyles, addon, hr, type, className: classNameInput, ...otherProps } = props;

  const className = cn(
    'white-box-modern__header',
    `white-box-modern__header--type-${type}`,
    { 'white-box-modern__header--hr': hr },
    classNameInput,
  );

  return (
    <div {...otherProps} className={className}>
      <span className={'white-box-modern__header__title'}>
        {icon && (
          <span className={'white-box-modern__header__title__icon'} style={iconStyles}>
            {icon}
          </span>
        )}
        <span className={cn('white-box-modern__header__title__text')}>{children}</span>
      </span>

      {addon}
    </div>
  );
}

Header.defaultProps = {
  hr: true,
};

Header.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['h1', 'h2', 'h3']).isRequired,
  icon: PropTypes.node,
  iconStyles: PropTypes.object,
  addon: PropTypes.node,
  hr: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

function WhiteBox({ children, className, ...otherProps }) {
  return (
    <div className={cn('white-box-modern', className)} {...otherProps}>
      <div className="white-box-modern__container" style={{width: '100%'}}>{children}</div>
    </div>
  );
}

WhiteBox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

WhiteBox.Header = Header;

export default WhiteBox;
