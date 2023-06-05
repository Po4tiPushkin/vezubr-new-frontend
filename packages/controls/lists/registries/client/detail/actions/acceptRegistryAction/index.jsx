import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Ant, showAlert, showConfirm, showError } from '@vezubr/elements';
import { Invoices as InvoicesService } from '@vezubr/services';

function AcceptRegistryAction(props) {
  const { registryId, registryNumber, hasRejectedOrders, isHasNoneResolve, reload, count, countAccepted, canBeAccepted } = props;

  const accept = useCallback(async () => {
    const hideMessage = Ant.message.loading({
      content: 'Пытаемся принять реестр...',
      key: '__ACTION_ACCEPT_REGISTRY__',
      duration: 0,
    });
    try {
      await InvoicesService.accept({id: registryId});
      hideMessage();
      showAlert({
        content: `Все рейсы в реестре ${registryNumber} приняты`,
        onOk: reload,
      });
    } catch (e) {
      hideMessage();
      console.error(e);
      showError(e);
    }
  }, []);

  const confirmAccept = useCallback(async () => {
    showConfirm({
      title: 'Подтвердить реестр?',
      content: 'Для всех рейсов в реестре будет принят расчет',
      onOk: accept,
    })
  }, []);

  const isAccepted = countAccepted >= count;

  return (
    <div className={'registry-accept-orders'}>
      <div className={"registry-accept-orders__progress"}>
        <Ant.Progress
          status={hasRejectedOrders ? "exception" : undefined}
          percent={Math.ceil(( countAccepted / count) * 100)}
          size={"large"}
        />
      </div>
      <div className={"registry-accept-orders__button"}>

        {isAccepted && (
          <div className={'registry-accept-orders__accepted'}>
            Реестр принят
          </div>
        )}

        {!isAccepted && !hasRejectedOrders && canBeAccepted && (
          <Ant.Button
            onClick={confirmAccept}
            type={"primary"}
          >
            Подтвердить реестр
          </Ant.Button>
        )}

        {!isAccepted && hasRejectedOrders && (
          <div className={'registry-accept-orders__rejected'}>
            Реестр отклонен
          </div>
        )}
      </div>
    </div>

  )
}

AcceptRegistryAction.propTypes = {
  registryId: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  countAccepted: PropTypes.number.isRequired,
  hasRejectedOrders: PropTypes.bool,
  isHasNoneResolve: PropTypes.bool,
  registryNumber: PropTypes.number.isRequired,
  reload: PropTypes.func.isRequired,
};

export default AcceptRegistryAction;
