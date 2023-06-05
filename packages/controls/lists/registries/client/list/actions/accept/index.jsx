import React, { useCallback, useState } from 'react';
import { Ant, showAlert, showError } from '@vezubr/elements';
import { Invoices as InvoicesService } from '@vezubr/services';

function Accept(props) {
  const { registryId, registryNumber, canReject, reload, uiState, id } = props;

  const [loadingAccept, setLoadingAccept] = useState(false);
  const [visibleAccept, setVisibleAccept] = useState(false);
  const hideAccept = useCallback(() => {
    setVisibleAccept(false);
  }, []);

  const handleVisibleChangeAccept = useCallback((visible) => {
    setVisibleAccept(visible);
  }, []);

  // const paymentDeadline = paymentDeadlineDate && moment(paymentDeadlineDate);

  const acceptAllOrders = useCallback(async () => {
    setLoadingAccept(true);
    try {
      await InvoicesService.accept({ id: registryId });
      setVisibleAccept(false);
      showAlert({
        content: `Все рейсы в реестре ${registryNumber} приняты`,
        onOk: reload,
      });
    } catch (e) {
      setVisibleAccept(false);
      console.error(e);
      showError(e);
    }
    setLoadingAccept(false);
  }, []);

  if (uiState === 510 && canReject) {
    return (
      <div className={'rejected'} title={'Реестр отклонен'}>
        Реестр отклонен
      </div>
    )
  }

  if (uiState === 515 && !canReject) {
    return (
      <Ant.Popover
        overlayClassName="register-accept__popover"
        placement="left"
        visible={visibleAccept}
        onVisibleChange={handleVisibleChangeAccept}
        content={
          <div className={'register-accept__popover__confirm'}>
            <h3>Принять все рейсы в реестре?</h3>
            <div className={'register-accept__popover__confirm__actions'}>
              <Ant.Button size="small" onClick={hideAccept}>
                Нет
              </Ant.Button>
              <Ant.Button loading={loadingAccept} size="small" type={'primary'} onClick={acceptAllOrders}>
                Да
              </Ant.Button>
            </div>
          </div>
        }
        trigger="click"
      >
        <Ant.Button
          title={'Принять все рейсы в реестре'}
          size="small"
          type={'primary'}
          id={id}
        >
          {APP === 'client' ? 'Подтвердить реестр' : 'Подтвердить расчет'}
        </Ant.Button>
      </Ant.Popover>
    );
  }

  if (uiState === 530) {
    return (
      <div className={'rejected'} title={'Реестр отклонен'}>
        Оплата просрочена
      </div>
    )
  }
  if (uiState === 540) {
    return (
      <div className={'standart'} title={'Реестр отклонен'}>
        Оплачен частично
      </div>
    )
  }
  if (uiState === 550) {
    return (
      <div className={'blue'} title={'Реестр отклонен'}>
        Оплачен полностью
      </div>
    )
  }

  return null
}

export default Accept;