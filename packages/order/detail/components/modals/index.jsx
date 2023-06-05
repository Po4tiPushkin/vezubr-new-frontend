import React, { useMemo, useContext } from "react";
import { Ant } from "@vezubr/elements";
import { useSelector } from "react-redux";
import OrdersBindModal from './bind';
import CancelModal from './cancel';
import {
  StatusesModalContentNew,
  AssignTransportToOrder,
  AssignLoadersToOrderNew
} from '@vezubr/components';
import { ActionEditSharing } from '../../../form';
import OrderViewContext from "../../context";
const OrderModals = (props) => {
  const { modal: { showModal, setShowModal }, actions, reload, order } = useContext(OrderViewContext);
  const dictionaries = useSelector(state => state.dictionaries);
  const renderModal = useMemo(() => {
    if (!showModal) {
      return <></>
    }
    switch (showModal) {
      case 'problem':
        return (
          <Ant.Modal
            onCancel={() => setShowModal('')}
            destroyOnClose={true}
            visible={true}
            width={'85vw'}
            footer={[]}
          >
            <StatusesModalContentNew
              dictionaries={dictionaries}
              order={order}
              extendByMinutes={() => { }}
              onModalClose={(val, error) => { setShowModal(''); if (val && !error) { reload() } }}
            />
          </Ant.Modal>
        )
      case 'grouped':
        return (
          <OrdersBindModal
            onSave={(e) => actions.onBindOrders(e, 'grouped')}
            onCancel={() => setShowModal('')}
            defaultRows={order?.ownGroupedOrders}
          />
        )
      case 'linked':
        return (
          <OrdersBindModal
            onSave={(e) => actions.onBindOrders(e, 'linked')}
            onCancel={() => setShowModal('')}
            defaultRows={order?.ownLinkedOrders}
          />
        )
      case 'republish':
        return <ActionEditSharing order={order} showModal={true} closeModal={() => setShowModal('')} />
      case 'assign':
        return (
          order?.type !== 2
            ? <AssignTransportToOrder
              closeModal={() => setShowModal('')}
              order={order || {}}
              isAppointment={order?.orderUiState?.state === 102}
              showPhone={true}
              onClose={(e) => actions.appointOrder(e)}
            />
            : <AssignLoadersToOrderNew
              showModal={true}
              assignedLoaders={order?.loaders || []}
              isAppointment={order?.orderUiState?.state === 102}
              onSelect={actions.appointLoaders}
              onClose={() => setShowModal('')}
              minLoaders={order?.loadersCount}
              requiredLoaderSpecialities={order?.requiredLoaderSpecialities}
            />
        )
      case 'cancel':
        return (
          <CancelModal onSave={(e) => actions.executionCancel(e)} onCancel={() => setShowModal('')} />
        )
      default:
        return <></>
    }
  }, [showModal, actions, order])

  return (
    renderModal
  )
}
export default OrderModals;