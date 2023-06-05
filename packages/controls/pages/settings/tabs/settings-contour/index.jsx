import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import compose from '@vezubr/common/hoc/compose';
import { Ant, showError, WhiteBox, VzForm, IconDeprecated } from '@vezubr/elements';
import { Profile as ProfileServices, Common as CommonServices, Vehicle as VehicleService } from '@vezubr/services';
import cn from 'classnames';
import SettingsContourForm from '../../../../forms/settings/settings-contour-form';
import SettingsBargainForm from '../../../../forms/settings/settings-bargain-form';
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import { ReactComponent as Sharing_IconComponent } from '@vezubr/common/assets/img/icons/republishArrow.svg';
import t from '@vezubr/common/localization';
import VehicleTypes from '../../../../lists/vehicle-types';
import SettingsTimeoutForm from '../../../../forms/settings/settings-timeout-form';
const MESSAGE_KEY = '__SettingsCargoPlace__';

const CLS = 'settings-form';

const formatContourSettings = (settings, fromBackend = true) => {
  let newSettings = {};
  Object.entries(settings).map(([key, value]) => {
    if (!['routingBy', 'limitTimeOrderExecutionStart'].includes(key) && value) {
      value.transport = (fromBackend ? value.transport / 60 : value.transport * 60) || 0;
      value.transportIntercity = (fromBackend ? value.transportIntercity / 60 : value.transportIntercity * 60) || 0;
      value.transportInternational =
        (fromBackend ? value.transportInternational / 60 : value.transportInternational * 60) || 0;
      value.loaders = (fromBackend ? value.loaders / 60 : value.loaders * 60) || 0;
    }
    if (!newSettings[key]) {
      newSettings[key] = value;
    }
  });
  return newSettings;
};

