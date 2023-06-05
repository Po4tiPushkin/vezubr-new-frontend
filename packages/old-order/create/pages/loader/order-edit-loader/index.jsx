import React, { useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import _omit from 'lodash/omit';
import { showAlert } from '@vezubr/elements';
import * as Order from '../../../..';
import t from '@vezubr/common/localization';
import { Orders as OrderService, Orders as OrdersService } from '@vezubr/services';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import OrderEditorLoader from '../../../components/editor/order-editor-loader';
import { showEditError } from '../../../components/showEditError';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

const backUrlDefault = '/monitor/selection';
const EXCLUDE_DATA_ORDER = [];

const DISABLED_FIELDS = ['responsibleEmployees', 'client'];
const DISABLED_FIELDS_ACTIVE = [
  ...DISABLED_FIELDS,
  'startOfPeriod',
  'requiredPasses',
  'clientNumber',
  'requiredDocumentsCategories',
  'comment',
  'advancedOptions',
  'client',
  'advancedLoaders',
  'isThermograph',
  'clientRate',
  'toStartAtTime',
  'toStartAtDate',
  'contourTree',
  'clientRateVat',
  'bidStep',
  'selectingStrategy',
  'bargainsEndTime',
  'requiredLoaderSpecialities',
];

function OrderEditLoader(props, context) {
  const { match } = props;
  const history = useHistory();

  const orderId = ~~match.params.id;

  const user = useSelector((state) => state.user);
  const [processing, setProcessing] = useState(false);
  const [orderIsActive, setOrderIsActive] = useState(undefined);
  const [editMethod, setEditMethod] = useState({});

  const fetchData = useCallback(async () => {
    const orderResponseData = (await OrderService.orderDetails(orderId)) || {};
    const order = _omit(
      Order.Utils.getOrderDataStore({
        ...orderResponseData,
        ...orderResponseData.transportOrder,
        ...orderResponseData.loadersOrder,
        cargoPlaces: orderResponseData?.cargoPlaces || [],
      }),
      EXCLUDE_DATA_ORDER,
    );

    setOrderIsActive(Order.Utils.isActiveUpdater(order.orderUiState.state));

    if (order.requestId && !Order.Utils.isActiveUpdater(order.orderUiState.state)) {
      await OrdersService.getLoadersOrderEditingData(order.requestId);
    }
    if (APP === 'dispatcher') {
      order.client = order?.performers?.[0]?.client?.id;
    } else {
      order.requiredProducers = order.requiredProducerIds;
    }
    order.toStartAtDate = moment(order.startAtLocal).format('YYYY-MM-DD');
    order.toStartAtTime = moment(order.startAtLocal).format('HH:mm');
    if (Order.Utils.isActiveUpdater(order.orderUiState.state)) {
      order.addresses[0].disabled = true;
    }
    return {
      ...order,
      responsibleEmployees: orderResponseData?.responsibleEmployees
        ? orderResponseData?.responsibleEmployees.map((el) => el.id)
        : [],
    };
  }, [orderId]);

  const [orderData, loading] = useCancelableLoadData(fetchData);

  const onPublish = useCallback(async (store) => {
    const { values } = store.getValidateData();

    const reqData = Order.Utils.getOrderDataSave(values);

    if (typeof reqData.address?.contacts === 'string') {
      reqData.address.contacts = [reqData.address.contacts];
    }

    delete reqData.id;

    reqData.parametersForProducers = reqData.selectedTariffs.map((el) => {
      const values = el.split(':');
      return {
        producer: values[0],
        tariff: values[1],
        contract: values[2],
      };
    });
    if (APP === 'client') {
      if (reqData.selectedTariffs.length) {
        reqData.requiredProducers = [
          ...reqData.requiredProducers,
          ...reqData.selectedTariffs.map((el) => +el.split(':')[0]),
        ];
        reqData.requiredProducers = reqData.requiredProducers.filter(function (item, pos) {
          return reqData.requiredProducers.indexOf(item) == pos;
        });
      }
    }
    if (APP === 'dispatcher') {
      if (store.data.autoRepublish) {
        const expeditorManualSharing = {
          appoints:
            reqData.publishingType === 'rate' || reqData.publishingType === 'bargain'
              ? reqData?.requiredProducers.map((item) => ({
                producer: item,
                rate: reqData.clientRateProducers || reqData.clientRate,
              }))
              : reqData?.selectedTariffs
                ?.filter((item) => !item.startsWith(user?.id))
                .map((el) => {
                  const values = el.split(':');
                  return {
                    producer: values[0],
                    tariff: values[1],
                    contract: values[2],
                  };
                }),
          strategyType: reqData.publishingType,
        };
        reqData.expeditorManualSharing = expeditorManualSharing;
      }
      reqData.requiredProducers = [user?.id];
    }

    reqData.customProperties = reqData.customProperties.map((el) => ({
      latinName: el.customProperty?.latinName || el.latinName,
      values: el.customProperty?.type === 'array' ? el.values.map((item) => item.value) : el.values,
    }));

    delete reqData.selectedTariffs;

    setProcessing(true);

    try {
      await OrdersService.editLoadersOrder(reqData);
      await OrdersService.publishDeferred({ request: String(reqData.requestId) });
      showAlert({
        content: t.common('Рейс успешно отредактирован'),
        title: undefined,
        onOk: () => {
          history.replace(backUrlDefault);
        },
      });
    } catch (e) {
      console.error(e);
      showEditError(e);
    }

    setProcessing(false);
  });

  const onActiveSave = useCallback(
    async (store) => {
      const { values } = store.getValidateData();
      const data = {
        ...values,
      };
      const orderId = data.id;
      const reqData = Order.Utils.getActiveOrderDataSave(data);
      setProcessing(true);

      try {
        await OrdersService.editTransportOrderActive(orderId, reqData);
        showAlert({
          content: t.common('Рейс успешно отредактирован'),
          title: undefined,
          onOk: () => {
            history.replace(backUrlDefault);
          },
        });
      } catch (e) {
        console.error(e);
        showEditError(e);
      }

      setProcessing(false);
    },
    [orderIsActive, history],
  );

  const onCancel = useCallback(async () => {
    history.replace(`/orders/${orderId}/map`);
  }, [history, orderId]);

  const title = useMemo(() => `Редактирование рейса ${orderData?.orderNr} (${orderData?.requestNr})`, [orderData]);

  useEffect(() => {
    switch (orderData?.strategyType) {
      case 'tariff': {
        setEditMethod({
          onTariff: orderIsActive ? onActiveSave : onPublish,
        });
        break;
      }
      case 'rate': {
        setEditMethod({
          onRate: orderIsActive ? onActiveSave : onPublish,
        });
        break;
      }
      case 'bargain': {
        setEditMethod({
          onBargain: orderIsActive ? onActiveSave : onPublish,
        });
        break;
      }
      default: {
        break;
      }
    }
  }, [orderData]);

  return (
    <OrderEditorLoader
      title={title}
      history={history}
      {...editMethod}
      disabledFields={orderIsActive ? DISABLED_FIELDS_ACTIVE : DISABLED_FIELDS}
      orderIsActive={orderIsActive}
      onPublish={onPublish}
      loading={loading}
      saving={processing}
      lazyData={orderData}
      onCancel={onCancel}
      saveButtonText={'Сохранить заказ'}
    />
  );
}

export default OrderEditLoader;
