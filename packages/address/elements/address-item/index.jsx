import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import AddressItemButton from './address-item-button';

function AddressItem(props) {
  const { label, onEdit, onAdd, onRemove, children, canChange, extra, extraClassName = '', disabled } = props;

  const leftButton = useMemo(() => {
    if (!canChange) {
      return <AddressItemButton iconName={'select'} onAction={onEdit} />;
    }

    if (onEdit) {
      return <AddressItemButton iconName={'edit'} onAction={onEdit} />;
    }

    if (onAdd) {
      return <AddressItemButton iconName={'plus'} onAction={onAdd} />;
    }

    return null;
  }, [onEdit, onAdd]);

  const rightButton = useMemo(() => {
    if (onRemove) {
      return <AddressItemButton iconName={'delete'} onAction={onRemove} />;
    }
    return null;
  }, [onRemove]);

  return (
    <div className={`vz-address-modern-item ${extraClassName} ${disabled ? 'disabled' : ''}`}>
      {leftButton}
      <div className={'vz-address-modern-item__elem'}>
        {label && <div className={'vz-address-modern-item__label'}>{label}</div>}
        {children && <div className={'vz-address-modern-item__content'}>{children}</div>}
      </div>
      {extra && <div className={'vz-address-modern-item__extra'}>{extra}</div>}
      {canChange && rightButton}
    </div>
  );
}

AddressItem.propTypes = {
  onEdit: PropTypes.func,
  canChange: PropTypes.bool,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  label: PropTypes.node,
  extra: PropTypes.node,
  children: PropTypes.node,
  buttonProps: PropTypes.object,
  extraClassName: PropTypes.string,
};

export default AddressItem;
