import React, { useCallback } from 'react';
import { AssignLoadersToOrderNew } from '@vezubr/components';
import * as Monitor from '../../../../';
import { STORE_VAR_ASSIGN_LOADERS_TO_ORDER } from '../../../constants';
import { showAlert, showError } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { Orders as OrderService } from '@vezubr/services'

const { useGetVar } = Monitor;

function ActionAssignLoadersToOrder(props) {
  const { store, dictionaries } = React.useContext(Monitor.Context);
  const closeModal = React.useCallback(() => {
    store.deleteVar(STORE_VAR_ASSIGN_LOADERS_TO_ORDER);
  }, []);

  const orderId = useGetVar(STORE_VAR_ASSIGN_LOADERS_TO_ORDER);

  const order = orderId && store.getItemById(orderId, 'order');
  const orderDirty = order && order.dataDirty;

  const showModal = !!orderId;

  const resultOperationClose = useCallback(async (result, e) => {
    closeModal();

    const { showSuccessMessage, title, description } = result || {};

    if (showSuccessMessage) {
      showAlert({
        title,
        content: description,
      });
    } else if (e) {
      const searchError = e.data || e;
      let messageError =
        searchError.error_str || (searchError.error_no && t.error(searchError.error_no)) || searchError.toString();
      if (typeof messageError !== 'string' || messageError === '[object Object]' ) {
        messageError = '';
      }
      if (typeof searchError === 'object') {
        Object.keys(searchError).forEach(el => {
          if (Array.isArray(searchError[el]) && el === 'trailer') {
            messageError = 'Укажите полуприцеп';
          }

          if (Array.isArray(searchError[el]) && el === 'mismatch') {
            messageError = 'Невозможно назначить ТС: На данный рейс был назначен другой подрядчик';
          }
        })
      }
      showError(e, {
        title,
        content: `${description}: ` + messageError,
      });
    }
  }, []);

  const appointLoaders = useCallback(async (loaders = []) => {
    try {
      const loadersIds = loaders.map(el => String(el.id));
      const brigadier = loadersIds?.[0];
      await OrderService.appointLoaders(orderDirty?.id, { brigadier, loaders: loadersIds.filter(el => el !== brigadier) });
      closeModal();
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [orderDirty])

  return orderDirty ? (
    <AssignLoadersToOrderNew
      onClose={resultOperationClose}
      closeModal={() => closeModal()}
      showModal={showModal}
      isAppointment={!order.vehicle}
      assignedLoaders={orderDirty?.loaders || []}
      onSelect={appointLoaders}
      minLoaders={orderDirty?.orderedLoadersCount}
      requiredLoaderSpecialities={orderDirty?.requiredLoaderSpecialities}
    />
  ) : null;
}

export default ActionAssignLoadersToOrder;
