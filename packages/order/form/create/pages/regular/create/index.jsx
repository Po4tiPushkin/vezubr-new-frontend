import { showAlert, showError, showConfirm, Modal, Ant } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import * as Order from '../../../..';
import {
  CargoPlace as CargoPlaceService,
  Orders as OrdersService,
  Contractor as ContractorService,
  Producers as ProducersService
} from '@vezubr/services';
import _omit from 'lodash/omit';
import _uniqBy from 'lodash/uniqBy';
import _uniq from 'lodash/uniq';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import { connect } from "react-redux";
import moment from 'moment';
import { getAllCargoPlace } from "../../../utils";
import OrderEditor from '../../../components/editor/order-editor';
import useDataLocalStorage from '../../../hooks/useDataLocalStorage';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux'
const backUrlDefault = '/regular-orders';
const STORAGE_KEY = 'order-regular__v1';

const EXCLUDE_DATA_ORDER = ['requiredContours', 'requiredProducers'];

function RegularOrderCreate(props) {
  const { match, user } = props;
  const history = useHistory();
  const orderId = match.params.id;

  const [paused, setPaused] = React.useState(false)

  const [saving, setSaving] = React.useState(false);
  const [processing, setProcessing] = React.useState(false)
  const [arriveAt, setArriveAt] = useState(null);
  const [arriveAtState, setArriveAtState] = useState(null);

  const customProperties = useSelector(state => state.customProperties);
  const [orderStorage, removeFromStorage, saveIntoStorage] = useDataLocalStorage(STORAGE_KEY, EXCLUDE_DATA_ORDER);
  const [orderType, setOrderType] = React.useState(1)

  const fetchData = useCallback(async () => {

    const cargoPlaces = (await getAllCargoPlace()) || [];

    const cargoPlacesAll = _uniqBy([
      ...cargoPlaces,
    ], 'id')

    return {
      regular: true,
      cargoPlacesAll
    }

  }, [orderId]);

  const [orderData, loading] = useCancelableLoadData(fetchData);
  const title = 'Создание шаблона рейса';

  const onCancel = React.useCallback(async () => {
    removeFromStorage();
    history.replace(backUrlDefault);
  }, [history]);

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
  }, [arriveAtState]);

  const onPublish = React.useCallback(async (store) => {
    const { values } = store.getValidateData();
    const { startOfPeriod, endOfPeriod, unit, amount, title, offset, ...orderData } = Order.Utils.getOrderDataSave(values)
    orderData.addresses = orderData.addresses.map((address) => {
      if (typeof address.contacts === 'string') {
        address.contacts = [address.contacts];
      }

      address.attachedFiles?.map(el => {
        el.name = el.fileName || el.fileNameOrigin || el.fileData?.originalName;
        el.fileId = String(el.fileId);
        return el;
      })

      return address;
    });

    if (APP === 'client') {

      if (orderData.selectingStrategy !== 2 && orderData.selectingStrategy !== 3) {
        delete orderData.bargainsEndDatetime;
        delete orderData.bidStep;
        if (orderData.clientRate === null) delete orderData.clientRate;
      }
      if (orderData.selectedTariffs.length) {
        orderData.requiredProducers = [...orderData.requiredProducers, ...orderData.selectedTariffs.map(el => +el.split(':')[0])]
        orderData.requiredProducers = orderData.requiredProducers.filter(function (item, pos) {
          return orderData.requiredProducers.indexOf(item) == pos;
        });
      }
      orderData.parametersForProducers = orderData.selectedTariffs.map(el => {
        const values = el.split(':')
        return {
          producer: values[0],
          tariff: values[1],
          contract: values[2],
        }
      });
    }

    if (APP === 'dispatcher') {
      const expeditorManualSharing = {
        appoints:
          orderData.publishingType == 'rate'
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

      if (orderData?.autoRepublish) {
        orderData.expeditorManualSharing = expeditorManualSharing
      }

      orderData.requiredProducers?.push(user.id);

      orderData.parametersForProducers = orderData?.selectedTariffs
        .map((el) => {
          const values = el.split(':');
          return {
            producer: values[0],
            tariff: values[1],
            contract: values[2],
          };
        });
    }

    const contractAttributeCustomProperty = orderData?.customProperties?.find((item) => item.latinName == 'contract_attribute')

    orderData.additionalData = {
      ignoreEmptyNumeratorVars: true,
      numeratorVars: contractAttributeCustomProperty ? [{
        title: 'contract_attribute',
        value: customProperties?.find(item => item.latinName == 'contract_attribute')?.possibleValues?.find(item => item.id == contractAttributeCustomProperty?.values?.[0])?.title
      }] : []
    }

    delete orderData.selectedTariffs;

    setSaving(true);

    const reqData = {
      startOfPeriod,
      endOfPeriod,
      title,
      frequency: {
        unit,
        amount,
        offset
      },
      orderData
    }

    try {
      await OrdersService.createRegularOrder(reqData);
      showAlert({
        content: t.common(`Регулярный рейс был успешно создан`),
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
  });

  const order =
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
      onRate={onPublish}
      onTariff={onPublish}
      arriveAt={arriveAt}
    />




  return (
    <>
      {order}
    </>
  )
}
const mapStateToProps = (state, ownProps) => {
  let { user } = state;
  return {
    user,
  };
};

export default connect(mapStateToProps)(RegularOrderCreate);

