import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm, WhiteBox, IconDeprecated, showError } from '@vezubr/elements';
import { Profile as ProfileService } from '@vezubr/services';
import cn from 'classnames';
import t from '@vezubr/common/localization';
import { useSelector } from 'react-redux';
import Identifier from '../settings-identifier-form';
import SettingsDelegationForm from '../settings-delegation-form';
import _pick from 'lodash/pick';
import _isEqual from 'lodash/isEqual';
import { Utils } from '@vezubr/common/common';
import Templates from '../settings-templates-form';
const CARGO_PLACE_ACCOUNTING_CHANGES = [
  {
    key: 0,
    value: false,
    text: 'Офомлять рейсы без учета грузомест',
  },
  {
    key: 1,
    value: true,
    text: 'Оформлять рейсы с учетом грузомест',
  },
];

const MODES_VEHICLE_TYPES_TO_WORK = [
  {
    key: 0,
    value: 'all',
    text: 'Со всеми типами ТС',
  },
  {
    key: 1,
    value: 'own',
    text: 'Только с типами ТС, указанных в собственном контуре',
  },
];

const VEHICLE_ASSIGN_TYPES = [
  {
    key: 0,
    value: 1,
    text: 'Только ТС, удовлетворяющие Требования Рейса',
  },
  {
    key: 1,
    value: 2,
    text: 'Назначать все ТС, игнорируя Требования Рейса',
  },
];

const ASSIGN_ACTIVE_ORDERS = [
  {
    key: 0,
    value: true,
    text: 'Да',
  },
  {
    key: 1,
    value: false,
    text: 'Нет',
  },
];

const FIELDS = {
  cargoPlaceAccounting: 'cargoPlaceAccounting',
  modeVehicleTypesToWork: 'modeVehicleTypesToWork',
  vehicleAssignType: 'vehicleAssignType',
  monitorFilter: 'monitorFilter',
  assignFromActiveOrder: 'assignFromActiveOrder',
  executableOrderTypes: 'executableOrderTypes',
  regionsOfWork: 'regionsOfWork',
  todayDelegation: 'todayDelegation',
  futureDelegation: 'futureDelegation',
  numerationType: 'numerationType',
};

const DELEGATION_FIELDS = ['todayDelegation', 'futureDelegation'];

const CLS = 'settings-form';

const ORDERS_OPTIONS = [
  {
    key: 0,
    value: 1,
    text: 'Городской',
  },
  {
    key: 1,
    value: 2,
    text: 'ПРР',
  },
  {
    key: 2,
    value: 3,
    text: 'Междугородний',
  },
  {
    key: 3,
    value: 4,
    text: 'Международный',
  },
];

const MODES_VIEW_ORDERS_IN_MONITOR = [
  {
    key: 0,
    value: true,
    text: 'Все рейсы',
  },
  {
    key: 1,
    value: false,
    text: 'Только рейсы за которые я ответственнен',
  },
];

