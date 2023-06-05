import compose from '@vezubr/common/hoc/compose';
import { Ant, showError, WhiteBox, VzForm, IconDeprecated } from '@vezubr/elements';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import { useDebouncedCallback } from 'use-debounce';
import { updateUserSetting } from './../../../../infrastructure/actions/userSettings';
import { User as UserService, Profile as ProfileService } from '@vezubr/services';
import { observer } from 'mobx-react';
import _pick from 'lodash/pick';
import { formattedDataOperationTimeForClient, unFormattedDataOperationTimeForClient } from './utils';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import t from '@vezubr/common/localization';
import SettingsOrderCityForm from '../../../../forms/settings/settings-order-city-from';
import SettingsOrderIntercityForm from '../../../../forms/settings/settings-order-intercity-form';
import SettingsOrderInternationalForm from '../../../../forms/settings/settings-order-international-form';
import SettingsOperationTimeForm from '../../../../forms/settings/settings-operation-time-form';
import SettingsCompanyForm from '../../../../forms/settings/settings-company-form';
import Units from '../../../../lists/units';
import CancellationReasons from '../../../../lists/cancellation-reasons';

const MESSAGE_KEY = 'settings_personal_saving';

const FIELDS = [
  'vehicleType',
  'bodyTypes',
  'requiredDocumentsCategories',
  'sanitaryPassportRequired',
  'sanitaryBookRequired',
  'hydroliftRequired',
  'fasteningIsRequired',
  'minVehicleBodyLengthInCm',
  'minVehicleBodyHeightInCm',
  'maxHeightFromGroundInCm',
  'pointChangeType',
];

