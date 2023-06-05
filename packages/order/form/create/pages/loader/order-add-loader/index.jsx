import React, { useCallback } from 'react';
import { showAlert, showError } from '@vezubr/elements';
import * as Order from '../../../..';
import t from '@vezubr/common/localization';
import { Orders as OrdersService, Loaders as LoadersService, Contractor as ContractorService } from '@vezubr/services';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import OrderEditorLoader from '../../../components/editor/order-editor-loader';
import useDataLocalStorage from '../../../hooks/useDataLocalStorage';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
const backUrlDefault = '/requests/active';

const EXCLUDE_DATA_ORDER = ['requiredContours', 'requiredProducers', 'customProperties'];

function OrderAddLoader(props) {
  const history = useHistory()
  const user = useSelector((state) => state.user);
  const customProperties = useSelector(state => state.customProperties);
  const [saving, setSaving] = React.useState(false);
  const storageKey = React.useMemo(() => `order-loader-new__${user.id}`, [user]);
  const [orderStorage, removeFromStorage, saveIntoStorage] = useDataLocalStorage(storageKey, EXCLUDE_DATA_ORDER);

  const fetchData = useCallback(async () => {
    try {
      // const response = await ContractorService.producerList();
      return {
        ...orderStorage,
        // producers: response.data,
      }
    } catch (e) {
      console.error;
      if (typeof e.message !== 'undefined') {
        showError(e);
      }
    }

  }, [orderStorage]);

  const [orderData, loading] = useCancelableLoadData(fetchData);

  const onPublish = React.useCallback(async (store) => {
    const { values } = store.getValidateData();

    const reqData = Order.Utils.getOrderDataSave(values);
    delete reqData.addresses;

    if (reqData.address) {
      const address = reqData.address
      if (typeof address.contacts === 'string') {
        address.contacts = [address.contacts];
      }
      if (address.attachedFiles) {
        address.attachedFiles.map(el => {
          el.name = el.fileName || el.fileNameOrigin;
          el.fileId = String(el.fileId);
          delete el.fileName;
          return el
        }
        )
      }
      reqData.address = address;
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
      if (reqData.selectingStrategy !== 2 && reqData.selectingStrategy !== 3) {
        delete reqData.bargainsEndDatetime;
        delete reqData.bidStep;
        if (reqData.clientRate === null) delete reqData.clientRate;
      }
    }

    if (APP === 'client') {
      delete reqData.client;
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

    const contractAttributeCustomProperty = reqData?.customProperties?.find((item) => item.latinName == 'contract_attribute')

    reqData.additionalData = {
      ignoreEmptyNumeratorVars: true,
      numeratorVars: contractAttributeCustomProperty ? [{
        title: 'contract_attribute',
        value: customProperties?.find(item => item.latinName == 'contract_attribute')?.possibleValues?.find(item => item.id == contractAttributeCustomProperty?.values?.[0])?.title
      }] : []
    }

    delete reqData.selectedTariffs;

    setSaving(true);

    try {
      const { orderNr, requestNr } = await LoadersService.createAndPublish(reqData);
      showAlert({
        content: t.common(`Рейс${orderNr ? ' №' + orderNr : ''} был успешно создан${requestNr ? ', заявка №' + requestNr : ''}`),
        title: undefined,
        onOk: () => {
          history.replace(backUrlDefault);
          removeFromStorage();
        },
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }

    setSaving(false);
  });

  const onCancel = React.useCallback(async () => {
    removeFromStorage();
    history.replace(backUrlDefault);
  }, [history]);

  const onChange = React.useCallback(async (data, store) => {
    saveIntoStorage(store.getDirtyData());
  }, []);

  return (
    <OrderEditorLoader
      history={history}
      onChange={onChange}
      loading={loading}
      onPublish={onPublish}
      onRate={onPublish}
      onTariff={onPublish}
      onBargain={onPublish}
      saving={saving}
      lazyData={orderData}
      onCancel={onCancel}
    />
  );
}

export default OrderAddLoader;
