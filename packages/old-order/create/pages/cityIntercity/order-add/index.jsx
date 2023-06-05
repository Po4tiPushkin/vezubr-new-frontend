import React, { useCallback, useMemo } from 'react';
import { showAlert, showError } from '@vezubr/elements';
import * as Utils from '../../../../utils';
import t from '@vezubr/common/localization';
import { Orders as OrdersService, Contractor as ContractorService } from '@vezubr/services';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import OrderEditor from '../../../components/editor/order-editor';
import useDataLocalStorage from '../../../hooks/useDataLocalStorage';
import { connect, useSelector } from "react-redux";
import { getAllCargoPlace } from '../../../utils';
import { useHistory } from 'react-router-dom';
const backUrlDefault = '/monitor/selection';
const EXCLUDE_DATA_ORDER = ['requiredContours', 'requiredProducers', 'customProperties'];

function OrderAdd(props) {
  const { observer } = props;
  const history = useHistory();
  const { location } = history;
  const user = useSelector(state => state.user);
  const customProperties = useSelector(state => state.customProperties);
  const userSettings = useSelector(state => state.userSettings);
  const orderType = useMemo(() => location.pathname.split('/')[2], [location]);
  const storageKey = useMemo(() => `order-${orderType}-new__${user.id}`, [orderType])
  const [saving, setSaving] = React.useState(false);

  const [orderStorage, removeFromStorage, saveIntoStorage] = useDataLocalStorage(storageKey, EXCLUDE_DATA_ORDER);

  const fetchData = useCallback(async () => {

    const cargoPlacesAll = (await getAllCargoPlace()) || [];

    return {
      ...((orderType === 'city' ? userSettings?.order?.city : userSettings?.order?.intercity) || {}),
      ...orderStorage,
      cargoPlacesAll,
    }

  }, [orderStorage]);

  const [orderData, loading] = useCancelableLoadData(fetchData);

  const onPublish = React.useCallback(async (store) => {
    const { values } = store.getValidateData();
    const reqData = Utils.getOrderDataSave(values)
    reqData.addresses = reqData.addresses.map((address) => {
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
      reqData.selectedTariffs = reqData.selectedTariffs.filter(el => el.startsWith(user?.id))
      if (reqData.selectingStrategy !== 2 && reqData.selectingStrategy !== 3) {
        delete reqData.bargainsEndDatetime;
        delete reqData.bidStep;
        if (reqData.clientRate === null) delete reqData.clientRate;
      }
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
      const { orderNr, requestNr } = await OrdersService.createAndPublish(reqData);
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
      store.setData({
        contourTree: [],
      });
      showError(e);
    }

    setSaving(false);
  });

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
  }, [orderType]);

  return (
    <OrderEditor
      observer={observer}
      orderType={orderType}
      history={history}
      loading={loading}
      onChange={onChange}
      saving={saving}
      lazyData={orderData}
      onCancel={onCancel}
      onRate={onPublish}
      onTariff={onPublish}
      onBargain={onPublish}
      title={`Новый ${orderType === 'city' ? 'городской' : 'междугородний'} рейс`}
    />
  );
}

const mapStateToProps = (state, ownProps) => {
  let { user } = state;
  return {
    user,
  };
};

export default connect(mapStateToProps)(OrderAdd);
