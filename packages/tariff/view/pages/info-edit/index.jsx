import React, { useCallback, useEffect, useState } from 'react';
import {
  IconDeprecated,
  showAlert,
  showError,
  WhiteBoxDeprecated,
  WhiteBoxHeaderDeprecated,
  Loader,
  Modal,
  FilterButton,
} from '@vezubr/elements';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import t from '@vezubr/common/localization';
import * as Tariff from '../../..';
import { connect } from 'react-redux';
import { Tariff as TariffService, Contractor as ContractorServices } from '@vezubr/services';
import useTariffLoadNeedData from '../../hooks/useTariffLoadNeedData';
import { useHistory } from 'react-router-dom';
import ProducerForm from './modal/producers';
const backUrlDefault = '/tariffs';

function TariffInfoEdit(props) {
  const { match, dictionaries, user } = props;
  const history = useHistory();
  const { location } = history;
  const tariffId = parseInt(match.params.id, 10);
  const [showMenu, setShowMenu] = useState(false);

  const [loadingMainData, setLoadingMainData] = useState(false);
  const [mainData, setMainData] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showProducersForm, setShowProducersForm] = useState(false);
  const { territories, vehicleBodies } = dictionaries;

  const [dataTariffExtra, dataTariffExtraLoading] = useTariffLoadNeedData();

  // callbacks
  const goBack = useGoBack({ location, history, defaultUrl: backUrlDefault });

  const onDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await TariffService.remove(tariffId);

      showAlert({
        content: t.common('Тариф успешно удален'),
        title: t.common('ОК'),
        onOk: () => {
          history.replace(backUrlDefault);
        },
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }

    setDeleting(false);
  }, []);

  const onClone = useCallback(async () => {
    history.push(`${location.pathname}/clone`);
  }, []);

  const onCancel = useCallback(async () => {
    goBack();
  }, [history]);

  const onAddProducers = useCallback(async (producers) => {
    try {
      const response = await TariffService.createAppoints(tariffId, { producerIds: producers });
      showAlert({
        content: t.common('Подрядчики были добавлены'),
        title: t.common('ОК'),
        onOk: () => {
          setShowProducersForm(false);
        },
      });
    } catch (e) {
      console.error(e);
      showError(e.data?.message);
    }
  }, []);

  const showAddProducers = () => {
    setShowProducersForm(true);
  };

  const fetchMainData = useCallback(async () => {
    setLoadingMainData(true);
    try {
      const response = await TariffService.details({ id: tariffId });
      const tariffInput = response?.tariff || response || {};
      let client = null;
      if (tariffInput?.clients?.length) {
        client = (await ContractorServices.counterPartiesList(2)).find((el) => el.id === tariffInput.clients[0]);
      }
      let tariff = tariffInput;
      if (tariffInput?.orderType === 'loaders_order') {
        tariff = Tariff.Utils.convertTariffDataWithParamsLoaders({
          tariffInput,
          costWithVat: user?.costWithVat,
          loaderSpecialities: dictionaries.loaderSpecialities,
        });
      } else {
        const tariffWithDefaults = Tariff.Utils.getDefaultServices(tariffInput);
        tariff = Tariff.Utils.convertTariffDataWithParams({
          tariffInput: tariffWithDefaults,
          vehicleBodies,
          costWithVat: user?.costWithVat,
        });
      }

      if (tariff.routeType) {
        tariff = {
          ...tariff,
          ...Tariff.Utils.convertTariffAddresses(tariff.route, tariff.routeType),
        };
      } else if (tariff.type === 3) {
        tariff.addresses = [];
      }
      tariff.client = client;
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

  return (
    <div className={'tariff-info-edit-page'}>
      <WhiteBoxDeprecated className={'extra-wide margin-top-24'}>
        <div className="tariff-header-wrapper flexbox">
          <IconDeprecated name={'backArrowOrange'} className={'pointer'} onClick={goBack} />
          <WhiteBoxHeaderDeprecated
            className={'tariff-hourly-page-add__header'}
            icon={<IconDeprecated name={'balanceOrange'} />}
          >
            Детали тарифа: {mainData?.id} / {mainData?.title}
          </WhiteBoxHeaderDeprecated>
          <FilterButton
            icon={'dotsBlue'}
            className={'circle'}
            withMenu={true}
            onClick={() => setShowMenu((prev) => !prev)}
            menuOptions={{
              show: showMenu,
              list: [
                {
                  icon: 'repeatOrange',
                  onAction: async () => {
                    history.push(`/tariffs/copy/${tariffId}`);
                    setShowMenu(false);
                  },
                  title: 'Копировать тариф',
                },
              ],
            }}
          />
        </div>
        {mainData && (
          <div>
            <Tariff.ChooseTariffTypeForm disabled={true} values={mainData} />
          </div>
        )}
        {mainData?.orderType === 'transport_order' && mainData?.type === 1 && (
          <Tariff.HourlyForm
            data={dataTariffExtra}
            editable={false}
            onDelete={onDelete}
            onCancel={onCancel}
            tableConfig={Tariff.TARIFF_TABLE_CONFIG}
            tariff={mainData}
            loading={loadingMainData || dataTariffExtraLoading}
            deleting={deleting}
            territories={territories}
            dictionaries={dictionaries}
            onClone={APP === 'dispatcher' && onClone}
            client={mainData?.client}
            costWithVat={user?.costWithVat}
            showAddProducers={mainData?.clients?.length && APP === 'dispatcher' ? showAddProducers : null}
          />
        )}

        {mainData?.orderType === 'loaders_order' && (
          <Tariff.LoadersForm
            data={dataTariffExtra}
            editable={false}
            onDelete={onDelete}
            onCancel={goBack}
            tableConfig={Tariff.TARIFF_TABLE_CONFIG}
            tariff={mainData}
            loading={loadingMainData || dataTariffExtraLoading}
            deleting={deleting}
            territories={territories}
            dictionaries={dictionaries}
            costWithVat={user?.costWithVat}
          />
        )}

        {mainData?.type === 3 && (
          <Tariff.FixedInfo
            data={dataTariffExtra}
            editable={false}
            onDelete={onDelete}
            onCancel={onCancel}
            tableConfig={Tariff.TARIFF_TABLE_CONFIG}
            tariff={mainData}
            loading={loadingMainData || dataTariffExtraLoading}
            deleting={deleting}
            dictionaries={dictionaries}
            onClone={APP === 'dispatcher' && onClone}
            client={mainData?.client}
            territories={territories}
            costWithVat={user?.costWithVat}
            showAddProducers={mainData.clients?.length && APP === 'dispatcher' ? showAddProducers : null}
          />
        )}

        {mainData?.type === 4 && (
          <Tariff.MileageForm
            data={dataTariffExtra}
            editable={false}
            onDelete={onDelete}
            onCancel={onCancel}
            tableConfig={Tariff.TARIFF_TABLE_CONFIG}
            tariff={mainData}
            loading={loadingMainData || dataTariffExtraLoading}
            deleting={deleting}
            dictionaries={dictionaries}
            onClone={APP === 'dispatcher' && onClone}
            client={mainData?.client}
            territories={territories}
            costWithVat={user?.costWithVat}
            showAddProducers={mainData.clients?.length && APP === 'dispatcher' ? showAddProducers : null}
          />
        )}

        {loadingMainData && <Loader />}
        <Modal
          title={'Выбор Подрядчиков'}
          visible={showProducersForm}
          centered={true}
          destroyOnClose={true}
          footer={null}
          width={1300}
          onCancel={() => {
            setShowProducersForm(false);
          }}
        >
          <ProducerForm
            client={mainData?.clients[0]}
            onOk={onAddProducers}
            onCancel={() => setShowProducersForm(false)}
            location={location}
            tariffId={mainData?.id}
          />
        </Modal>
      </WhiteBoxDeprecated>
    </div>
  );
}

const mapStateToProps = (state) => {
  let { dictionaries = {}, user } = state;

  return {
    dictionaries,
    user,
  };
};

export default connect(mapStateToProps)(TariffInfoEdit);
