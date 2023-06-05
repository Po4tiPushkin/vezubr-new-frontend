import React from 'react';
import PropTypes, { array } from 'prop-types';
import { observer } from 'mobx-react';
import { OrderContext } from '../../context';
import OrderFieldSelect from '../../form-fields/order-field-select';
import OrderFieldNumber from '../../form-fields/order-field-number';
import OrderFieldTime from '../../form-fields/order-field-time';
import { IconDeprecated, WhiteBoxHeaderDeprecated } from '@vezubr/elements';
import t from '@vezubr/common/localization';

function OrderAdvancedLoaders(props) {
  const { store } = React.useContext(OrderContext);

  const { addresses: addressesInput } = store.data;

  const { disabled = false } = props

  const addresses = React.useMemo(
    () => addressesInput.filter((a) => !a.isNew).map((a, index) => ({ ...a, position: index + 1 })),
    [addressesInput],
  );

  return (
    <>
      <WhiteBoxHeaderDeprecated icon={<IconDeprecated name={'orderTypeDeliveryOrange'} />}>
        {t.order('loadersRequired')}
      </WhiteBoxHeaderDeprecated>
      <div className={'area'}>
        <div className={'flexbox margin-top-14'}>
          <div className={'area-left'}>
            <OrderFieldNumber label={'Кол-во специалистов'} name={'loadersCountRequired'} placeholder={'Кол-во'} min={0} disabled={disabled} />
          </div>

          <div className={'area-right margin-left-8'} style={{ width: '33.333333333%' }}>
            <OrderFieldSelect
              label={'Адрес подачи специалистов'}
              name={'loadersRequiredOnAddress'}
              placeholder={'Выберите существующий адрес'}
              list={{
                array: addresses,
                labelKey: 'addressString',
                valueKey: 'position',
              }}
            />
          </div>

          <div className={'area-right margin-left-8'}>
            <OrderFieldTime name={'loadersTime'} label={'Время подачи специалистов'} placeholder={'чч:мм'} />
          </div>
        </div>
      </div>
    </>
  );
}

OrderAdvancedLoaders.propTypes = {
  disabled: PropTypes.bool
}

export default observer(OrderAdvancedLoaders);
