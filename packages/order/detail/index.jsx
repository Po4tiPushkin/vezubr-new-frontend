import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  IconDeprecated,
  showError,
  showConfirm,
  showAlert,
  LoaderFullScreen,
} from '@vezubr/elements';
import {
  Orders as OrderService,
} from '@vezubr/services';
import * as ROUTE_PARAMS from '@vezubr/common/routing/route-params';
import _get from 'lodash/get';
import { setLocalStorageItem } from "@vezubr/common/common/utils";
import t from '@vezubr/common/localization';
import Utils from '@vezubr/common/common/utils';
import OrderContextView from './context';
import OrderView from './view';
import { getGeneralOrderData } from './utils';
import OrderModals from './components/modals';
const OrderDetail = (props) => {
  const { history, match } = props;
  const { location } = history;
  const orderId = match.params[ROUTE_PARAMS.paramId];
  const dictionaries = useSelector((state) => state.dictionaries);
  const user = useSelector((state) => state.user)

  const [employees, setEmployees] = useState([]);
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState('');

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const [order, employees] = await getGeneralOrderData(orderId, user, dictionaries);
      setEmployees(employees);
      setOrder(order);
    } catch (e) {
      showError(e);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [orderId])

  const cancelOrder = useCallback(async () => {
    if (loading) {
      return;
    }
    showConfirm({
      title: `Вы точно хотите отменить рейс?`,
      onOk: async () => {
        try {
          await OrderService.cancelRequest(order?.requestId.toString());
          showAlert({
            title: `Рейс №${order?.requestNr} успешно отменен`
          });
          fetchOrder();
        } catch (e) {
          showError(e)
          console.error(e)
        }
      },
    });
  }, [orderId, order?.requestId,, order?.requestNr, loading]);

  const cloneOrder = useCallback(() => {
    if (loading) {
      return;
    }

    let orderType = 'city';

    if (order.type === 2) {
      orderType = 'loader';
    } else if (order.type === 3) {
      orderType = 'intercity';
    }
    history.push(`/new-order/from/${orderId}/${orderType}`);
  }, [orderId, order?.type, loading]);

  const editOrder = useCallback(() => {
    if (loading) {
      return;
    }
    history.push(`/edit-order/${orderId}/${order.type === 3 ? 'intercity' : order.type === 2 ? 'loader' : 'city'}`);
  }, [orderId, order?.type, loading]);

  const take = useCallback(async () => {
    try {
      setLoading(true);
      await OrderService.take(orderId);
      await fetchOrder();
    } catch (e) {
      showError(e);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [orderId])

  const exportOrderToExcel = useCallback(async () => {
    const csvContent = await OrderService.csvReport(orderId);
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent);
    hiddenElement.target = '_blank';
    hiddenElement.download = `order_${orderId}.csv`;
    hiddenElement.click();
  }, [orderId]);

  const getContractReport = useCallback(async () => {
    showConfirm({
      title: t.order('contractReportAlert'),
      onOk: async () => {
        try {
          const report = await OrderService.getContractReport(orderId);
          const blob = new Blob([report], { type: "application/pdf" })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `Договор-заявка по рейсу №${orderId}.pdf`
          link.click()
        } catch (e) {
          showError(e)
          console.error(e)
        }
      },
    })
  }, [orderId]);

  const appointOrder = useCallback((appointed) => {
    if (!appointed) {
      return;
    }
    setShowModal('')
    showAlert(
      {
        content: order?.orderUiState?.state === 102 ? 'Рейс принят' : 'Тс и водитель изменены',
        onCancel: () => { fetchOrder() },
        onOk: () => { fetchOrder() }
      }
    )
    return;
  }, [order]);

  const finishOrder = useCallback(async () => {
    try {
      setLoading(true);
      await OrderService.executionFinish(orderId);
      await OrderService.finalize({
        orderId: parseInt(orderId),
      });
      await fetchOrder();
    } catch (e) {
      showError(e);
      console.error(e);
    } finally {
      setLoading(false)
    }
  }, [orderId]);

  const startOrder = useCallback(async () => {
    try {
      setLoading(true)
      await OrderService.executionStart(orderId);
      await fetchOrder();
      history.push(`/orders/${orderId}/${APP === 'dispatcher' ? 'documents-producer?' : 'calculations?'}`)
    } catch (e) {
      if (e.code === 422) {
        if (order?.type === 2) {
          showError('Специалист находится на другом активном заказе')
        }
        else {
          showError('Данное ТС находится в активном рейсе. Пожалуйста, назначьте другой ТС на данный рейс')
        }
      } else {
        showError(e);
      }
      console.error(e);
    } finally {
      setLoading(false)
    }
  }, [orderId, order?.type])

  const executionCancel = useCallback(async (cancellationReason) => {
    try {
      setShowModal('');
      await OrderService.executionCancel(orderId, { cancellationReason });

      // const cancelReasonsStorage = localStorage.getItem('executionCancelReasons') ?
      //   JSON.parse(localStorage.getItem('executionCancelReasons')) : [];

      // if (cancellationComment &&
      //   Array.isArray(cancelReasonsStorage) &&
      //   !cancelReasonsStorage.find(el => el === cancellationComment)
      // ) {
      //   cancelReasonsStorage.push(cancellationComment);
      //   setLocalStorageItem('executionCancelReasons', JSON.stringify(cancelReasonsStorage))
      // }
      fetchOrder()
    } catch (e) {
      showError(e)
      console.error(e);
    }
  }, [orderId])

  const appointLoaders = useCallback(async (loaders = []) => {
    try {
      const loadersIds = loaders.map(el => String(el.id));
      const brigadier = loadersIds?.[0];
      if (order?.orderUiState?.state === 102) {
        await OrderService.appointLoaders(orderId, { brigadier, loaders: loadersIds.filter(el => el !== brigadier) });
      }
      else {
        await OrderService.replaceLoaders({
          id: orderId,
          data: { brigadier, loaders: loadersIds.filter(el => el !== brigadier) }
        });
      }
      setShowModal('');
      fetchOrder();
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [orderId, order])

  const onBindOrders = useCallback(async (selectedRows, relationType) => {
    try {
      setShowModal('');
      await OrderService.addRelatedOrders({ id: orderId, data: { relatedOrders: selectedRows, relationType } })
      fetchOrder();
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [orderId])

  const createBindLoader = useCallback(() => {
    if (loading) {
      return
    }
    history.push(`/new-order/create-bind/${orderId}/loader`);
  }, [orderId]);

  useEffect(() => {
    if (loading === false) {
      Utils.scrollOrderToNecessaryPlace(location)
    }
  }, [loading, location])

  const actions = {
    createBindLoader,
    onBindOrders,
    appointLoaders,
    executionCancel,
    startOrder,
    finishOrder,
    appointOrder,
    getContractReport,
    editOrder,
    take,
    cancelOrder,
    cloneOrder,
    exportOrderToExcel
  }

  useEffect(() => {
    fetchOrder()
  }, []);

  return (
    <OrderContextView.Provider value={
      {
        order,
        actions,
        employees,
        reload: () => fetchOrder(),
        modal: { showModal, setShowModal }
      }
    }>
      <div className="order-view">
        <OrderView loading={loading} />
        <OrderModals />
      </div>
    </OrderContextView.Provider>
  )
}

export default OrderDetail