import React, { useCallback, useContext, useState, useMemo } from 'react';
import { Ant, WhiteBox, Loader } from '@vezubr/elements';
import DocumentsSending from './tabs/documents-sending';
import DocumentsAccepting from './tabs/documents-accepting';
import OrderViewContext from '../../context';

const CLS = 'order-view-tab-documents';

const OrderViewTabDocuments = (props) => {
  const { order, reload } = useContext(OrderViewContext);

  const [pending, setPending] = useState(false);

  const [availableWorkModes, setAvailableWorkModes] = useState({
    sending: true,
    accepting: false,
  });

  const [currentWorkMode, setCurrentWorkMode] = useState({
    sending: APP === 'dispatcher' || APP === 'producer',
    accepting: APP === 'client',
  });

  const handleWorkModeSwitch = useCallback(
    (checked) => {
      setCurrentWorkMode({
        sending: !checked,
        accepting: checked,
      });
    },
    [setCurrentWorkMode],
  );

  React.useEffect(() => {
    if (order) {
      const { performers, clientDelegateManagement, producerDelegateManagement } = order;
      let acceptingAvailable = false;
      let sendingAvailable = false;
      switch (APP) {
        case 'dispatcher':
          acceptingAvailable = performers?.length > 0 && clientDelegateManagement;
          sendingAvailable = producerDelegateManagement || performers?.length == 1;
          handleWorkModeSwitch(
            (acceptingAvailable && !sendingAvailable) ||
            (performers?.length == 2 && !clientDelegateManagement && !producerDelegateManagement),
          );
          break;
        case 'client':
          acceptingAvailable = true;
          break;
        case 'producer':
          sendingAvailable = true;
          break;
      }
      setAvailableWorkModes({
        accepting: acceptingAvailable,
        sending: sendingAvailable,
      });
    }
  }, [order]);

  const renderContent = () => {
    if (currentWorkMode?.sending) {
      return <DocumentsSending
        order={order}
        reload={reload}
      />;
    } else if (currentWorkMode?.accepting) {
      return <DocumentsAccepting
        isAcceptingAvailable={order?.isAcceptingAvailable && (APP === 'client' || order?.clientDelegateManagement)}
        order={order}
        reload={reload}
      />;
    }
  };

  const showGoToDocumnetsButton = useMemo(() => {
    if (order?.orderUiState?.state >= 201 && Array.isArray(order?.points)) {
      return !order.points.find(el => el.pointOwner === null);
    }
    return false;
  }, [order])

  const renderActions = () => {
    return (
      <div className={`${CLS}__top-bar`}>
        {(APP === 'dispatcher' && (availableWorkModes?.sending || availableWorkModes?.accepting)) ? (
          <div className={`${CLS}__switch-tab`}>
            <span className={`margin-right-15 ${!availableWorkModes.sending ? 'disabled' : ''}`}>Отправка</span>
            <Ant.Switch
              {...{
                checked: currentWorkMode?.accepting,
                // defaultChecked: !availableWorkModes?.sending && availableWorkModes?.accepting,
                disabled: Object.values(availableWorkModes)?.filter((item) => item).length <= 1,
                onChange: handleWorkModeSwitch,
              }}
            />
            <span className={`margin-left-15 ${!availableWorkModes.accepting ? 'disabled' : ''}`}>Проверка</span>
          </div>
        ) : null}
        {showGoToDocumnetsButton && (
          <Ant.Button
            size='small'
            type='primary'
            onClick={() => window.open(`/documents-flow?orderNr=${encodeURIComponent(order.orderNr)}`, '_blank')}
          >
            Перейти в перевозочные документы
          </Ant.Button>
        )}
      </div>
    );
  }

  const renderDocuments = () => (
    <>
      {renderActions()}
      {renderContent()}
    </>
  );

  return (
    <WhiteBox className={`${CLS} order-view__tab`}>
      {renderDocuments()}
      {pending && <Loader />}
    </WhiteBox>
  );
};

export default OrderViewTabDocuments;
