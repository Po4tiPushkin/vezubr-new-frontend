import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant, VzForm } from '@vezubr/elements';
import * as Order from '../../../..';
import t from '@vezubr/common/localization';
import OrderContourTreeSelect from '../../form-components/order-contour-tree-select-client';

const CLS_COMPONENT = 'order-loader-choose-contour-producer-form';

function OrderLoaderChooseContourProducerForm(props) {
  const { onSubmit, onCancel } = props;

  const { store } = React.useContext(Order.Context.OrderContext);

  const handleSave = React.useCallback(
    (e) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(store);
      }
    },
    [onSubmit],
  );

  const handleCancel = React.useCallback(() => {
    if (onCancel) {
      onCancel(store);
    }
  }, [onCancel]);

  return (
    <div className={`${CLS_COMPONENT}`}>
      <VzForm.Group title={'Контуры и подрядчики'}>
        <OrderContourTreeSelect />
      </VzForm.Group>

      <div className={`${CLS_COMPONENT}__actions`}>
        <Ant.Button type={'ghost'} onClick={handleCancel}>
          {t.order('cancel')}
        </Ant.Button>

        <Ant.Button htmlType="submit" onClick={handleSave} type={'primary'}>
          Опубликовать
        </Ant.Button>
      </div>
    </div>
  );
}

OrderLoaderChooseContourProducerForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default observer(OrderLoaderChooseContourProducerForm);
