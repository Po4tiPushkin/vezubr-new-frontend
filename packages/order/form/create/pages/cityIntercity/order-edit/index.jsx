import { showAlert } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import * as Utils from '../../../../utils';
import {
  CargoPlace as CargoPlaceService,
  Orders as OrderService,
  Orders as OrdersService,
  Contractor as ContractorService
} from '@vezubr/services';
import _omit from 'lodash/omit';
import _uniqBy from 'lodash/uniqBy';
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import OrderEditor from '../../../components/editor/order-editor';
import { showEditError } from '../../../components/showEditError';
import { connect } from "react-redux";
import { getAllCargoPlace } from "../../../utils";
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
const backUrlDefault = '/requests/active';
const EXCLUDE_DATA_ORDER = [];
const DISABLED_FIELDS = [
  'responsibleEmployees',
  'client',
];
const DISABLED_FIELDS_ACTIVE = [
  ...DISABLED_FIELDS,
  'startOfPeriod',
  'vehicleType',
  'bodyTypes',
  'requiredPasses',
  'clientNumber',
  'requiredDocumentsCategories',
  'comment',
  'advancedOptions',
  'client',
  'advancedLoaders',
  'isThermograph',
  'vehicleTemperatureMin',
  'vehicleTemperatureMax',
  'clientRate',
  'toStartAtTime',
  'toStartAtDate',
  'contourTree',
  'clientRateVat',
  'bidStep',
  'selectingStrategy',
  'bargainsEndTime',
  'orderCategory',
]

function OrderEdit(props) {
  const { observer, match } = props;
  const history = useHistory();
  const { location } = history;
  const orderType = useMemo(() => location.pathname.split('/')[3], [location]);
  const orderId = ~~match.params.id;
  const dictionaries = useSelector(state => state.dictionaries);
  const user = useSelector(state => state.user);
  const userSettings = useSelector(state => state.userSettings);
  const [saving, setSaving] = useState(false);
  const [orderIsActive, setOrderIsActive] = useState(undefined);
  const [editMethod, setEditMethod] = useState({});

  const fetchData = useCallback(async () => {

    const orderResponseData = (await OrderService.orderDetails(orderId)) || {};
    const order = _omit(Utils.getOrderDataStore({
      ...orderResponseData,
      ...orderResponseData.transportOrder,
    }), EXCLUDE_DATA_ORDER)

    setOrderIsActive(Utils.isActiveUpdater(order.orderUiState.state, order?.performers?.[0]?.isTaken))

    if (order.requestId && !Utils.isActiveUpdater(order.orderUiState.state, order?.performers?.[0]?.isTaken)) {
      await OrdersService.getTransportOrderEditingData(order.requestId);
    }
    const cargoPlaces = (await getAllCargoPlace()) || [];
    const cargoPlacesOrder = (await CargoPlaceService.orderView(orderId)) || [];

    const cargoPlacesAll = _uniqBy([
      ...cargoPlacesOrder,
      ...cargoPlaces,
    ], 'id')

    order.toStartAtDate = moment(order.startAtLocal).format('YYYY-MM-DD')
    order.toStartAtTime = moment(order.startAtLocal).format('HH:mm')
    order.bodyTypes = Object.values(order?.requiredBodyTypes);
    order.client = order?.performers?.[0]?.client?.id;
    order.vehicleType = order.requiredVehicleTypeId
    order.orderCategory = dictionaries?.vehicleTypes?.find((item) => item.id == order.vehicleType)?.category
    if (APP !== 'dispatcher') {
      order.requiredProducers = order.requiredProducerIds
    }
    if (Utils.isActiveUpdater(order.orderUiState.state, order?.performers?.[0]?.isTaken)) {
      order.addresses[0].disabled = true;
    }
    order.insurance = order.performers?.[0]?.isInsuranceRequired

    return {
      ...((orderType === 'city' ? userSettings?.order?.city : userSettings?.order?.intercity) || {}),
      ...order,
      cargoPlacesAll,
      responsibleEmployees: orderResponseData?.responsibleEmployees ? orderResponseData?.responsibleEmployees.map(el => el.id) : []
    }

  }, [orderId]);

  const [orderData, loading] = useCancelableLoadData(fetchData);

  const onPublish = useCallback(async (store) => {
    const { values } = store.getValidateData();

    const data = {
      ...values,
    };

    const reqData = Utils.getOrderDataSave(data);
    reqData.addresses = reqData.addresses.map((address) => {
      if (typeof address.contacts === 'string') {
        address.contacts = [address.contacts];
      }

      return address;
    });
    delete reqData.id;

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

    if (APP === 'client') {
      if (reqData.selectedTariffs.length) {
        reqData.requiredProducers = [...reqData.requiredProducers, ...reqData.selectedTariffs.map(el => +el.split(':')[0])]
        reqData.requiredProducers = reqData.requiredProducers.filter(function (item, pos) {
          return reqData.requiredProducers.indexOf(item) == pos;
        });
      }
    }

    reqData.parametersForProducers = reqData.selectedTariffs.map(el => {
      const values = el.split(':')
      return {
        producer: values[0],
        tariff: values[1],
        contract: values[2],
      }
    });

    reqData.customProperties = reqData.customProperties.map(el => (
      {
        latinName: el.customProperty?.latinName || el.latinName,
        values: el.customProperty?.type === 'array' ? el.values.map(item => item.value) : el.values
      }
    ))

    delete reqData.selectedTariffs;

    setSaving(true);

    try {
      await OrdersService.editTransportOrder(reqData);
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

    setSaving(false);
  }, [history]);

  const onActiveSave = useCallback(async (store) => {
    const { values } = store.getValidateData();
    const data = {
      ...values
    };
    const orderId = data.id;
    const reqData = Utils.getActiveOrderDataSave(data);
    setSaving(true);

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

    setSaving(false);
  }, [orderIsActive, history])

  const onCancel = useCallback(async () => {
    history.replace(`/orders/${orderId}/map`);
  }, [history, orderId, orderType]);

  const title = useMemo(() => `Редактирование рейса ${orderData?.orderNr} (${orderData?.requestNr})`, [orderData]);

  useEffect(() => {
    switch (orderData?.strategyType) {
      case 'tariff': {
        setEditMethod({
          onTariff: orderIsActive ? onActiveSave : onPublish
        })
        break;
      }
      case 'rate': {
        setEditMethod({
          onRate: orderIsActive ? onActiveSave : onPublish
        })
        break;
      }
      case 'bargain': {
        setEditMethod({
          onBargain: orderIsActive ? onActiveSave : onPublish
        })
        break;
      }
      default: {
        break;
      }
    }
  }, [orderData])

  return (
    <OrderEditor
      observer={observer}
      history={history}
      loading={loading}
      saving={saving}
      lazyData={orderData}
      onCancel={onCancel}
      title={title}
      disabledFields={orderIsActive ? DISABLED_FIELDS_ACTIVE : DISABLED_FIELDS}
      saveButtonText={'Сохранить рейс'}
      orderIsActive={orderIsActive}
      onActiveSave={onActiveSave}
      orderType={orderType}
      edit={true}
      {...editMethod}
    />
  );
}

export default OrderEdit;
