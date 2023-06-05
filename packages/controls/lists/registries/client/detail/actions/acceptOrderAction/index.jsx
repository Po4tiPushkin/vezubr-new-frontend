import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Ant, showAlert, showError } from '@vezubr/elements';
import { Orders as OrderService } from '@vezubr/services';

function AcceptOrderAction(props) {
  const { orderId, reload, calculationId, uiState, hasRejectedOrders, ...otherProps } = props;

  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = React.useState(false);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  const accept = useCallback(async () => {
    setLoading(true);
    try {
      await OrderService.acceptOrderCalculation({ orderId, calculationId });
      setVisible(false);
      showAlert({
        content: `Рейс ${orderId} принят`,
        onOk: reload,
        onCancel: reload,
      });
    } catch (e) {
      setVisible(false);
      console.error(e);
      showError(e);
    }
    setLoading(false);
  }, []);

  const handleVisibleChange = React.useCallback((visible) => {
    setVisible(visible);
  }, []);


  if (hasRejectedOrders) {
    return (
      <div className={'rejected'} title={''}>
        Реестр отклонен
      </div>
    );
  }

  if (uiState === 410) {
    return (
      <div className={'standart'} title={''}>
        Ожидает Подрядчика
      </div>
    );
  }

  if ([422, 424, 426].includes(uiState)) {
    return (
      <div className={'standart'} title={''}>
        Ожидает Заказчика
      </div>
    );
  }
  if ([500, 610].includes(uiState)) {
    return (
      <div className={'accepted'} title={''}>
        {uiState === 500 ? 'Подтвержден' : 'Оплачен полностью'}
      </div>
    );
  }

  if (uiState === 620) {
    return (
      <div className={'rejected'} title={''}>
        Закрыт без расчетов
      </div>
    );
  }

  return <></>

  // return (
  //   <Ant.Popover
  //     overlayClassName="register-order-accept__popover"
  //     placement="left"
  //     visible={visible}
  //     onVisibleChange={handleVisibleChange}
  //     content={
  //       <div className={'register-order-accept__popover__confirm'}>
  //         <h3>Калькуляция по рейсу будет принята?</h3>
  //         <div className={'register-order-accept__popover__confirm__actions'}>
  //           <Ant.Button size="small" onClick={hide}>
  //             Нет
  //           </Ant.Button>
  //           <Ant.Button loading={loading} size="small" type={'primary'} onClick={accept}>
  //             Да
  //           </Ant.Button>
  //         </div>
  //       </div>
  //     }
  //     trigger="click"
  //   >
  //     <Ant.Button disabled={isAccepted} size="small" type={'primary'} {...otherProps}>
  //       Принять
  //     </Ant.Button>
  //   </Ant.Popover>
  // );
}

export default AcceptOrderAction;