function SettingContour() {
  const [defaultData, setDefaultData] = useState(null);
  const [bargainData, setBargainData] = useState(null);
  const [bargain, setBargain] = useState(null);
  const [rate, setRate] = useState(null);
  const [tariff, setTariff] = useState(null);
  const [reload, setReload] = useState(Date.now());
  const [systemVehicleTypes, setSystemVehicleTypes] = React.useState([]);
  const [contourSettings, setContourSettings] = React.useState({});
  const { limitTimeOrderExecutionStart, timeoutForCancelingOrdersInMin, timeoutForCreatingProblemsOrdersInMin } =
    contourSettings;
  const appIsDispatcher = APP == 'dispatcher';
  const appIsClient = ['dispatcher', 'client'].includes(APP);

  const changeContourSettings = (newSettings) => {
    setContourSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const fetchData = async () => {
    try {
      const { bargain: fetchBargain, rate: fetchRate, tariff: fetchTariff } = await CommonServices.getSharingSettings();

      let settingsResp = (await CommonServices.getContourSettings()) || {};
      settingsResp = formatContourSettings(settingsResp);

      const bargainRes = await CommonServices.getBargainSettings();
      setBargainData(bargainRes);

      const marginValues = {
        bargain: { ...fetchBargain, ...fetchBargain?.margin },
        rate: { ...fetchRate, ...fetchRate?.margin },
        tariff: { ...fetchTariff, ...fetchTariff?.margin },
      };
      Object.keys(marginValues).forEach((el) => {
        Object.keys(marginValues[el]).forEach((item) => {
          if (marginValues[el][item]?.type === 'amount') {
            marginValues[el][item].value /= 100;
          }
        });
      });

      setContourSettings(settingsResp);
      setBargain({ ...marginValues.bargain });
      setRate({ ...marginValues.rate });
      setTariff({ ...marginValues.tariff });
      setDefaultData({
        bargain: { ...fetchBargain, ...marginValues.bargain },
        rate: { ...fetchRate, ...marginValues.rate },
        tariff: { ...fetchTariff, ...marginValues.tariff },
        bargainData: bargainRes,
        ...settingsResp,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getVehicleTypes = useCallback(async (paramsQuery) => {
    try {
      const systemVehicleTypes = await VehicleService.systemTypes(paramsQuery);
      setSystemVehicleTypes(systemVehicleTypes);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const isCanSave = useMemo(() => {
    const newValues = { bargain, rate, tariff, bargainData, ...contourSettings };
    return !_isEqual(defaultData, newValues);
  }, [defaultData, bargain, rate, tariff, bargainData, contourSettings]);

  useEffect(() => {
    fetchData();
  }, [reload]);

  const onSave = async () => {
    try {
      Ant.message.loading({
        content: 'Сохраняем',
        key: MESSAGE_KEY,
      });

      const values = _cloneDeep({ bargain, rate, tariff });

      Object.keys(values).forEach((el) => {
        if (values[el]) {
          Object.keys(values[el]).forEach((item) => {
            if (values[el][item]?.type === 'amount') {
              values[el][item].value = values[el][item]?.value ? values[el][item].value.toFixed() * 100 : 0;
            } else if (values[el][item]?.type === 'percent' && !values[el][item]?.value) {
              values[el][item].value = 0;
            }
          });
        }
      });

      await CommonServices.setContourSettings(formatContourSettings(contourSettings, false));
      await CommonServices.setSharingSettings({ bargain: values.bargain, rate: values.rate, tariff: values.tariff });
      await CommonServices.setBargainSettings(bargainData);

      Ant.message.success({
        content: 'Данные обновлены',
        key: MESSAGE_KEY,
      });
      setReload(Date.now());
    } catch (e) {
      console.error(e);
      showError(e);
    }
  };

  if (!defaultData) {
    return null;
  }

  return (
    <>
      <WhiteBox.Header type={'h1'} icon={<IconDeprecated name={'settingsOrange'} />} iconStyles={{ color: '#F57B23' }}>
        Настройки контура
      </WhiteBox.Header>

      {appIsClient ? (
        <>
          <div className={`${CLS}__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.limitTimeOrderExecutionStart')}>
              <div className={`settings-page__hint-title`}>
                Временные ограничения по исполнениям рейса {<Ant.Icon type={'info-circle'} />}
              </div>
            </Ant.Tooltip>
          </div>
          <VzForm.Group>
            <VzForm.Row>
              <VzForm.Col span={12}>
                <VzForm.Item label={'Ограничение Времени начала исполнения Рейсов (в часах)'}>
                  <Ant.InputNumber
                    placeholder={'Введите время в часах'}
                    allowClear={true}
                    decimalSeparator={','}
                    min={0}
                    max={24}
                    step={1}
                    value={limitTimeOrderExecutionStart}
                    onChange={(e) => changeContourSettings({ limitTimeOrderExecutionStart: e })}
                  />
                </VzForm.Item>
              </VzForm.Col>
            </VzForm.Row>
          </VzForm.Group>
        </>
      ) : null}

      {appIsClient ? (
        <>
          <div className={`${CLS}__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.timeout')}>
              <div className={`settings-page__hint-title`}>
                Управление просроченными рейсами {<Ant.Icon type={'info-circle'} />}
              </div>
            </Ant.Tooltip>
          </div>
          <SettingsTimeoutForm
            title={'Время отсрочки автоматической отмены Рейсов'}
            type={'timeoutForCancelingOrdersInMin'}
            values={{ ...timeoutForCancelingOrdersInMin }}
            onSave={(values) => changeContourSettings({ timeoutForCancelingOrdersInMin: values })}
          />
          <SettingsTimeoutForm
            title={'Время для указания проблемы на Рейсы без Исполнителя'}
            type={'timeoutForCreatingProblemsOrdersInMin'}
            values={{ ...timeoutForCreatingProblemsOrdersInMin }}
            onSave={(values) => changeContourSettings({ timeoutForCreatingProblemsOrdersInMin: values })}
          />
        </>
      ) : null}
      <div className={`settings-form__group__title`}>
        <Ant.Tooltip placement="right" title={t.settings(`hint.vehicleTypes.${APP}`)}>
          <div className={`settings-page__hint-title`}>Настройка Типов ТС{<Ant.Icon type={'info-circle'} />}</div>
        </Ant.Tooltip>
      </div>
      <Ant.Collapse className={'order-advanced-options'}>
        <Ant.Collapse.Panel header="Показать/скрыть настройки типов ТС" key="1">
          <VehicleTypes dataSource={systemVehicleTypes} getVehicleTypes={getVehicleTypes} />
        </Ant.Collapse.Panel>
      </Ant.Collapse>

      {appIsDispatcher ? (
        <>
          <div className={`settings-form__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.republish')}>
              <div className={`settings-page__hint-title`}>
                Настройки перепубликации {<Ant.Icon type={'info-circle'} />}
              </div>
            </Ant.Tooltip>
          </div>
          <Ant.Collapse className={'order-advanced-options'}>
            <Ant.Collapse.Panel header="Показать/скрыть настройки перепубликации" key="1">
              <SettingsContourForm title={'Торги'} values={{ ...bargain, type: 'bargain' }} onSave={setBargain} />
              <SettingsContourForm title={'Ставка'} values={{ ...rate, type: 'rate' }} onSave={setRate} />
              <SettingsContourForm title={'Тариф'} values={{ ...tariff, type: 'tariff' }} onSave={setTariff} />
            </Ant.Collapse.Panel>
          </Ant.Collapse>
        </>
      ) : null}

      {appIsDispatcher ? (
        <>
          <div className={`settings-form__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.bargains')}>
              <div className={`settings-page__hint-title`}>Настройки торгов {<Ant.Icon type={'info-circle'} />}</div>
            </Ant.Tooltip>
          </div>

          <SettingsBargainForm values={bargainData} setValues={setBargainData} />
        </>
      ) : null}
      {appIsClient ? (
        <VzForm.Actions className={'settings-form__actions'}>
          <Ant.Button type="primary" onClick={onSave} className={cn('semi-wide', { disabled: !isCanSave })}>
            Сохранить
          </Ant.Button>
        </VzForm.Actions>
      ) : null}
    </>
  );
}

SettingContour.propTypes = {
  transportOrderStatuses: PropTypes.object,
};

export default compose([observer])(SettingContour);
