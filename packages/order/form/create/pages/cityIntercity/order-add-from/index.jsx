import React, { useCallback, useMemo } from 'react';
import _omit from 'lodash/omit';
import { showAlert, showError } from '@vezubr/elements';
import * as Utils from '../../../../utils';
import t from '@vezubr/common/localization';
import {
  CargoPlace as CargoPlaceService,
  Orders as OrderService,
  Orders as OrdersService,
  Contractor as ContractorService,
  Producers as ProducersService,
} from '@vezubr/services';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import OrderEditor from '../../../components/editor/order-editor';

import { connect, useSelector } from "react-redux";
import { getAllCargoPlace } from "../../../utils";
import { useHistory } from 'react-router-dom';
const backUrlDefault = '/requests/active';

const EXCLUDE_DATA_ORDER = [
  'requiredContours',
  'requiredProducers',
  'toStartAtDate',
  'toStartAtTime',
  'cargoPlaces',
  'requiredPassesDetectionMode',
  'status',
];


function clearAddress(order) {
  const addresses = order.addresses.map((address) => {
    address.requiredArriveAt = null;
    address.canChangePosition = true;
    address.skipped = false;
    address.leavedAt = null;
    address.completedAt = null;
    address.arrivedAt = null;

    return address;
  });


  return { ...order, addresses };
}

function OrderAddFrom(props) {
  const { observer, match } = props;
  const history = useHistory();
  const { location } = history;
  const orderType = useMemo(() => location.pathname.split('/')[4], [location]);
  const orderId = ~~match.params.id;
  const dictionaries = useSelector(state => state.dictionaries);
  const user = useSelector((state) => state.user)
  const customProperties = useSelector(state => state.customProperties);
  const userSettings = useSelector((state) => state.userSettings)
  const [saving, setSaving] = React.useState(false);

  const fetchData = useCallback(async () => {
    const orderResponseData = (await OrderService.orderDetails(orderId)) || {};
    const order = clearAddress(_omit(Utils.getOrderDataStore({
      ...orderResponseData,
      ...orderResponseData.transportOrder,
      cargoPlaces: orderResponseData?.cargoPlaces || []

    }), EXCLUDE_DATA_ORDER))
    const cargoPlacesAll = (await getAllCargoPlace()) || [];

    order.bodyTypes = Object.values(order?.requiredBodyTypes);
    order.client = order?.performers.find(el => el.client.id !== user.id)?.client?.id;
    order.responsibleEmployees = order.responsibleEmployees.map(item => item.id)
    order.vehicleType = order.requiredVehicleTypeId
    order.orderCategory = dictionaries?.vehicleTypes?.find((item) => item.id == order.vehicleType)?.category
    order.innerComments = [];
    order.insurance = order?.performers.find(el => el.client.id !== user.id)?.isInsuranceRequired
    return {
      ...((orderType === 'city' ? userSettings?.order?.city : userSettings?.order?.intercity) || {}),
      ...order,
      cargoPlacesAll,
    }

  }, [dictionaries]);

  const [orderData, loading] = useCancelableLoadData(fetchData);

  const onPublish = React.useCallback(async (store) => {
    const { values } = store.getValidateData();

    const data = {
      ...values
    };

    const reqData = Utils.getOrderDataSave(data);
    reqData.addresses = reqData.addresses.map((address) => {
      if (typeof address.contacts === 'string') {
        address.contacts = [address.contacts];
      };
      address.attachedFiles?.map(el => {
        el.name = el.fileName || el.fileNameOrigin; el.fileId = String(el.fileId);
        delete el.fileName;
        return el
      });
      return address;
    });
    delete reqData.id;
    delete reqData.requestId;
    if (APP === 'client') {
      delete reqData.client;
      if (reqData.selectedTariffs.length) {
        reqData.requiredProducers = [...reqData.requiredProducers, ...reqData.selectedTariffs.map(el => +el.split(':')[0])]
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

    reqData.parametersForProducers = reqData.selectedTariffs.map(el => {
      const values = el.split(':')
      return {
        producer: values[0],
        tariff: values[1],
        contract: values[2],
      }
    });

    const contractAttributeCustomProperty = reqData?.customProperties?.find((item) => item.latinName == 'contract_attribute')

    reqData.additionalData = {
      ignoreEmptyNumeratorVars: true,
      numeratorVars: contractAttributeCustomProperty ? [{
        title: 'contract_attribute',
        value: customProperties?.find(item => item.latinName == 'contract_attribute')?.possibleValues?.find(item => item.id == contractAttributeCustomProperty?.values?.[0])?.title
      }] : []
    }

    reqData.customProperties = reqData.customProperties.map(el => (
      {
        latinName: el.customProperty?.latinName || el.latinName,
        values: el.customProperty?.type === 'array' ? el.values.map(item => item.value) : el.values
      }
    ))

    delete reqData.selectedTariffs;

    setSaving(true);

    try {
      const { orderNr, requestNr } = await OrdersService.createAndPublish(reqData);
      showAlert({
        content: t.common(`Рейс${orderNr ? ' №' + orderNr : ''} был успешно создан${requestNr ? ', заявка №' + requestNr : ''}`),
        title: undefined,
        onOk: () => {
          history.replace(backUrlDefault);
        },
      });
    } catch (e) {
      console.error(e);
      store.setData({
        contourTree: [],
      });
      showError(e);
    }

    setSaving(false);
  });

  const onCancel = React.useCallback(async () => {
    history.replace(`/orders/${orderId}/map`);
  }, [history, orderId, orderType]);

  return (
    <OrderEditor
      observer={observer}
      history={history}
      loading={loading}
      saving={saving}
      lazyData={orderData}
      orderType={orderType}
      onCancel={onCancel}
      onBargain={onPublish}
      onTariff={onPublish}
      title={`Новый ${orderType === 'city' ? 'городской' : 'междугородний'} рейс`}
      onRate={onPublish}
    />
  );
}

export default OrderAddFrom;
