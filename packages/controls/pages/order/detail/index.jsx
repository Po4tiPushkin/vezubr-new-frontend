import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  IconDeprecated,
  showError,
  showConfirm,
  showAlert,
  LoaderFullScreen,
} from '@vezubr/elements';
import { ActionEditSharing } from '@vezubr/order/form';
import {
  LinkGoBackRenderProps,
  ModalDeprecated,
  StatusesModalContentNew,
  AssignTransportToOrder,
  AssignLoadersToOrderNew
} from '@vezubr/components';
import * as Elements from './elements';
import {
  Orders as OrderService,
  Orders as OrdersService,
} from '@vezubr/services';
import { ROUTE_PARAMS } from '../../../infrastructure';
import useMenuOptions from './hooks/useMenuOptions';
import useTopInfo from './hooks/useTopInfo';
import Utils from '@vezubr/common/common/utils';
import _get from 'lodash/get';
import usePriceInfo from './hooks/usePriceInfo';
import OrdersBindModal from '@vezubr/order/detail/components/modals/bind';
import { getGeneralOrderData } from './utils'
import CancelModal from '@vezubr/order/detail/components/modals/cancel';
import { setLocalStorageItem } from "@vezubr/common/common/utils";

const selectionStates = [102, 201];
const preCostStatuses = { min: 101, max: 400 };


