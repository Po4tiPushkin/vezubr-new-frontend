import React, { useCallback, useState } from 'react';
import Utils from '@vezubr/common/common/utils';
import {
  Ant,
  IconDeprecated,
  showAlert,
  showError,
  WhiteBoxDeprecated,
  WhiteBoxHeaderDeprecated
} from '@vezubr/elements';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import t from '@vezubr/common/localization';
import * as Tariff from '../../..';
import { connect } from 'react-redux';

import { Tariff as TariffService, Contracts as ContractsService } from '@vezubr/services';
import { useHistory } from 'react-router-dom';

const backUrlDefault = '/tariffs';

function TariffAdd(props) {
  const { dictionaries, user } = props;
  const history = useHistory();
  const { location } = history;
  const [saving, setSaving] = useState(false);
  const [tariffTypeId, setTariffTypeId] = useState(null);
  const params = Utils.getUrlParams(location.search);
  const { contractorId: contractorIdInput, goBack } = Utils.queryString(location.search);

  const contractorId = contractorIdInput ? ~~contractorIdInput : undefined;
  const { territories } = dictionaries;

  const onChooseTariffType = useCallback((tariffTypeId) => {
    setTariffTypeId(tariffTypeId);
  }, []);

  const assignToContract = async (id) => {
    try {
      await ContractsService.assignTariff({ id: params.agreementId || params.contractId, tariff: id });

      showAlert({
        content: "Тариф был успешно создан и добавлен к контракту",
        title: 'Ок',
        onOk: () => {
          history.push(`/contract/${params.contractId}`);

        }
      });

    } catch (e) {
      console.error(e);
      showError(e);
    }
  }

  const onSaveHourly = useCallback(async (store) => {
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
        values.orderType = 'transport_order'
      } else {
        values.orderType = 'loaders_order'
      }
      const response = await TariffService.hourlyAdd(values);

      if (params?.contractId) {
        await assignToContract(response.id);
      }
      else {
        showAlert({
          content: t.common('Тариф был успешно создан'),
          title: t.common('ОК'),
          onOk: () => {
            history.replace(goBack || backUrlDefault);
          },
        });
      }


    } catch (e) {
      console.error(e);
      showError(e);
    }

    setSaving(false);
  }, [goBack, contractorId, user]);

  const onSaveFixed = useCallback(async (store) => {
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
      const newCities = values.cities.filter(item => !item.isNew).map((el, index) => {
        el.position = index + 1
        delete el.guid;
        delete el.isNew
        return el;
      })
      const response = await TariffService.fixedAdd({ ...values, cities: newCities });

      if (params?.contractId) {
        await assignToContract(response.id);
      }
      else {
        showAlert({
          content: t.common('Тариф был успешно создан'),
          title: t.common('ОК'),
          onOk: () => {
            history.replace(goBack || backUrlDefault);
          },
        });
      }

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
  }, [goBack, contractorId, user]);

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

      if (params?.contractId) {
        await assignToContract(response.id);
      }
      else {
        showAlert({
          content: t.common('Тариф был успешно создан'),
          title: t.common('ОК'),
          onOk: () => {
            history.replace(goBack || backUrlDefault);
          },
        });
      }

    } catch (e) {
      console.error(e);
      showError(e);
    }

    setSaving(false);
  }, [goBack, contractorId, user])

  const onCancel = useCallback(async () => {
    history.replace(goBack || backUrlDefault);
  }, [history, goBack]);

  return (
    <WhiteBoxDeprecated className={'extra-wide tariff-hourly-page-add margin-top-24'}>
      <div className="tariff-header-wrapper flexbox">
        <IconDeprecated name={'backArrowOrange'} className={'pointer'} onClick={onCancel} />
        <WhiteBoxHeaderDeprecated
          className={'tariff-hourly-page-add__header'}
          icon={<IconDeprecated name={'balanceOrange'} />}
        >
          Создание тарифа
        </WhiteBoxHeaderDeprecated>
      </div>
      <div>
        <Tariff.ChooseTariffTypeForm onChoose={onChooseTariffType} />
      </div>
      {tariffTypeId === 1 && (
        <Tariff.HourlyForm
          editable={true}
          onSave={onSaveHourly}
          tableConfig={Tariff.TARIFF_TABLE_CONFIG}
          onCancel={onCancel}
          saving={saving}
          territories={territories}
          dictionaries={dictionaries}
          costWithVat={user?.costWithVat}
        />
      )}

      {tariffTypeId === 2 && (
        <Tariff.LoadersForm
          editable={true}
          onSave={onSaveHourly}
          tableConfig={Tariff.TARIFF_TABLE_CONFIG}
          onCancel={onCancel}
          saving={saving}
          territories={territories}
          dictionaries={dictionaries}
          costWithVat={user?.costWithVat}
        />
      )}

      {tariffTypeId === 3 && (
        <Tariff.FixedForm
          editable={true}
          onSave={onSaveFixed}
          tableConfig={Tariff.TARIFF_TABLE_CONFIG}
          onCancel={onCancel}
          saving={saving}
          dictionaries={dictionaries}
          costWithVat={user?.costWithVat}
          territories={territories}
        />
      )}
      {tariffTypeId === 4 && (
        <Tariff.MileageForm
          editable={true}
          onSave={onSaveMileage}
          tableConfig={Tariff.TARIFF_TABLE_CONFIG}
          onCancel={onCancel}
          saving={saving}
          territories={territories}
          dictionaries={dictionaries}
          costWithVat={user?.costWithVat}
        />
      )}
    </WhiteBoxDeprecated>
  );
}

const mapStateToProps = (state) => {
  let { dictionaries = {}, user } = state;
  return {
    dictionaries,
    user
  };
};

export default connect(mapStateToProps)(TariffAdd);
