import React, { useCallback, useState } from 'react';
import {
  IconDeprecated,
  showError,
  WhiteBoxDeprecated,
  WhiteBoxHeaderDeprecated,
  Loader,
  showConfirm,
  showAlert,
  Ant
} from '@vezubr/elements';
import t from '@vezubr/common/localization';
import * as Tariff from '../../..';
import { connect } from 'react-redux';
import { Address as AddressService, Tariff as TariffService, Contractor as ContractorServices, Contracts as ContractsService } from '@vezubr/services';
import { useHistory } from 'react-router-dom';
import Utils from '@vezubr/common/common/utils';

function TariffCopy(props) {
  const { match, dictionaries, user } = props;
  const history = useHistory();
  const tariffId = match.params.id;
  const backUrlDefault = `/tariffs/${tariffId}`;
  const { location } = history;
  const [saving, setSaving] = useState(false);
  const [tariffTypeId, setTariffTypeId] = useState(null);
  const { contractorId: contractorIdInput } = Utils.queryString(location.search);
  const [loadingMainData, setLoadingMainData] = useState(false);
  const { territories, vehicleBodies } = dictionaries;
  const [mainData, setMainData] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
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
          tariff = Tariff.Utils.convertTariffDataWithParamsLoaders({ tariffInput, costWithVat: user?.costWithVat });
        } else {
          // const tariffWithDefaults = Tariff.Utils.getDefaultServices(tariffInput);
          tariff = Tariff.Utils.convertTariffDataWithParams({
            tariffInput: tariff,
            vehicleBodies,
            costWithVat: user?.costWithVat,
          });
        }

        if (tariff.routeType) {
          tariff = {
            ...tariff,
            ...Tariff.Utils.convertTariffAddresses(tariff.route, tariff.routeType),
          };
        }
        if (tariff.addresses) {
          let newAddresses = []
          for (let address of tariff.addresses) {
            const newAddress = await AddressService.info(address.id)
            newAddress.contacts = null
            newAddresses.push(newAddress)
          }
          tariff.addresses = newAddresses;
        }

        tariff.client = client;
        setTariffTypeId(tariff.type)
        setMainData(tariff);
      } catch (e) {
        console.error(e);
        showError(e);
      }
      setLoadingMainData(false);
    };
    fetchData();
  }, [tariffId]);

  const contractorId = contractorIdInput ? ~~contractorIdInput : undefined;

  const onChooseTariffType = useCallback((tariffTypeId) => {
    setTariffTypeId(tariffTypeId);
  }, []);

  const deleteInitialTariff = useCallback(async () => {
    try {
      await TariffService.remove(tariffId)
      showAlert({
        title: '',
        content: `Тариф №${tariffId} был удален`,
        onOk: () => {
          history.push('/tariffs')
        }
      })
    } catch (e) {
      showError(e)
    }

  }, [tariffId])

  const onSaveHourly = useCallback(
    async (store) => {
      setSaving(true);
      try {
        const { hasError, values } = store.getValidateData();

        if (hasError) {
          setSaving(false);
          Ant.message.error('Исправьте ошибки в форме');
          return;
        }

        if (contractorId) {
          values.appointContractorIds = [contractorId];
        }
        if (values.type === 1) {
          values.orderType = 'transport_order';
        } else {
          values.orderType = 'loaders_order';
        }
        await TariffService.hourlyAdd(values);

        showConfirm({
          title: 'Тариф был успешно создан',
          content: t.common('Хотите удалить исходный тариф?'),
          onCancel: () => {
            history.push('/tariffs')
          },
          onOk: () => {
            deleteInitialTariff();
          }
        });
      } catch (e) {
        console.error(e);
        showError(e);
      }

      setSaving(false);
    },
    [contractorId, user],
  );

  const onSaveFixed = useCallback(
    async (store) => {
      setSaving(true);
      try {
        const { hasError, values } = store.getValidateData();
        if (hasError) {
          setSaving(false);
          Ant.message.error('Исправтье ошибки в форме');
          return;
        }

        if (contractorId) {
          values.appointContractorIds = [contractorId];
        }
        const newCities = values.cities
          .filter((item) => !item.isNew)
          .map((el, index) => {
            el.position = index + 1;
            delete el.guid;
            delete el.isNew;
            return el;
          });
        await TariffService.fixedAdd({ ...values, cities: newCities });

        showConfirm({
          title: 'Тариф был успешно создан',
          content: t.common('Хотите удалить исходный тариф?'),
          onCancel: () => {
            history.push('/tariffs')
          },
          onOk: () => {
            deleteInitialTariff();
          }
        });
      } catch (e) {
        let mesgString = '';
        const errData = e.data;
        if (errData) {
          Object.keys(errData).forEach((el) => {
            mesgString += errData[el] + ' ';
            if (el.indexOf('addresses') !== -1) {
              store.setError('addresses', JSON.stringify({ field: errData[el] }));
            } else {
              store.setError(el, errData[el]);
            }
          });
        }
        console.error(e);
        showError(mesgString);
      }

      setSaving(false);
    },
    [contractorId, user],


  );

  const onSaveMileage = useCallback(async (store) => {
    setSaving(true);
    try {
      const { hasError, values } = store.getValidateData();

      if (hasError) {
        setSaving(false);
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }

      if (contractorId) {
        values.appointContractorIds = [contractorId];
      }
      const response = await TariffService.mileageAdd(values);

      showConfirm({
        title: 'Тариф был успешно создан',
        content: t.common('Хотите удалить исходный тариф?'),
        onCancel: () => {
          history.push('/tariffs')
        },
        onOk: () => {
          deleteInitialTariff();
        }
      });

    } catch (e) {
      console.error(e);
      showError(e);
    }

    setSaving(false);
  }, [contractorId, user])

  const onCancel = useCallback(async () => {
    history.replace(backUrlDefault);
  }, [history]);

  return (
    <WhiteBoxDeprecated className={'extra-wide tariff-hourly-page-add margin-top-24'}>
      <div className="tariff-header-wrapper flexbox">
        <IconDeprecated name={'backArrowOrange'} className={'pointer'} onClick={onCancel} />
        <WhiteBoxHeaderDeprecated
          className={'tariff-hourly-page-add__header'}
          icon={<IconDeprecated name={'balanceOrange'} />}
        >
          Копирование тарифа №{tariffId}
        </WhiteBoxHeaderDeprecated>
      </div>
      {mainData && (
        <div>
          <Tariff.ChooseTariffTypeForm onChoose={onChooseTariffType} values={mainData} />
        </div>
      )}
      {tariffTypeId === 1 && (
        <Tariff.HourlyForm
          editable={true}
          onCancel={onCancel}
          tableConfig={Tariff.TARIFF_TABLE_CONFIG}
          tariff={mainData}
          onSave={onSaveHourly}
          loading={loadingMainData}
          territories={territories}
          dictionaries={dictionaries}
          client={mainData?.client}
          costWithVat={user?.costWithVat}
        />
      )}

      {tariffTypeId === 2 && (
        <Tariff.LoadersForm
          editable={true}
          onSave={onSaveHourly}
          onCancel={onCancel}
          tableConfig={Tariff.TARIFF_TABLE_CONFIG}
          tariff={mainData}
          loading={loadingMainData}
          territories={territories}
          dictionaries={dictionaries}
          costWithVat={user?.costWithVat}
        />
      )}

      {tariffTypeId === 3 && (
        <Tariff.FixedForm
          editable={true}
          onCancel={onCancel}
          onSave={onSaveFixed}
          tableConfig={Tariff.TARIFF_TABLE_CONFIG}
          tariff={mainData}
          loading={loadingMainData}
          dictionaries={dictionaries}
          client={mainData?.client}
          territories={territories}
          costWithVat={user?.costWithVat}
        />
      )}

      {mainData?.type === 4 && (
        <Tariff.MileageForm
          editable={true}
          onCancel={onCancel}
          tableConfig={Tariff.TARIFF_TABLE_CONFIG}
          tariff={mainData}
          loading={loadingMainData}
          dictionaries={dictionaries}
          client={mainData?.client}
          territories={territories}
          costWithVat={user?.costWithVat}
          onSave={onSaveMileage}
        />
      )}
      {loadingMainData && <Loader />}
    </WhiteBoxDeprecated>
  );
}

const mapStateToProps = (state) => {
  let { dictionaries = {}, user } = state;

  return {
    dictionaries,
    user,
  };
};

export default connect(mapStateToProps)(TariffCopy);
