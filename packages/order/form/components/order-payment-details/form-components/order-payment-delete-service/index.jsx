import React, { useContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { OrderPaymentContext } from '../../../../context';
import { Ant } from '@vezubr/elements';

const CLS = 'order-payment-delete-service';

function OrderPaymentDeleteService(props) {
  const { article } = props;

  const [visible, setVisible] = useState(false);
  const { store } = useContext(OrderPaymentContext);

  const popoverClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleVisibleChange = useCallback((visible) => {
    setVisible(visible);
  }, []);

  const remove = useCallback(() => {
    store.deleteArticle(article);
    popoverClose();
  }, [article]);

  if (!store.canDeleteArticle(article)) {
    return null;
  }

  return (
    <div className={CLS}>
      <Ant.Popover
        placement="topLeft"
        visible={visible}
        onVisibleChange={handleVisibleChange}
        trigger="click"
        title="Удалить услугу?"
        content={
          <div className={`${CLS}__actions`}>
            <Ant.Button size={'small'} className={`${CLS}__actions__button`} type={'primary'} onClick={remove}>
              Да
            </Ant.Button>
            <Ant.Button size={'small'} className={`${CLS}__actions__button`} onClick={popoverClose}>
              Нет
            </Ant.Button>
          </div>
        }
      >
        <Ant.Icon className={`${CLS}__icon`} type="delete" title={'Удалить услугу'} />
      </Ant.Popover>
    </div>
  );
}

OrderPaymentDeleteService.propTypes = {
  article: PropTypes.number.isRequired,
};

export default observer(OrderPaymentDeleteService);
