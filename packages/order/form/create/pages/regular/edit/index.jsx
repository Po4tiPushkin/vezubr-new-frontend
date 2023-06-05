import { showAlert, showError, showConfirm, Ant } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import * as Order from '../../../..';
import {
  CargoPlace as CargoPlaceService,
  Orders as OrdersService,
  Contractor as ContractorService,
  Producers as ProducersService
} from '@vezubr/services';
import _uniqBy from 'lodash/uniqBy';
import React, { useCallback, useMemo, useState } from 'react';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import { connect } from 'react-redux';
import { getAllCargoPlace } from '../../../utils';
import OrderEditor from '../../../components/editor/order-editor';
import useDataLocalStorage from '../../../hooks/useDataLocalStorage';
import { useHistory } from 'react-router-dom';
const backUrlDefault = '/regular-orders';
const STORAGE_KEY = 'order-regular__v1';

const EXCLUDE_DATA_ORDER = ['requiredContours', 'requiredProducers', 'type'];

const DISABLED_FIELDS = [
  'startOfPeriod',
  'vehicleType',
  'bodyTypes',
  'addresses',
  'cargoPlaces',
  'requiredPasses',
  'orderIdentifier',
  'requiredDocumentsCategories',
  'comment',
  'advancedOptions',
  'client',
  'advancedLoaders',
  'isThermograph',
  'vehicleTemperatureMin',
  'vehicleTemperatureMax',
  'clientRate',
  'clientRateProducers',
  'responsibleEmployees',
  'orderCategory',
  'customProperties'
];

