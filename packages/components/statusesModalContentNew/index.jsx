import React, { useCallback } from 'react';
import { Orders as OrdersService } from '@vezubr/services';
import useStatuses from './hooks/useStatuses';
import { showError } from '@vezubr/elements';
const StatusesModalContent = (props) => {
  const { onModalClose, order = {} } = props;
  
  const extendByMinutes = useCallback(async (id) => {
    try {
      await OrdersService.extendSelecting(id);
      onModalClose('accept');
    } catch (e) {
      showError(e);
      console.error(e);
    }

  }, [onModalClose])

  const acceptExecutorChange = useCallback( async (id) => {
    try {
      await OrdersService.acceptExecutorChange(id);
    } catch (e) {
      console.error(e);
      showError('Данный водитель уже назначен на другой рейс')
    }
    finally {
      onModalClose('accept');
    }

  }, [onModalClose])


  const cancelRequest = useCallback(async (id) => {
    await OrdersService.cancelRequest(id);
    onModalClose('remove');
  }, [onModalClose, order]);

  const declineExecutorChange = useCallback(async (id) => {
    await OrdersService.declineExecutorChange(id);
    onModalClose('accept');
  }, [onModalClose])

  const cancelRequestCancel = useCallback(async (id) => {
    await OrdersService.cancelRequest(id);
    onModalClose('accept');
  }, [onModalClose]);

  const cancelRequestAccept = useCallback(async (id) => {
    await OrdersService.cancelRequestAccept(id);
    onModalClose('accept');
  }, [onModalClose])

  const statuses = useStatuses({ cancelRequest, cancelRequestAccept, cancelRequestCancel, acceptExecutorChange, extendByMinutes, order, declineExecutorChange })

  return (
    <>
    {statuses.map((value, key) => <div key={key}>{value}</div>)}
    </>
  )
}

export default StatusesModalContent;