function SettingsCompany(props) {
  const { contours } = props;

  const dictionariesInput = useSelector((state) => state.dictionaries);
  const dictionaries = useConvertDictionaries({ dictionaries: dictionariesInput });
  const dispatch = useDispatch();
  const appIsClient = ['client', 'dispatcher'].includes(APP);

  const { vehicleTypesList, addressTypes } = dictionaries;
  const userSettings = useSelector((state) => state.userSettings);
  const [saveTrigger, setSaveTrigger] = React.useState(false);
  const [settingsData, setSettingsData] = React.useState(null);
  const savingRef = React.useRef(false);
  const [edited, setEdited] = React.useState(false);

  const fetchData = async () => {
    try {
      const response = await ProfileService.getContractorConfiguration();
      const delegationSettings = await ProfileService.getDelegationSettings();
      const formattedResponse = {
        ...response,
        ...delegationSettings,
        averageOperationTime: formattedDataOperationTimeForClient(response.averageOperationTime),
      };
      setSettingsData(formattedResponse);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const save = useCallback(async (values) => {
    savingRef.current = true;
    try {
      Ant.message.loading({
        content: 'Сохраняем',
        key: MESSAGE_KEY,
      });

      await UserService.saveInterfaceSettings(values);
      dispatch({ type: 'USER_SETTINGS_SET', settings: values });

      Ant.message.success({
        content: 'Данные обновлены',
        key: MESSAGE_KEY,
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    savingRef.current = false;
  }, []);

  const [onSaveOrderSettings] = useDebouncedCallback((values) => {
    if (!savingRef.current) {
      save(values);
    }
  }, 500);

  const staticData = useMemo(
    () => ({
      contours,
    }),
    [contours],
  );

  const onSaveAverageOperationTime = async (values) => {
    const dataForSend = {
      ...settingsData,
      ...{
        averageOperationTime: unFormattedDataOperationTimeForClient(values),
      },
    };

    try {
      Ant.message.loading({
        content: 'Сохраняем',
        key: MESSAGE_KEY,
      });
      const newSettings = await ProfileService.sendContractorConfiguration(dataForSend);
      const formattedResponse = {
        ...newSettings,
        averageOperationTime: formattedDataOperationTimeForClient(newSettings.averageOperationTime),
      };
      setSettingsData(formattedResponse);
      Ant.message.success({
        content: 'Данные обновлены',
        key: MESSAGE_KEY,
      });
    } catch (e) {
      console.error(e);
      showError(e);
      setSettingsData(dataForSend);
    }
  };

  const onSave = async (form, extraFields) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }
    const dataForSend = {
      ...settingsData,
      ...{
        averageOperationTime: unFormattedDataOperationTimeForClient(settingsData?.averageOperationTime),
      },
      ...values,
      ...extraFields
    };

    delete dataForSend.todayDelegation;
    delete dataForSend.futureDelegation;

    try {
      Ant.message.loading({
        content: 'Сохраняем',
        key: MESSAGE_KEY,
      });
      const newSettings = await ProfileService.sendContractorConfiguration(dataForSend);
      const formattedResponse = {
        ...newSettings,
        averageOperationTime: formattedDataOperationTimeForClient(newSettings.averageOperationTime),
      };
      setSaveTrigger(true);
      setSaveTrigger(false);
      setSettingsData({ ...values, ...formattedResponse });
      setEdited(false)
      Ant.message.success({
        content: 'Данные обновлены',
        key: MESSAGE_KEY,
      });
    } catch (e) {
      console.error(e);
      showError(e);
      // VzForm.Utils.handleApiFormErrors(e, form);
    }
  };

  const { city, intercity, international } = React.useMemo(() => userSettings?.order || {}, [userSettings]);

  const onChange = useCallback(
    (type) => (data) =>
      onSaveOrderSettings({
        ...userSettings,
        order: {
          ...userSettings?.order,
          [type]: _pick(data, FIELDS),
        },
      }),
    [onSaveOrderSettings, userSettings],
  );

  return (
    <>
      <WhiteBox.Header type={'h1'} icon={<IconDeprecated name={'settingsOrange'} />} iconStyles={{ color: '#F57B23' }}>
        Настройки компании
      </WhiteBox.Header>

      {appIsClient ? (
        <>
          <div className={`settings-form__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.order')}>
              <div className={`settings-page__hint-title`}>Настройка рейсов {<Ant.Icon type={'info-circle'} />}</div>
            </Ant.Tooltip>
          </div>

          <div className={'order-settings'}>
            <Ant.Tabs type="card">
              <Ant.Tabs.TabPane tab="Город" key="city">
                <SettingsOrderCityForm
                  staticData={{ ...staticData, orderType: 1 }}
                  lazyData={city}
                  onChange={onChange('city')}
                  dictionaries={dictionaries}
                  validators={{}}
                />
              </Ant.Tabs.TabPane>
              <Ant.Tabs.TabPane tab="Межгород" key="intercity">
                <SettingsOrderIntercityForm
                  staticData={{ ...staticData, orderType: 3 }}
                  lazyData={intercity}
                  onChange={onChange('intercity')}
                  dictionaries={dictionaries}
                  validators={{}}
                />
              </Ant.Tabs.TabPane>
              <Ant.Tabs.TabPane tab="Международный" key="international">
                <SettingsOrderInternationalForm
                  staticData={{ ...staticData, orderType: 3 }}
                  lazyData={international}
                  onChange={onChange('international')}
                  dictionaries={dictionaries}
                  validators={{}}
                />
              </Ant.Tabs.TabPane>
            </Ant.Tabs>
          </div>
        </>
      ) : null}

      <SettingsCompanyForm
        onSave={onSave}
        values={settingsData}
        edited={edited}
        setEdited={setEdited}
        userSettings={userSettings}
        saveTrigger={saveTrigger}
      />

      <div className='padding-12'>
        <div className={`settings-form__group__title`}>
          <Ant.Tooltip placement="right" title={t.settings('hint.units')}>
            <div className={`settings-page__hint-title`}>
              Подразделения {<Ant.Icon type={'info-circle'} />}
            </div>
          </Ant.Tooltip>
        </div>
        <Ant.Collapse className={'order-advanced-options'}>
          <Ant.Collapse.Panel header="Показать/скрыть настройки подразделений" key="1">
            <Units />
          </Ant.Collapse.Panel>
        </Ant.Collapse>
      </div>

      <div className='padding-12'>
        <div className={`settings-form__group__title`}>
          <Ant.Tooltip placement="right" title={t.settings('hint.cancellationReasons')}>
            <div className={`settings-page__hint-title`}>
              Причины отмены Заявок/Рейсов {<Ant.Icon type={'info-circle'} />}
            </div>
          </Ant.Tooltip>
        </div>
        <Ant.Collapse className={'order-advanced-options'}>
          <Ant.Collapse.Panel header="Показать/скрыть настройки причин отмены Заявок/Рейсов" key="1">
            <CancellationReasons />
          </Ant.Collapse.Panel>
        </Ant.Collapse>
      </div>

      {appIsClient ? (
        <div className='padding-12'>
          <div className={`settings-form__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.settingOperationTime')}>
              <div className={`settings-page__hint-title`}>
                Норматив времени работы на адресе {<Ant.Icon type={'info-circle'} />}
              </div>
            </Ant.Tooltip>
          </div>
          <Ant.Collapse className={'order-advanced-options'}>
            <Ant.Collapse.Panel header="Показать/скрыть нормативы работы на адресе" key="1">
              <SettingsOperationTimeForm
                vehicleTypes={vehicleTypesList}
                addressTypes={addressTypes}
                averageOperationTime={settingsData?.averageOperationTime}
                onSave={onSaveAverageOperationTime}
              />
            </Ant.Collapse.Panel>
          </Ant.Collapse>
        </div>
      ) : null}
    </>
  );
}

SettingsCompany.propTypes = {
  transportOrderStatuses: PropTypes.object,
  vehicleTypes: PropTypes.object,
  addressTypes: PropTypes.object,
};

export default compose([observer])(SettingsCompany);