function RegularOrderEdit(props) {
  const { match, user } = props;
  const history = useHistory();

  const orderId = match.params.id;

  const [paused, setPaused] = React.useState(false);

  const [saving, setSaving] = React.useState(false);

  const [arriveAt, setArriveAt] = useState(null);
  const [arriveAtState, setArriveAtState] = useState(null);

  const [orderStorage, removeFromStorage, saveIntoStorage] = useDataLocalStorage(STORAGE_KEY, EXCLUDE_DATA_ORDER);
  const [orderType, setOrderType] = React.useState(1);

  const fetchData = useCallback(async () => {
    let regOrderData = {};

    const {
      frequency,
      orderData: order,
      paused: isPaused,
      ...otherFields
    } = await OrdersService.regularOrderDetails(orderId);
    regOrderData = {
      ...otherFields,
      ...frequency,
      ...order,
      vehicleType: order.vehicleTypeId,
      assessedCargoValue: order.assessedCargoValue ? order.assessedCargoValue : undefined,
      autoRepublish: !!order.expeditorManualSharing?.appoints,
      clientRateProducers: order.expeditorManualSharing?.appoints ? order.expeditorManualSharing?.appoints[0]?.rate : null,
      selectedTariffs: order?.selectedTariffs?.map(v => `${v.producer}:${v.tariff}:${v.contract}`),
      requiredProducers: order?.requiredProducerIds?.filter(function (item, pos) {
        return order?.requiredProducerIds?.indexOf(item) == pos;
      })
    };

    if (APP === 'dispatcher') {
      if (order.expeditorManualSharing?.strategyType === "rate") {
        regOrderData.requiredProducers = order.expeditorManualSharing?.appoints?.map(
          (item) => item.producer
        )
      } else if (order.expeditorManualSharing?.strategyType === "tariff") {
        regOrderData.parametersForProducers = [
          ...regOrderData.parametersForProducers,
          ...order.expeditorManualSharing?.appoints?.map(
            (item) => `${item.producer}:${item.tariff}:${item.contract}`
          )
        ]
      }
      regOrderData.client = order?.clientId
    }

    setOrderType(regOrderData.orderType);
    setPaused(isPaused);


    const cargoPlaces = (await getAllCargoPlace()) || [];

    const cargoPlacesAll = _uniqBy([...cargoPlaces], 'id');

    return {
      type: regOrderData ? regOrderData.orderType : orderType,
      currentUser: user?.id,
      regular: true,
      cargoPlacesAll,
      ...regOrderData,
    };
  }, [orderId, orderType, user.id]);

  const [orderData, loading] = useCancelableLoadData(fetchData);
  const title = useMemo(
    () =>
      'Редактирование' +
      ` шаблона${' №' + orderId}` +
      ` (${orderType === 1 ? 'Городской рейс' : 'Междугородний рейс'})`,
    [orderId, orderType],
  );

  const onCancel = React.useCallback(async () => {
    removeFromStorage();
    history.replace(backUrlDefault);
  }, [history, removeFromStorage]);

  const fetchArriveAt = useCallback(async (values) => {
    try {
      const data = {
        startOfPeriod: values.startOfPeriod,
        endOfPeriod: values.endOfPeriod,
        frequency: {
          unit: values.unit,
          amount: values.amount,
          offset: values.offset
        },
        toStartAtTime: values.toStartAtTime,
        timeZone: values.addresses[0]?.timeZoneId
      }
      const response = await OrdersService.arriveAt(data);
      setArriveAtState(values);
      setArriveAt(response.arriveAt);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const onChange = React.useCallback(async (data, store) => {
    try {
      saveIntoStorage(store.getDirtyData());
      const validated = Order.Utils.validateRegularOrderArriveAt(data, arriveAtState);
      if (validated) {
        await fetchArriveAt(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, [saveIntoStorage, arriveAtState]);

  const onPublish = React.useCallback(async (store) => {
    const { values } = store.getValidateData();
    const { endOfPeriod, unit, amount, toStartAtTime, offset, title, ...orderData } =
      Order.Utils.getOrderDataSave(values);

    if (APP === 'client') {
      if (orderData?.selectedTariffs?.length) {
        orderData.requiredProducers = [...orderData.requiredProducers, ...orderData.selectedTariffs.map(el => +el.split(':')[0])]
      }
      orderData.requiredProducers = orderData.requiredProducers.filter(function (item, pos) {
        return orderData.requiredProducers.indexOf(item) == pos;
      });
    }
    let expeditorManualSharing = {}
    if (APP === 'dispatcher') {
      expeditorManualSharing = {
        appoints:
          orderData.publishingType === 'rate'
            ? orderData?.requiredProducers.map((item) => ({
              producer: item,
              rate: orderData.clientRateProducers,
            }))
            : orderData?.selectedTariffs
              ?.filter((item) => !item.startsWith(user?.id))
              .map((el) => {
                const values = el.split(':');
                return {
                  producer: values[0],
                  tariff: values[1],
                  contract: values[2],
                };
              }),
        strategyType: orderData.publishingType,
      };
      if (orderData.clientRate === null) delete orderData.clientRate;

      orderData.requiredProducers?.push(user.id);
    }

    setSaving(true);

    orderData.parametersForProducers = orderData?.selectedTariffs?.map(el => {
      const values = el.split(':')
      return {
        producer: values[0],
        tariff: values[1],
        contract: values[2],
      }
    });

    const reqData = {
      toStartAtTime,
      endOfPeriod,
      title,
      requiredProducers: orderData.requiredProducers,
      parametersForProducers: orderData.parametersForProducers,
      frequency: {
        unit,
        amount,
        offset,
      }
    };

    if (orderData?.autoRepublish && APP === 'dispatcher') {
      reqData.expeditorManualSharing = expeditorManualSharing
    }


    try {
      await OrdersService.editRegularOrder(orderId, reqData);

      showAlert({
        content: t.common(`Регулярный рейс был успешно изменен`),
        title: undefined,
        onOk: () => {
          history.replace(backUrlDefault);
        },
      });

      removeFromStorage();
    } catch (e) {
      console.error(e);
      store.setData({
        contourTree: [],
      });
      showError(e);
    }

    setSaving(false);
  }, [orderId, removeFromStorage]);

  const onDelete = React.useCallback(async () => {
    showConfirm({
      title: `Вы уверены что хотите удалить регулярный рейс №${orderId}`,
      onOk: async () => {
        try {
          OrdersService.deleteRegularOrder(orderId);
          showAlert({
            content: t.common('Регулярный рейс был успешно удалён'),
            title: undefined,
            onOk: () => {
              history.replace(backUrlDefault);
            },
          });
        } catch (e) {
          console.error(e);
          showError(e);
        }
      },
    });
  }, [orderId, history]);

  const onPause = React.useCallback(async () => {
    showConfirm({
      title: `Вы уверены что хотите ${paused ? 'возобновить' : 'приостановить'} регулярный рейс №${orderId}`,
      onOk: async () => {
        try {
          OrdersService.togglePauseRegularOrder(orderId, { paused: !paused });
          setPaused(!paused);
          showAlert({
            content: t.common(`Регулярный рейс был успешно ${paused ? 'возобновлен' : 'приостановлен'}`),
            title: undefined,
            onOk: () => {
              history.replace(backUrlDefault);
            },
          });
        } catch (e) {
          console.error(e);
          showError(e);
        }
      },
    });
  }, [orderId, paused, history]);

  const additionalButtons = React.useMemo(() => {
    return (
      <div className="order-additional-btns">
        <Ant.Button type={paused ? 'primary' : 'default'} className={'margin-right-15'} onClick={onPause}>
          {paused ? 'Возобновить' : 'Приостановить'}
        </Ant.Button>
        <Ant.Button type="default" onClick={onDelete}>
          Удалить
        </Ant.Button>
      </div>
    );
  }, [paused, onDelete, onPause]);

  const strategyTypes = React.useMemo(() => {
    if (orderData?.publishingType == 'rate') {
      return {
        onRate: onPublish
      }
    } else {
      return {
        onTariff: onPublish
      }
    }
  }, [orderData])

  const order = (
    <OrderEditor
      history={history}
      loading={loading}
      saving={saving}
      lazyData={orderData}
      onCancel={onCancel}
      onChange={onChange}
      title={title}
      republishing={false}
      regular={true}
      {...strategyTypes}
      disabledFields={DISABLED_FIELDS}
      additional={additionalButtons}
      arriveAt={arriveAt}
      orderType={orderType === 1 ? 'city' : 'intercity'}
    />
  );
  return (
    <>
      {order}
    </>
  );
}

const mapStateToProps = (state) => {
  let { user } = state;
  return {
    user,
  };
};
export default connect(mapStateToProps)(RegularOrderEdit);
