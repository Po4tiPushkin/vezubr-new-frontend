import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';

function AddressItemButton(props) {
  const { iconName, title, onAction, ...otherProps } = props;

  const onClick = React.useCallback(
    (e) => {
      e.preventDefault();
      if (onAction) {
        onAction();
      }
    },
    [otherProps],
  );

  return (
    <a
      {...otherProps}
      className={cn('vz-address-modern-item__button', `vz-address-modern-item__button--${iconName}`)}
      onClick={onClick}
      title={title}
    >
      <Ant.Icon type={iconName} />
    </a>
  );
}

AddressItemButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  title: PropTypes.string,
  onAction: PropTypes.func,
};

export default AddressItemButton;
