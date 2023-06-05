import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import OfferItem from '../../../../store/OfferItem';
import { Ant } from '@vezubr/elements';
import cn from 'classnames';
import Utils from '@vezubr/common/common/utils';

function BargainOfferRate(props) {
  const { offer, editing, onChange: onChangeInput, title, hasError, size: sizeInput } = props;
  const { sum } = offer.data;
  const size = sizeInput || 'small';

  const onChange = React.useCallback(
    (value) => {
      if (onChangeInput) {
        onChangeInput(value * 100);
      }
    },
    [onChangeInput],
  );

  const defaultValue = sum / 100;

  return (
    <span className={cn('bargain-offer-rate', { 'has-error': hasError })}>
      {title && <span className={'bargain-offer-rate__title'}>{title}</span>}

      <span className={'bargain-offer-rate__field'}>
        {editing ? (
          <Ant.InputNumber
            defaultValue={defaultValue}
            decimalSeparator={','}
            min={1}
            onChange={onChange}
            step={500}
            size={size}
          />
        ) : (
          Utils.moneyFormat(sum)
        )}
      </span>
    </span>
  );
}

BargainOfferRate.propTypes = {
  offer: PropTypes.instanceOf(OfferItem),
  editing: PropTypes.bool,
  onChange: PropTypes.func,
  title: PropTypes.node,
  hasError: PropTypes.bool,
  size: PropTypes.string,
};

export default observer(BargainOfferRate);
