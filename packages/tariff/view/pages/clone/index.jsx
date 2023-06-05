import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  IconDeprecated,
  showAlert,
  showError,
  WhiteBoxDeprecated,
  WhiteBoxHeaderDeprecated,
  Loader,
  Modal,
  Ant
} from '@vezubr/elements';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import t from '@vezubr/common/localization';
import * as Tariff from '../../..';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tariff as TariffService } from '@vezubr/services';
import useTariffLoadNeedData from '../../hooks/useTariffLoadNeedData';
import { useHistory } from 'react-router-dom';
import ClientForm from './modal/clients';
const backUrlDefault = '/tariffs';

function TariffInfoEdit(props) {
  const { match, dictionaries, user } = props;

  const tariffId = parseInt(match.params.id, 10);
  const history = useHistory();
  const { location } = history;
  const [loadingMainData, setLoadingMainData] = useState(false);
  const [mainData, setMainData] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [client, setClient] = useState(null);
  const [showClientform, setShowClientForm] = useState(false);
  const { territories, vehicleBodies } = dictionaries;
  const [dataTariffExtra, dataTariffExtraLoading] = useTariffLoadNeedData();
  const [saving, setSaving] = useState(false);
  // callbacks
  const goBack = useGoBack({ location, history, defaultUrl: `${backUrlDefault}/${tariffId}` });

  const onDelete = useCallback(async () => {
    setDeleting(true);
    try {
      // await TariffService.remove({ id: tariffId });

      // showAlert({
      //   content: t.common('Тариф успешно удален'),
      //   title: t.common('ОК'),
      //   onOk: () => {
      //     history.replace(backUrlDefault);
      //   },
      // });
    } catch (e) {
      console.error(e);
      showError(e);
    }

    setDeleting(false);
  }, []);

  const handleClientsForm = async () => {
    setShowClientForm(true);
  }

  const onCancel = useCallback(async () => {
    history.replace(`${backUrlDefault}/${tariffId}`);
  }, [history]);

  const fetchMainData = useCallback(async () => {
    setLoadingMainData(true);
    try {
      const response = await TariffService.details({ id: tariffId });
      const tariffInput = response?.tariff || response || {};
      let tariff = Tariff.Utils.convertTariffDataWithParams({ tariffInput, vehicleBodies, costWithVat: user?.costWithVat });
      if (tariff.routeType) {
        tariff = {
          ...tariff,
          ...Tariff.Utils.convertTariffAddresses(tariff.route, tariff.routeType)
        }
      } else if (tariff.type === 3) {
        tariff.addresses = [];
      }
      setMainData(tariff);
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingMainData(false);
  }, [tariffId]);

  useEffect(() => {
    fetchMainData();
  }, [tariffId]);

  const onSaveHourly = useCallback(async (store) => {
    setSaving(true);
    try {
      const { hasError, values } = store.getValidateData();

      if (hasError) {
        setSaving(false);
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }

      if (client) values.clients = [String(client.id)];

      if (values.type === 1) {
        values.orderType = 'transport_order'
      } else {
        values.orderType = 'loaders_order'
      }

      const response = await TariffService.hourlyAdd(values);

      showAlert({
        content: t.common('Тариф был успешно создан'),
        title: t.common('ОК'),
        onOk: () => {
          history.push(`${backUrlDefault}/${response.id}` || backUrlDefault || goBack);
        },
      })
    } catch (e) {
      console.error(e);
      showError(e);
    }

    setSaving(false);
  }, [goBack, client, user, mainData]);

  const onSaveFixed = useCallback(async (store) => {
    setSaving(true);
    try {

      const { hasError, values } = store.getValidateData();
      if (hasError) {
        setSaving(false);
        Ant.message.error('Исправтье ошибки в форме');
        return;
      }

      const newAdresses = values.addresses.map((el) => {
        if (!Array.isArray(el.contacts)) {
          el.contacts = [el.contacts];
        }
        return el;
      })
      const newCities = values.cities.filter(item => !item.isNew).map((el, index) => {
        el.position = index + 1
        delete el.guid;
        delete el.isNew
        return el;
      })
      if (client) values.clients = [String(client.id)];

      const response = await TariffService.fixedAdd({ ...values, addresses: newAdresses, cities: newCities });

      showAlert({
        content: t.common('Тариф был успешно создан'),
        title: t.common('ОК'),
        onOk: () => {
          history.replace(`${backUrlDefault}/${response.id}` || backUrlDefault || goBack);
        },
      })
    } catch (e) {
      let mesgString = '';
      const errData = e.data;
      if (errData) {
        Object.keys(errData).forEach(el => {
          mesgString += errData[el] + ' ';
          if (el.indexOf('addresses') !== -1) {
            store.setError('addresses', JSON.stringify({ field: errData[el] }));
          }
          else {
            store.setError(el, errData[el]);
          }
        })
      }
      console.error(e);
      showError(mesgString);
    }

    setSaving(false);
  }, [goBack, client, user, mainData]);

  const onSaveMileage = useCallback(async (store) => {
    setSaving(true);
    try {
      const { hasError, values } = store.getValidateData();

      if (hasError) {
        setSaving(false);
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }
      if (client) values.clients = [String(client.id)];
      const response = await TariffService.mileageAdd(values);
      showAlert({
        content: t.common('Тариф был успешно создан'),
        title: t.common('ОК'),
        onOk: () => {
          history.replace(`${backUrlDefault}/${response.id}` || backUrlDefault || goBack);
        },
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }

    setSaving(false);
  }, [goBack, user, client])

  const placeholders = useMemo(() => {
    return {
      title: mainData?.title,
      dayHourFrom: mainData?.dayHourFrom,
      dayHourTill: mainData?.dayHourTill,
      baseWorkCosts: mainData?.baseWorkCosts,
      serviceCosts: mainData?.serviceCosts,
    }
  }, [mainData])

  return (
    <div className={'tariff-info-edit-page'}>
      <div className="flexbox align-center margin-top-16">
        <div className="flexbox center margin-right-12">
          <IconDeprecated className={'back-action pointer'} name={'backArrowOrange'} onClick={goBack} />
          <h2 className="big-title title-bold margin-left-12">Клонирование тарифа</h2>
        </div>
      </div>

      <WhiteBoxDeprecated className={'extra-wide margin-top-24'}>
        <WhiteBoxHeaderDeprecated icon={<IconDeprecated name={'balanceOrange'} />}>
          Тариф ID: {mainData?.id} / {mainData?.title}
        </WhiteBoxHeaderDeprecated>

        {mainData?.type === 1 && (
          <Tariff.CloneHourlyForm
            data={dataTariffExtra}
            editable={true}
            onDelete={onDelete}
            onCancel={onCancel}
            tableConfig={Tariff.TARIFF_TABLE_CONFIG}
            tariff={mainData}
            loading={loadingMainData || dataTariffExtraLoading}
            deleting={deleting}
            territories={territories}
            dictionaries={dictionaries}
            client={client}
            clientFormOpen={handleClientsForm}
            onSave={onSaveHourly}
            saving={saving}
            costWithVat={user?.costWithVat}
            placeholders={placeholders}
            clone={true}
          />
        )}

        {mainData?.type === 3 && (
          <Tariff.CloneFixedForm
            territories={territories}
            data={dataTariffExtra}
            costWithVat={user?.costWithVat}
            editable={true}
            onDelete={onDelete}
            onCancel={onCancel}
            tableConfig={Tariff.TARIFF_TABLE_CONFIG}
            tariff={mainData}
            loading={loadingMainData || dataTariffExtraLoading}
            deleting={deleting}
            dictionaries={dictionaries}
            clientFormOpen={handleClientsForm}
            client={client}
            onSave={onSaveFixed}
            placeholders={placeholders}
            clone={true}
          />
        )}

        {mainData?.type === 4 && (
          <Tariff.MileageForm
            territories={territories}
            data={dataTariffExtra}
            costWithVat={user?.costWithVat}
            editable={true}
            onDelete={onDelete}
            onCancel={onCancel}
            tableConfig={Tariff.TARIFF_TABLE_CONFIG}
            tariff={mainData}
            loading={loadingMainData || dataTariffExtraLoading}
            deleting={deleting}
            dictionaries={dictionaries}
            clientFormOpen={handleClientsForm}
            client={client}
            onSave={onSaveMileage}
            placeholders={placeholders}
            clone={true}
          />
        )}

        {loadingMainData && <Loader />}
        <Modal
          title={'Выбор Заказчика'}
          visible={showClientform}
          centered={true}
          destroyOnClose={true}
          footer={null}
          width={1300}

          onCancel={() => {
            setShowClientForm(false);
          }}
        >
          <ClientForm onCancel={() => setShowClientForm(false)} onOk={(client) => { setClient(client); setShowClientForm(false) }} location={location} />
        </Modal>
      </WhiteBoxDeprecated>
    </div>
  );
}

TariffInfoEdit.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  dictionaries: PropTypes.object,
};

const mapStateToProps = (state) => {
  let { dictionaries = {}, user } = state;

  return {
    dictionaries,
    user
  };
};

export default connect(mapStateToProps)(TariffInfoEdit);