const OrderView = (props) => {
  const { location, history, match } = props;
  const dictionaries = useSelector((state) => state.dictionaries);
  const user = useSelector((state) => state.user)
  const orderId = match.params[ROUTE_PARAMS.paramId];
  const [data, setData] = useState({});
  const [cargoPlace, setCargoPlace] = useState([]);
  const [parkingList, setParkingList] = useState([]);
  const [reload, reloadOrder] = useState(Date.now());
  const backUrl = useMemo(() => location.state ? location?.state?.back?.pathname : '/orders', [orderId])
  const [loading, setLoading] = useState(false);
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [problemModal, setProblemModal] = useState(false);
  const [responsibleEmployees, setResponsibleEmployees] = useState([]);
  const [assignModal, setAssignModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [appoint, setAppoint] = useState(false);
  const [showRepublishModal, setShowRepublishModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const problemOptions = useMemo(() => {
    return {
      showModal: problemModal,
      showClose: true,
      modalClassnames: 'no-padding no-background',
      bodyClassnames: 'no-padding-right no-padding-left no-padding-top no-background',
    }
  }, [problemModal])

  const cancelOrder = useCallback(async () => {
    if (loading) {
      return;
    }
    showConfirm({
      title: `Вы точно хотите отменить рейс?`,
      onOk: async () => {
        try {
          await OrderService.cancelRequest(data.requestId.toString());
          showAlert({
            title: `Рейс №${data.id} успешно отменен`
          });
          reloadOrder(Date.now());
        } catch (e) {
          showError(e)
          console.error(e)
        }
      },
    });
  }, [reload, orderId, data, loading]);

  const cloneOrder = useCallback(() => {
    if (loading) {
      return;
    }

    let orderType = 'city';

    if (data.type === 2) {
      orderType = 'loader';
    } else if (data.type === 3) {
      orderType = 'intercity';
    }
    history.push(`/new-order/from/${data.id}/${orderType}`);
  }, [orderId, reload, data, loading, history]);

  const editOrder = useCallback(() => {
    if (loading) {
      return;
    }
    history.push(`/edit-order/${data.id}/${data.type === 3 ? 'intercity' : data.type === 2 ? 'loader' : 'city'}`);
  }, [orderId, reload, data, loading, history]);

  const extendByMinutes = useCallback((orderId) => {

  }, []);

  const take = useCallback(async () => {
    try {
      setLoading(true);
      await OrderService.take(orderId);
      reloadOrder(Date.now());
    } catch (e) {
      showError(e);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [orderId])

  const onSaveEmployees = useCallback(async (values) => {
    const prevEmployyes = [...responsibleEmployees];
    try {
      setResponsibleEmployees(values.responsibleEmployees);
      await OrderService.responsibleEmployees({ id: orderId, data: { responsibleEmployees: values.responsibleEmployees } })
    } catch (e) {
      console.error(e);
      showError(e);
      setResponsibleEmployees(prevEmployyes);
    }

  }, [orderId, responsibleEmployees])

  const docDownload = async (e, doc) => {
    e.preventDefault();
    const url = Utils.concatImageUrl(doc?.file?.download_url);
    const win = window.open(url, '_blank');
    win.focus();
  }

  const goBackRender = useMemo(() => {
    return (
      <LinkGoBackRenderProps location={location} defaultUrl={'/orders'}>
        {() => <IconDeprecated name={'backArrowOrange'} className={'pointer'} onClick={() => history.push(backUrl)} />}
      </LinkGoBackRenderProps>
    )
  }, [location, history]);

  const exportOrderToExcel = useCallback(async () => {
    const csvContent = await OrderService.csvReport(data?.id);
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent);
    hiddenElement.target = '_blank';
    hiddenElement.download = `order_${data.id}.csv`;
    hiddenElement.click();
  }, [data]);

  const getContractReport = useCallback(async () => {
    showConfirm({
      title: `После формирования договора-заявки системой не будет автоматически формироваться заявка для подрядчика. Вы уверены?`,
      onOk: async () => {
        try {
          const report = await OrderService.getContractReport(data?.id);
          const blob = new Blob([report], { type: "application/pdf" })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `Договор-заявка по рейсу №${data?.id}.pdf`
          link.click()
        } catch (e) {
          showError(e)
          console.error(e)
        }
      },
    })
  }, [data]);

  const appointOrder = useCallback(({ showSuccessMessage }) => {
    if (!showSuccessMessage) {
      setAssignModal(false);
    }
    else {
      setAssignModal(false);
      showAlert(
        {
          content: appoint ? 'Рейс принят' : 'Тс и водитель изменены',
          onCancel: () => { reloadOrder(Date.now()) },
          onOk: () => { reloadOrder(Date.now()) }
        }
      )
      return;
    }

  }, [appoint]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        const [order, responseCargoPlace, responceParkingList, employees] = await getGeneralOrderData(orderId, user, dictionaries);
        if (order?.type !== 2) {
          setCargoPlace(responseCargoPlace);
        }
        setParkingList(responceParkingList);
        setEmployees(employees);
        setResponsibleEmployees(order.responsibleEmployees ? order.responsibleEmployees.map(el => el.id) : [])
        setData(order);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        showError(e);
        console.error(e);
      }
    }
    fetchData();
  }, [reload, orderId]);

  useEffect(() => {
    if (loading === false) {
      Utils.scrollOrderToNecessaryPlace(location)
    }
  }, [loading, location])

  const finishOrder = useCallback(async () => {
    try {
      setLoading(true);
      await OrderService.executionFinish(orderId);
      reloadOrder(Date.now());
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
      reloadOrder(Date.now());
      history.push(`/orders/${orderId}/${APP === 'dispatcher' ? 'documents-producer?' : 'calculations?'}`)
    } catch (e) {
      if (e.code === 422) {
        if (data?.type === 2) {
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
  }, [orderId, data?.type])

  const executionCancel = useCallback(async (cancellationReason) => {
    try {
      setCancelModal(false);
      await OrderService.executionCancel(orderId, { cancellationReason });

      // const cancelReasonsStorage = localStorage.getItem('executionCancelReasons') ?
      //   JSON.parse(localStorage.getItem('executionCancelReasons')) : [];

      // if (APP !== 'producer' && cancellationReason &&
      //   Array.isArray(cancelReasonsStorage) &&
      //   !cancelReasonsStorage.find(el => el === cancellationReason)
      // ) {
      //   cancelReasonsStorage.push(cancellationReason);
      //   setLocalStorageItem('executionCancelReasons', JSON.stringify(cancelReasonsStorage))
      // }

      reloadOrder(Date.now());
    } catch (e) {
      showError(e)
      console.error(e);
    }
  }, [orderId])

  const appointLoaders = useCallback(async (loaders = []) => {
    try {
      const loadersIds = loaders.map(el => String(el.id));
      const brigadier = loadersIds?.[0];
      if (appoint) {
        await OrderService.appointLoaders(data?.id, { brigadier, loaders: loadersIds.filter(el => el !== brigadier) });
      }
      else {
        await OrderService.replaceLoaders({ id: data?.id, data: { brigadier, loaders: loadersIds.filter(el => el !== brigadier) } });
      }
      setAssignModal(false);
      reloadOrder(Date.now());
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [data, appoint])

  const onBindOrders = useCallback(async (selectedRows, relationType) => {
    try {
      setGroupModal(false);
      setLinkModal(false);
      await OrdersService.addRelatedOrders({ id: orderId, data: { relatedOrders: selectedRows, relationType } })
      reloadOrder(Date.now());
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
  }, [orderId])

  const [menuOptions, actions] = useMenuOptions({
    order: data,
    cancelOrder, selectionStates,
    isVisible: showMenuOptions,
    cloneOrder,
    editOrder,
    getContractReport,
    setShowRepublishModal,
    take,
    appointOrder,
    replaceTransportAndDriver: appointOrder,
    finishOrder,
    startOrder,
    setAppoint,
    setAssignModal,
    executionCancel: () => setCancelModal(true),
    exportOrderToExcel,
    user,
    bargainOfferMy: data?.bargainOfferMy,
    setGroupModal,
    setLinkModal,
    setShowMenuOptions,
    createBindLoader
  });
  const topInfo = useTopInfo({ order: data, dictionaries, docDownload, documents: data?.documents })
  const priceInfo = usePriceInfo(data, user)

  return (
    <div className={'order-view-main'}>
      {loading ? (
        <LoaderFullScreen />
      ) : null}
      <Elements.Head
        menuOptions={menuOptions}
        setProblemModal={setProblemModal}
        data={data}
        history={history}
        loading={loading}
        setShowMenuOptions={setShowMenuOptions}
        actions={actions}
        goBackRender={goBackRender}
      />
      <div className="flexbox order-view-content">
        <Elements.Left
          data={data}
          loading={loading}
          topInfo={topInfo}
          priceInfo={priceInfo}
          employees={employees}
          onSaveEmployees={onSaveEmployees}
          responsibleEmployees={responsibleEmployees}
        />
        <Elements.Right
          order={data}
          cargoPlace={cargoPlace}
          reload={() => { return reloadOrder(Date.now()) }}
          map={data?.transportOrder?.map}
          parkingList={parkingList}
          employees={employees}
        />
      </div>
      <ModalDeprecated
        options={problemOptions}
        size={'large'}
        onClose={() => setProblemModal(false)}
        content={
          <StatusesModalContentNew
            dictionaries={dictionaries}
            order={data}
            extendByMinutes={(orderId) => extendByMinutes(orderId)}
            onModalClose={(e) => { setProblemModal(false); if (e === 'accept') { reloadOrder(Date.now()) } }}
          />
        }
      />
      {
        showRepublishModal && (
          <ActionEditSharing history={history} order={data} showModal={showRepublishModal} closeModal={() => setShowRepublishModal(false)} />
        )
      }
      {assignModal && (
        data.type !== 2
          ? <AssignTransportToOrder
            closeModal={() => setAssignModal(false)}
            showModal={assignModal}
            order={data || {}}
            isAppointment={appoint}
            transports={[]}
            drivers={[]}
            showPhone={true}
            onClose={(val) => appointOrder(val)}
          />
          : <AssignLoadersToOrderNew
            showModal={assignModal}
            assignedLoaders={data?.loaders || []}
            isAppointment={appoint}
            onSelect={appointLoaders}
            onClose={() => setAssignModal(false)}
            minLoaders={data?.loadersCount}
            requiredLoaderSpecialities={data?.requiredLoaderSpecialities}
          />
      )
      }
      {
        groupModal && (
          <OrdersBindModal
            key={'group'}
            onSave={(e) => onBindOrders(e, 'grouped')}
            onCancel={() => setGroupModal(false)}
            defaultRows={data?.ownGroupedOrders}
          />
        )
      }
      {
        linkModal && (
          <OrdersBindModal
            key={'link'}
            onSave={(e) => onBindOrders(e, 'linked')}
            onCancel={() => setLinkModal(false)}
            defaultRows={data?.ownLinkedOrders}
          />
        )
      }

      {
        cancelModal && (
          <CancelModal onSave={(e) => executionCancel(e)} onCancel={() => setCancelModal(false)} />
        )
      }
    </div>
  )
}

export default OrderView;