const SettingsCompanyForm = ({ onSave, form, saveTrigger, values = {}, edited }) => {
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  const dictionaries = useSelector((state) => state.dictionaries);

  const appIsClient = ['client', 'dispatcher'].includes(APP);
  const appIsProducer = ['producer', 'dispatcher'].includes(APP);

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      if (onSave) {
        onSave(form);
      }
    },
    [form, onSave],
  );

  const handleChangeDelegation = async (type, val) => {
    const data = {
      [FIELDS.todayDelegation]: getFieldValue(FIELDS.todayDelegation),
      [FIELDS.futureDelegation]: getFieldValue(FIELDS.futureDelegation),
    };
    const newData = {
      ...data,
      [type]: val,
    };
    try {
      await ProfileService.setDelegation(newData);
      setFieldsValue({
        [type]: val,
      });
    } catch (e) {
      showError(e);
      console.error(e);
    }
  };

  const vehicleAssignTypesOptions = useMemo(
    () =>
      VEHICLE_ASSIGN_TYPES.map((item) => (
        <Ant.Select.Option key={item.key} value={item.value}>
          {item.text}
        </Ant.Select.Option>
      )),
    [VEHICLE_ASSIGN_TYPES],
  );

  const modesVehicleTypesToWorkOptions = useMemo(
    () =>
      MODES_VEHICLE_TYPES_TO_WORK.map((item) => (
        <Ant.Select.Option key={item.key} value={item.value}>
          {item.text}
        </Ant.Select.Option>
      )),
    [MODES_VEHICLE_TYPES_TO_WORK],
  );

  const cargoPlaceOptions = useMemo(
    () =>
      CARGO_PLACE_ACCOUNTING_CHANGES.map((item) => (
        <Ant.Select.Option key={item.key} value={item.value}>
          {item.text}
        </Ant.Select.Option>
      )),
    [CARGO_PLACE_ACCOUNTING_CHANGES],
  );

  const regionWorkOptions = useMemo(
    () =>
      dictionaries?.regions?.map((el) => (
        <Ant.Select.Option title={el.title} value={parseInt(el.id)} key={el.id}>
          {el.title}
        </Ant.Select.Option>
      )),
    [dictionaries?.regions],
  );

  const assignToActiveOrders = useMemo(
    () =>
      ASSIGN_ACTIVE_ORDERS.map((item) => (
        <Ant.Select.Option key={item.key} value={item.value}>
          {item.text}
        </Ant.Select.Option>
      )),
    [ASSIGN_ACTIVE_ORDERS],
  );

  const ordersOptions = useMemo(
    () =>
      ORDERS_OPTIONS.map((item) => (
        <Ant.Select.Option key={item.key} value={item.value}>
          {item.text}
        </Ant.Select.Option>
      )),
    [ORDERS_OPTIONS],
  );

  const numerationTypes = useMemo(() => ([
    {
      id: 'numeration_client',
      title: <Ant.Tooltip placement="right" title={t.settings('hint.customNumeration')}>
        <div className={`settings-page__hint-title`}>
          Использовать собственную Нумерацию {<Ant.Icon type={'info-circle'} />}
        </div>
      </Ant.Tooltip>
    },
    {
      id: 'numeration_vezubr',
      title: 'Использовать нумерацию Везубр'
    },
  ]), []);
  return (
    <Ant.Form layout="vertical" onSubmit={handleSave}>
      {appIsClient ? (
        <VzForm.Group>
          <div className={`${CLS}__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.templates')}>
              <div className={`settings-page__hint-title`}>
                Настройка дополнительных полей в заявке и договоре-заявке {<Ant.Icon type={'info-circle'} />}
              </div>
            </Ant.Tooltip>
          </div>
          <Templates saveTrigger={saveTrigger} />
        </VzForm.Group>
      ) : null}

      {appIsProducer ? (
        <VzForm.Group>
          <div className={`${CLS}__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.modeVehicleTypesToWork')}>
              <div className={`settings-page__hint-title`}>
                Видимость заказов и варианты назначения ТС {<Ant.Icon type={'info-circle'} />}
              </div>
            </Ant.Tooltip>
          </div>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item label={'Получать заказы в ЛК'}>
                {getFieldDecorator(FIELDS.modeVehicleTypesToWork, {
                  initialValue: values?.[FIELDS.modeVehicleTypesToWork],
                })(<Ant.Select showSearch={true}>{modesVehicleTypesToWorkOptions}</Ant.Select>)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item label={'Сценарий назначения ТС на рейс'}>
                {getFieldDecorator(FIELDS.vehicleAssignType, {
                  initialValue: values?.[FIELDS.vehicleAssignType],
                })(<Ant.Select showSearch={true}>{vehicleAssignTypesOptions}</Ant.Select>)}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            <VzForm.Col span={24}>
              <VzForm.Item label={'Назначать на рейс исполнителя при наличии активного рейса'}>
                {getFieldDecorator(FIELDS.assignFromActiveOrder, {
                  initialValue: values?.[FIELDS.assignFromActiveOrder],
                })(<Ant.Select showSearch={true}>{assignToActiveOrders}</Ant.Select>)}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      ) : null}

      {appIsProducer ? (
        <VzForm.Group style={{ padding: 10 }}>
          <div className={`${CLS}__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.executableOrderTypes')}>
              <div className={`settings-page__hint-title`}>
                Готовность выполнять рейсы {<Ant.Icon type={'info-circle'} />}
              </div>
            </Ant.Tooltip>
          </div>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item label={'Типы рейсов которые готов выполнять'}>
                {getFieldDecorator(FIELDS.executableOrderTypes, {
                  initialValue: values?.[FIELDS.executableOrderTypes],
                })(<Ant.Select mode={'multiple'}>{ordersOptions}</Ant.Select>)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item label={'Регионы в которых готов выполнять рейсы'}>
                {getFieldDecorator(FIELDS.regionsOfWork, {
                  initialValue: values?.[FIELDS.regionsOfWork],
                })(
                  <Ant.Select mode={'multiple'} optionFilterProp={'title'} allowClear={true}>
                    {regionWorkOptions}
                  </Ant.Select>,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      ) : null}

      {appIsClient ? (
        <VzForm.Group >
          <div className={`${CLS}__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.cargoPlaces')}>
              <div className={`settings-page__hint-title`}>Грузоместа {<Ant.Icon type={'info-circle'} />}</div>
            </Ant.Tooltip>
          </div>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item label="Учет грузомест в рейсе">
                {getFieldDecorator(FIELDS.cargoPlaceAccounting, {
                  initialValue: values?.[FIELDS.cargoPlaceAccounting],
                })(<Ant.Select>{cargoPlaceOptions}</Ant.Select>)}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      ) : null}

      {APP === 'client' && (
        <VzForm.Group>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item label={"Выбор используемой нумерации"}>
                {getFieldDecorator(FIELDS.numerationType, {
                  initialValue: values?.[FIELDS.numerationType],
                })(
                  <Ant.Select >
                    {numerationTypes.map(el => (
                      <Ant.Select.Option value={el.id} key={el.id}>
                        {el.title}
                      </Ant.Select.Option>
                    ))}
                  </Ant.Select>
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      )}

      {appIsClient ? (
        <VzForm.Group>
          <div className={`${CLS}__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.identifier')}>
              <div className={`settings-page__hint-title`}>Настройка нумерации {<Ant.Icon type={'info-circle'} />}</div>
            </Ant.Tooltip>
          </div>
          <Identifier numerationType={getFieldValue(FIELDS.numerationType)} saveTrigger={saveTrigger} />
        </VzForm.Group>
      ) : null}

      {appIsProducer ? (
        <VzForm.Group>
          <div className={`${CLS}__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.settingsDelegation')}>
              <div className={`settings-page__hint-title`}>
                Делегирование водителям {<Ant.Icon type={'info-circle'} />}
              </div>
            </Ant.Tooltip>
          </div>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item label={t.order('Сегодня')}>
                {getFieldDecorator(FIELDS.todayDelegation, {
                  initialValue: values?.[FIELDS.todayDelegation],
                })(
                  <VzForm.FieldSwitch
                    checked={getFieldValue(FIELDS.todayDelegation)}
                    checkedTitle={'Да'}
                    unCheckedTitle={'Нет'}
                    onChange={(value) => {
                      handleChangeDelegation(FIELDS.todayDelegation, value);
                    }}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item label={t.order('На будущее')}>
                {getFieldDecorator(FIELDS.futureDelegation, {
                  initialValue: values?.[FIELDS.futureDelegation],
                })(
                  <VzForm.FieldSwitch
                    checked={getFieldValue(FIELDS.futureDelegation)}
                    checkedTitle={'Да'}
                    unCheckedTitle={'Нет'}
                    onChange={(value) => {
                      handleChangeDelegation(FIELDS.futureDelegation, value);
                    }}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      ) : null}

      <VzForm.Actions className={`${CLS}__actions`}>
        <Ant.Button disabled={!edited} type="primary" onClick={handleSave} className={`semi-wide`}>
          Сохранить
        </Ant.Button>
      </VzForm.Actions>
    </Ant.Form>
  );
};

SettingsCompanyForm.propTypes = {
  onSave: PropTypes.func,
  form: PropTypes.object,
  values: PropTypes.object,
};

export default Ant.Form.create({
  name: 'settings_form',
  onValuesChange: ({ setEdited, values }, changedValues) => {
    if (
      typeof changedValues?.futureDelegation === 'undefined' &&
      typeof changedValues?.todayDelegation === 'undefined'
    ) {
      setEdited(true);
    }
  },
})(SettingsCompanyForm);
