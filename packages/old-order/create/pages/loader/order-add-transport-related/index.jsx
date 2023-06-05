import _omit from 'lodash/omit';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { showAlert, showError, Modal } from '@vezubr/elements';
import * as Order from '../../../..';
import t from '@vezubr/common/localization';
import { Orders as OrderService, Orders as OrdersService } from '@vezubr/services';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import { Producers as ProducersService, Loaders as LoadersService } from '@vezubr/services';
import OrderEditorLoader from '../../../components/editor/order-editor-loader';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LoaderChooseAddress from '../../../components/chooseAddress';
const backUrlDefault = '/monitor/selection';
const EXCLUDE_DATA_ORDER = [
  'requiredContours',
  'requiredProducers',
  'toStartAtDate',
  'toStartAtTime',
  'status',
  'requiredPassesDetectionMode',
  'useClientRate',
  'cargoPlaces',
  'clientRate',
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
const OrderAddTransportRelated = (props) => {
  const { match } = props;
  const history = useHistory();

  const orderId = ~~match.params.id;

  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [chosenAddress, setChosenAddress] = useState([]);
  const user = useSelector((state) => state.user)
  const customProperties = useSelector(state => state.customProperties);

  const fetchData = useCallback(async () => {
    const orderResponseData = (await OrderService.orderDetails(orderId)) || {};
    const order = clearAddress(_omit(Order.Utils.getOrderDataStore({
      ...orderResponseData,
      ...orderResponseData?.loadersOrder,
      ...orderResponseData?.transportOrder,
      cargoPlaces: orderResponseData?.cargoPlaces || []
    }), EXCLUDE_DATA_ORDER));
    return {
      addresses: order?.addresses,
      client: order?.performers?.[0]?.client?.id,
    }

  }, []);

  const [orderData, loading] = useCancelableLoadData(fetchData);

  const onPublish = React.useCallback(async (store) => {
    const { values } = store.getValidateData();

    const reqData = Order.Utils.getOrderDataSave(values);
    if (typeof reqData.address.contacts === 'string') {
      reqData.address.contacts = [reqData.address.contacts];
    }
    reqData.address.attachedFiles?.map((el) => {
      el.name = el.fileName || el.fileNameOrigin || el.fileData?.originalName;
      el.fileId = String(el.fileId);
      return el;
    });

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

    delete reqData.id;
    delete reqData.addresses;
    delete reqData.requestId;

    setSaving(true);

    try {
      const { orderNr, requestNr, id } = await LoadersService.createAndPublish(reqData);
      try {
        await OrdersService.addRelatedOrders({
          id: orderId,
          data: { relatedOrders: [id], relationType: APP === 'dispatcher' ? 'linked' : 'grouped' }
        })
      }
      catch (e) {
        showAlert({
          content: `Рейс${orderNr ? ' №' + orderNr : ''} был успешно создан${requestNr ? ', заявка №' + requestNr : ''}, 
        но не удалось связать рейсы по причине: ${e?.data?.message}`,
          title: undefined,
          onOk: () => {
            history.replace(`/orders/${orderId}`);
          },
        });
        return;
      }
      showAlert({
        content: t.common(`Рейс${orderNr ? ' №' + orderNr : ''} был успешно создан${requestNr ? ', заявка №' + requestNr : ''}`),
        title: undefined,
        onOk: () => {
          history.replace(`/orders/${orderId}`);
        },
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    finally {
      setSaving(false);
    }

  });

  const onCancel = React.useCallback(async () => {
    history.replace(`/orders/${orderId}/map`);
  }, [history, orderId]);

  const onChoosenAddress = useCallback((address) => {
    setChosenAddress(address);
    setShowModal(false);
  }, [])

  return (
    <>
      <OrderEditorLoader
        history={history}
        onBargain={onPublish}
        onRate={onPublish}
        onTariff={onPublish}
        onPublish={onPublish}
        loading={loading}
        saving={saving}
        onCancel={onCancel}
        lazyData={{ ...orderData, addresses: chosenAddress }}
      />
      <Modal
        title={'Выберите адрес'}
        visible={showModal}
        centered={true}
        destroyOnClose={true}
        footer={null}
        width={600}
        onCancel={null}
        closable={false}
        maskClosable
      >
        {<LoaderChooseAddress loading={loading} onSave={onChoosenAddress} addresses={orderData?.addresses} />}
      </Modal>
    </>
  );
}

export default OrderAddTransportRelated;
