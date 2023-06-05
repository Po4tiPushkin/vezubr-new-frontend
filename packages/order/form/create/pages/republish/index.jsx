import { showAlert, showError } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import * as Order from '../../..';
import {
  CargoPlace as CargoPlaceService,
  Orders as OrderService,
  Contractor as ContractorService,
  Producers as ProducersService
} from '@vezubr/services';
import _omit from 'lodash/omit';
import _uniqBy from 'lodash/uniqBy';
import _uniq from 'lodash/uniq';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import { connect, useSelector } from "react-redux";
import { getAllCargoPlace } from "../../utils";
import moment from 'moment';
import OrderEditor from '../../components/editor/order-editor';
import useDataLocalStorage from '../../hooks/useDataLocalStorage';
import OrderEditorLoader from '../../components/editor/order-editor-loader';
import { useHistory } from 'react-router-dom';
const backUrlDefault = '/requests/active';
const STORAGE_KEY = 'order-republish__v1';

const EXCLUDE_DATA_ORDER = ['requiredContours', 'requiredProducers'];

const DISABLED_FIELDS = [
  'toStartAtDate',
  'toStartAtTime',
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
  'loadersCount',
  'orderCategory',
  'customProperties',
  'requiredLoaderSpecialities'
]

function OrderRepublish(props) {
  const { match, user } = props;
  const history = useHistory();
  const orderId = ~~match.params.id;

  const [saving, setSaving] = React.useState(false);
  const [processing, setProcessing] = React.useState(false)
  const dictionaries = useSelector((state) => state.dictionaries)
  const [orderStorage, removeFromStorage, saveIntoStorage] = useDataLocalStorage(STORAGE_KEY, EXCLUDE_DATA_ORDER);

  const fetchData = useCallback(async () => {

    const orderResponseData = (await OrderService.orderDetails(orderId)) || {};
    const preliminaryRateResponse = await OrderService.preliminaryRate(orderId);
    let insuranceAmount = null;
    try {
      const response = await OrderService.insuranceAmount(orderId);
      insuranceAmount = response.insuranceAmount;
    } catch (e) {
      console.error(e);
    }
    const preliminaryRate = preliminaryRateResponse.preliminaryRate;
    const order = _omit(Order.Utils.getOrderDataStore({
      ...orderResponseData,
      ...orderResponseData.transportOrder,
      ...orderResponseData.loadersOrder,
      cargoPlaces: orderResponseData?.cargoPlaces || []
    }), EXCLUDE_DATA_ORDER)

    let cargoPlacesAll = []
    if (order.type !== 2) {
      const cargoPlaces = (await getAllCargoPlace()) || [];
      const cargoPlacesOrder = (await CargoPlaceService.orderView(orderId)) || [];
      cargoPlacesAll = _uniqBy([
        ...cargoPlacesOrder,
        ...cargoPlaces,
      ], 'id')
      order.bodyTypes = Object.values(order?.requiredBodyTypes);
      order.vehicleType = order.requiredVehicleTypeId
    }

    order.clientRatePlaceholder = order.performers[0]?.preliminaryCalculation?.cost || order.clientRate
    order.clientRate = null


    order.client = order?.performers?.[0]?.client?.id;
    order.toStartAtDate = moment(order.startAtLocal).format('YYYY-MM-DD')
    order.toStartAtTime = new Date(order.startAtLocal).toTimeString()
    order.responsibleEmployees = order.responsibleEmployees.map(item => item.id)
    order.orderCategory = dictionaries?.vehicleTypes?.find((item) => item.id == order.vehicleType)?.category
    order.insurance = order.performers?.[0]?.isInsuranceRequired;
    order.isClientInsurance = order.performers?.[0]?.isInsuranceRequired;
    return {
      ...order,
      preliminaryRate,
      cargoPlacesAll,
      insuranceAmount
    }

  }, [orderId]);

  const [orderData, loading] = useCancelableLoadData(fetchData);

  const onRate = useCallback(async (store) => {
    const { values } = store.getValidateData();
    const reqData = {
      appoints: values.requiredProducers.map(el => {
        return {
          producer: el,
          rate: values.clientRate
        }
      }),
      responsibleEmployees: values.responsibleEmployees || [],
      strategyType: 'rate',
    }

    if (!values.isClientInsurance) {
      reqData.isInsuranceRequired = values.isInsuranceRequired

      if (values.assessedCargoValue) {
        reqData.assessedCargoValue = values.assessedCargoValue
      }

      if (values.cargoCategoryId) {
        reqData.cargoCategoryId = values.cargoCategoryId
      }
    }

    setProcessing(true);

    try {
      const { message } = await OrderService.createManualSharing({ orderId, reqData });
      showAlert({
        content: message ? message : t.common('Рейс был успешно перепубликован'),
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
        clientRate: undefined,
      });
      showError(e);
    }

    setProcessing(false);
  }, [history]);

  const onBargain = useCallback(async (store) => {
    const { values } = store.getValidateData();
    const reqData = {
      appoints: values.requiredProducers.map(el => {
        return {
          producer: el,
          rate: values.clientRate
        }
      }),
      responsibleEmployees: values.responsibleEmployees || [],
      strategyType: 'bargain',
      bargainType: values.selectingStrategy == 2 ? "open" : "closed",
      bargainBidStep: values.bidStep,
      bargainEndAt: values.bargainsEndDatetime,
    }

    if (!values.isClientInsurance) {
      reqData.isInsuranceRequired = values.isInsuranceRequired

      if (values.assessedCargoValue) {
        reqData.assessedCargoValue = values.assessedCargoValue
      }

      if (values.cargoCategoryId || values.cargoCategoryId === 0) {
        reqData.cargoCategoryId = values.cargoCategoryId
      }
    }

    setProcessing(true);

    try {
      await OrderService.createManualSharing({ orderId, reqData });
      showAlert({
        content: t.common('Рейс был успешно перепубликован'),
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

    setProcessing(false);
  }, [history]);

  const onTariff = useCallback(async (store) => {
    const { values } = store.getValidateData();
    // const tariffs = _uniq(values.selectedTariffs.map(value => value.split(':')[1]));
    // const data = tariffs.map(el => {
    //   const producers = values.selectedTariffs.filter(item => item.split(':')[1] === el);
    //   return {
    //     tariffId: +el,
    //     producerIds: producers.map(item => +item.split(':')[0])
    //   }
    // })
    const tarrifs = values.selectedTariffs.map(el => {
      const values = el.split(':')
      return {
        producer: +values[0],
        tariff: +values[1],
        contract: +values[2],
      }
    });
    const reqData = {
      appoints: tarrifs,
      responsibleEmployees: values.responsibleEmployees || [],
      strategyType: 'tariff',
    }

    if (!values.isClientInsurance) {
      reqData.isInsuranceRequired = values.isInsuranceRequired

      if (values.assessedCargoValue) {
        reqData.assessedCargoValue = values.assessedCargoValue
      }

      if (values.cargoCategoryId || values.cargoCategoryId === 0) {
        reqData.cargoCategoryId = values.cargoCategoryId
      }
    }

    setProcessing(true);

    try {
      const { message } = await OrderService.createManualSharing({ orderId, reqData });
      showAlert({
        content: message ? message : t.common('Рейс был успешно перепубликован'),
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
        clientRate: undefined,
      });
      showError(e);
    }

    setProcessing(false);
  }, [history]);

  const title = useMemo(() => `Перепубликация рейса ${orderData?.orderNr || ''} ${orderData ? '(' + orderData?.requestNr + ')' : ''}`, [orderData]);

  const onCancel = React.useCallback(async () => {
    removeFromStorage();
    history.replace(backUrlDefault);
  }, [history]);

  const onChange = React.useCallback(async (data, store) => {
    try {
      saveIntoStorage(store.getDirtyData());
    } catch (e) {
      console.error(e);
    }
  }, []);

  const order = useMemo(() => {
    switch (orderData?.type) {
      case 1:
      case 3:
        return (
          <OrderEditor
            history={history}
            onBargain={onBargain}
            onTariff={onTariff}
            onRate={onRate}
            loading={loading}
            saving={saving}
            lazyData={orderData}
            onCancel={onCancel}
            onChange={onChange}
            title={title}
            republishing={true}
            orderType={orderData?.type === 1 ? 'city' : 'intercity'}
            disabledFields={DISABLED_FIELDS}
          />
        );
      default:
        return (
          <OrderEditorLoader
            title={title}
            history={history}
            loading={loading}
            onBargain={onBargain}
            onTariff={onTariff}
            onRate={onRate}
            saving={saving}
            lazyData={orderData}
            disabledFields={DISABLED_FIELDS}
            onCancel={onCancel}
            onChange={onChange}
            republishing={true}
          />
        );
    }
  }, [orderData, loading]);

  return order
}

const mapStateToProps = (state, ownProps) => {
  let { user } = state;
  return {
    user,
  };
};
export default connect(mapStateToProps)(OrderRepublish);

