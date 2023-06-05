import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { AssignTransportToOrder } from '@vezubr/components';
import * as Monitor from '../../../..';
import { STORE_VAR_ASSIGN_VEHICLE_TO_ORDER } from '../../../constants';
import { showAlert, showError, Ant } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
const transports = [];
const drivers = [];

const { useGetVar } = Monitor;

function ActionAssignTransportToOrder(props) {
  const { store } = React.useContext(Monitor.Context);
  const [renderModal, setRenderModal] = useState(false);
  const history = useHistory();
  const user = useSelector(state => state.user);
  const closeModal = React.useCallback(() => {
    store.deleteVar(STORE_VAR_ASSIGN_VEHICLE_TO_ORDER);
    setRenderModal(false);
  }, []);

  const orderId = useGetVar(STORE_VAR_ASSIGN_VEHICLE_TO_ORDER);

  const order = orderId && store.getItemById(orderId, 'order');
  const orderDirty = order && order.dataDirty;

  const showModal = !!orderId;

  const renderedModal = useMemo(() => {
    if (orderDirty) {
      if (orderDirty.isInsuranceRequired && !orderDirty.isInsurerContractSelected) {
        return (
          <Ant.Modal
            destroyOnClose={true}
            visible={orderDirty}
            onCancel={() => closeModal()}
            footer={
              [
                <Ant.Button
                  onClick={() => {
                    history.push(
                      `/counterparty/${(orderDirty.performers || [])?.find(({ producerId }) => producerId === user?.id)?.clientId}/settings`
                    )
                  }}
                >
                  Выбрать СК
                </Ant.Button>,
                <Ant.Button onClick={() => closeModal()} >Отмена</Ant.Button>,
                <Ant.Button onClick={() => setRenderModal(true)}>Назначить ТС без страхования</Ant.Button>,
              ]
            }
          >
            <div>
              Заказчик опубликовал заказ с требованием обязательного страхования перевозимого груза.
              Для автоматического страхования груза необходимо в карточке Заказчика выбрать страховую компанию и номер договора.
            </div>
          </Ant.Modal>
        )
      }
      else if (!renderModal) {
        setRenderModal(true)
        return null;
      }
    }

    return null

  }, [orderDirty, renderModal])

  const resultOperationClose = useCallback((showSuccessMessage) => {
    closeModal();

    if (showSuccessMessage) {
      showAlert({
        title: `Рейс № ${orderDirty?.orderNr}`,
        content: 'Принят к исполнению',
      });
    }
  }, [orderDirty?.orderNr]);

  return (renderModal && order) ? (
    <AssignTransportToOrder
      order={orderDirty || {}}
      onClose={resultOperationClose}
      closeModal={() => closeModal()}
      showModal={showModal}
      isAppointment={!order?.vehicle}
      transports={transports}
      drivers={drivers}
      showPhone={true}
    />
  ) :
    renderedModal

}

export default ActionAssignTransportToOrder;
