import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';

import { ReactComponent as IconComponentAddPin } from '@vezubr/common/assets/img/map/add-location.svg';

function AddressFavorite(props) {
  const { label: labelInput, labelUsed: labelUsedInput, onAction, used = false, has = false, id } = props;

  const label = labelInput || 'Добавить из списка';
  const labelUsed = labelUsedInput || 'Заменить из списка';

  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      if (onAction) {
        onAction();
      }
    },
    [onAction],
  );

  return (
    <a id={id} className={'vz-address-modern-favorite'} title={label} onClick={onClick}>
      <span className={'vz-address-modern-favorite__icon'}>
        <Ant.Icon component={IconComponentAddPin} />
      </span>
    </a>
  );
}

AddressFavorite.propTypes = {
  onAction: PropTypes.func,
  label: PropTypes.node,
  labelUsed: PropTypes.node,
  used: PropTypes.bool,
  has: PropTypes.bool,
};

export default AddressFavorite;
