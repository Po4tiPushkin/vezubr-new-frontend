import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import AddressMapPicker from './address-map-picker';
import { useHistory } from 'react-router-dom';
import { Ant, showError, VzForm } from '@vezubr/elements';
import AddressFormComponentGooglePlace from '@vezubr/address/from-components/address-form-component-google-place';

import { Organization as DDService, GeoCoding as GeoCodingService } from '@vezubr/services';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import { Utils } from '@vezubr/common/common';

import TooltipError from '@vezubr/elements/form/controls/tooltip-error';
import cn from 'classnames';
import * as Address from '@vezubr/address';
import { useSelector } from 'react-redux';
import ExistingAddressModal from '@vezubr/components/existingAdressesModal';

const FIELDS = {
  addressOriginal: 'addressOriginal',
  addressString: 'addressString',
  attachedFiles: 'attachedFiles',
  addressType: 'addressType',
  addressTypeComment: 'addressTypeComment',
  cityFiasId: 'cityFiasId',
  comment: 'comment',
  cart: 'cart',
  cityName: 'cityName',
  externalId: 'externalId',
  elevator: 'elevator',
  isFavorite: 'isFavorite',
  latitude: 'latitude',
  longitude: 'longitude',
  loadingType: 'loadingType',
  maxHeightFromGroundInCm: 'maxHeightFromGroundInCm',
  necessaryPass: 'necessaryPass',
  status: 'status',
  title: 'title',
  pointOwnerInn: 'pointOwnerInn',
  pointOwnerKpp: 'pointOwnerKpp',
  createdByFullName: 'createdByFullName',
  verifiedByFullName: 'verifiedByFullName',
  timezone: 'timezone',
  statusFlowType: 'statusFlowType',
  liftingCapacityMax: 'liftingCapacityMax',
};

export const validators = {
  [FIELDS.addressString]: (addressString) => !addressString && 'Введите адрес',
  [FIELDS.pointOwnerInn]: (inn) =>
    inn &&
    inn?.replace(/\d{10}/g, '-') !== '-' &&
    inn?.replace(/\d{12}/g, '-') !== '-' &&
    'ИНН должен состоять из 10 или 12 цифр',
  [FIELDS.title]: (title) => title && title?.length < 3 && 'Минимальная длина 3 символа',
};

function getFieldInitialValue(fieldName, values) {
  switch (fieldName) {
    case FIELDS.maxHeightFromGroundInCm:
      return values?.[fieldName] || 0;
    case FIELDS.elevator:
    case FIELDS.necessaryPass:
    case FIELDS.cart:
    case FIELDS.isFavorite:
      return values?.[fieldName] ? 1 : 0;
    case FIELDS.status:
      return values?.[fieldName] ? 1 : 0;
    case FIELDS.loadingType:
      return values?.[fieldName] || '1';
    case FIELDS.statusFlowType:
      return values?.[fieldName] || null;
    default:
      return values?.[fieldName] || '';
  }
}

const AddressMainForm = (props) => {
  const {
    onSave,
    onCancel,
    onEdit,
    form,
    values,
    disabled,
    mode,
    loadingTypes,
    addressTypes,
    onInit,
    disabledSubmit,
    checkOnInit,
    handleDelete,
    onChange,
    delegated = false,
  } = props;
  const { getFieldError, getFieldDecorator, setFieldsValue, getFieldValue } = form;

  const rules = VzForm.useCreateAsyncRules(validators);

  const dictionaries = useSelector((state) => state.dictionaries);
  const user = useSelector((state) => state.user);
  const history = useHistory();

  const prevValues = usePrevious(values);

  const [mapUpdatedHash, setMapUpdatedHash] = useState(Utils.uuid);
  const [existingAddressModalVisible, setExistingAddressModalVisible] = React.useState(false);
  const [existingAddresses, setExistingAddresses] = React.useState([]);

  const mapRef = useRef(null);

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      if (onSave) {
        onSave(form);
      }
    },
    [form, onSave],
  );

  const handleCancel = useCallback(
    (e) => {
      e.preventDefault();
      if (onCancel) {
        onCancel(form);
      }
    },
    [form, onCancel],
  );

  const fetchTimeZone = useCallback(
    async ({ latitude, longitude }) => {
      try {
        const response = await GeoCodingService.getTimeZone(latitude, longitude);
        if (response?.timeZoneId) {
          setFieldsValue({
            [FIELDS.timeZoneId]: response?.timeZoneId,
          });
        }
      } catch (e) {
        console.error(e);
        showError(e);
      }
    },
    [setFieldsValue],
  );

  const setCoordinate = useCallback(
    ({ latitude, longitude }) => {
      fetchTimeZone({ latitude, longitude });

      setFieldsValue({
        [FIELDS.latitude]: latitude,
        [FIELDS.longitude]: longitude,
      });

      const map = mapRef.current?.leafletElement;
      if (map && latitude && longitude) {
        map.setView([latitude, longitude]);
      }
    },
    [setFieldsValue],
  );

  const onChooseFromExisting = React.useCallback((address) => {
    history.push(`/addresses/${address.id}`);
  }, []);

  const onUpdatePositionFromMap = useCallback(
    async ({ lat: latitude, lng: longitude }) => {
      if (mode !== 'edit') {
        const existingAddressesResp = await Utils.checkForAlreadyExistingAddresses({
          latitude,
          longitude,
          setExistingAddressModalVisible,
          client: user.id,
        });
        if (existingAddressesResp.length > 0) {
          setExistingAddresses(existingAddressesResp);
        }
      }
      fetchTimeZone({ latitude, longitude });

      setFieldsValue({
        [FIELDS.latitude]: latitude,
        [FIELDS.longitude]: longitude,
      });

      setMapUpdatedHash(Utils.uuid);
    },
    [setFieldsValue, mode],
  );

  const prevMapUpdatedHash = usePrevious(mapUpdatedHash);
  const updatedFromMap = prevMapUpdatedHash && prevMapUpdatedHash !== mapUpdatedHash;

  const point = {
    position: values?.position,
    latitude: getFieldValue(FIELDS.latitude) || values?.[FIELDS.latitude],
    longitude: getFieldValue(FIELDS.longitude) || values?.[FIELDS.longitude],
  };

  const addressTypesOptions = useMemo(
    () =>
      addressTypes.map((item) => (
        <Ant.Select.Option key={item.id} value={item.id}>
          {item.title}
        </Ant.Select.Option>
      )),
    [addressTypes],
  );

  const loadingTypesOptions = useMemo(
    () =>
      loadingTypes.map((item) => (
        <Ant.Select.Option key={item.id.toString()} value={item.id.toString()}>
          {item.title}
        </Ant.Select.Option>
      )),
    [loadingTypes],
  );

  const statusesFlowTypeOptions = useMemo(() => {
    return dictionaries.contractorPointFlowTypes.map((item) => (
      <Ant.Select.Option key={item.id} value={item.id}>
        {item.title}
      </Ant.Select.Option>
    ));
  }, [dictionaries]);

  const timeOutUpdater = useRef(0);

  useEffect(() => {
    if (onInit) {
      setTimeout(() => onInit(form), 150);
    }
  }, [onInit]);

  useEffect(() => {
    if (checkOnInit && mode === 'edit') {
      setTimeout(() => VzForm.Utils.validateFieldsFromAntForm(form), 160);
    }
  }, [checkOnInit, mode]);

  const addressTypeChange = (val) => {
    if (parseInt(val) === 1) {
      setFieldsValue({
        [FIELDS.addressType]: val,
        [FIELDS.statusFlowType]: 'shortFlow',
      });
    } else {
      setFieldsValue({
        [FIELDS.addressType]: val,
        [FIELDS.statusFlowType]: 'fullFlow',
      });
    }
  };

  return (
    <Ant.Form className="address-form" layout="vertical" onSubmit={handleSave}>
      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Название'} error={getFieldError(FIELDS.title)}>
              {getFieldDecorator(FIELDS.title, {
                // rules: rules[FIELDS.title](),
                initialValue: getFieldInitialValue(FIELDS.title, values),
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Тип адреса'} error={getFieldError(FIELDS.addressType)}>
              {getFieldDecorator(FIELDS.addressType, {
                rules: rules[FIELDS.addressType](),
                initialValue: getFieldInitialValue(FIELDS.addressType, values),
              })(
                <Ant.Select
                  placeholder={''}
                  allowClear={true}
                  showSearch={true}
                  optionFilterProp={'children'}
                  disabled={disabled}
                  onChange={(val) => addressTypeChange(val)}
                >
                  {addressTypesOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Статус'} error={getFieldError(FIELDS.status)}>
              {getFieldDecorator(FIELDS.status, {
                initialValue: getFieldInitialValue(FIELDS.status, values),
              })(
                <VzForm.FieldSwitch
                  checked={!!getFieldValue(FIELDS.status)}
                  checkedTitle={'Активный'}
                  unCheckedTitle={'Неактивный'}
                  disabled={disabled}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <VzForm.Col span={16}>
            {mode === 'view' ? (
              <VzForm.Item
                disabled={disabled}
                label={'Подтвержденный адрес'}
                error={getFieldError(FIELDS.addressString)}
                name={FIELDS.addressString}
              >
                {getFieldDecorator(FIELDS.addressString, {
                  rules: rules[FIELDS.addressString](),
                  initialValue: getFieldInitialValue(FIELDS.addressString, values),
                })(<Ant.Input placeholder={''} disabled={disabled} />)}
              </VzForm.Item>
            ) : (
              <AddressFormComponentGooglePlace
                form={form}
                rules={rules}
                updatedFromMap={updatedFromMap}
                address={values}
                setCoordinate={setCoordinate}
                disabled={mode === 'view'}
                initialValue={values?.[FIELDS.addressString]}
                placeholder={values?.[FIELDS.addressString]}
                name={FIELDS.addressString}
              />
            )}
          </VzForm.Col>
          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Подтвердил'} error={getFieldError(FIELDS.verifiedByFullName)}>
              {getFieldDecorator(FIELDS.verifiedByFullName, {
                rules: rules[FIELDS.verifiedByFullName](),
                initialValue: getFieldInitialValue(FIELDS.verifiedByFullName, values),
              })(<Ant.Input placeholder={''} disabled={true} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Широта'} error={getFieldError(FIELDS.externalId)}>
              {getFieldDecorator(FIELDS.latitude, {
                rules: rules[FIELDS.latitude](),
                initialValue: getFieldInitialValue(FIELDS.latitude, values),
              })(<Ant.Input placeholder={''} disabled={true} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Долгота'} error={getFieldError(FIELDS.cityName)}>
              {getFieldDecorator(FIELDS.longitude, {
                rules: rules[FIELDS.longitude](),
                initialValue: getFieldInitialValue(FIELDS.longitude, values),
              })(<Ant.Input placeholder={''} disabled={true} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Таймзона'} error={getFieldError(FIELDS.timezone)}>
              {getFieldDecorator(FIELDS.timezone, {
                rules: rules[FIELDS.timezone](),
                initialValue: getFieldInitialValue(FIELDS.timezone, values),
              })(<Ant.Input placeholder={''} disabled={true} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8} style={{ visibility: 'hidden', width: '0', height: '0', padding: '0' }}>
            <VzForm.Item disabled={disabled} label={'Город'} error={getFieldError(FIELDS.cityName)}>
              {getFieldDecorator(FIELDS.cityName, {
                rules: rules[FIELDS.cityName](),
                initialValue: getFieldInitialValue(FIELDS.cityName, values),
              })(<Ant.Input placeholder={''} disabled={true} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <VzForm.Col span={24}>
            <div className={'address-edit-form__map'}>
              {mode === 'view' ? (
                <AddressMapPicker point={point} />
              ) : (
                <AddressMapPicker ref={mapRef} point={point} viewRoute={false} onChange={onUpdatePositionFromMap} />
              )}
            </div>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <VzForm.Col span={16}>
            <VzForm.Item disabled={disabled} label={'Адрес по API'} error={getFieldError(FIELDS.addressOriginal)}>
              {getFieldDecorator(FIELDS.addressOriginal, {
                rules: rules[FIELDS.addressOriginal](),
                initialValue: getFieldInitialValue(FIELDS.addressOriginal, values),
              })(<Ant.Input placeholder={''} disabled={true} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'ID адреса партнёра'} error={getFieldError(FIELDS.externalId)}>
              {getFieldDecorator(FIELDS.externalId, {
                rules: rules[FIELDS.externalId](),
                initialValue: getFieldInitialValue(FIELDS.externalId, values),
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <Address.EditorFields.PointOwnerFields
            form={form}
            values={values}
            disabled={disabled}
            fields={FIELDS}
            rules={rules}
            span={8}
          />

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Вид погрузки'} error={getFieldError(FIELDS.loadingType)}>
              <div>
                {getFieldDecorator(FIELDS.loadingType, {
                  rules: rules[FIELDS.loadingType](),
                  initialValue: getFieldInitialValue(FIELDS.loadingType, values),
                })(
                  <Ant.Select allowClear={true} showSearch={true} optionFilterProp={'children'} disabled={disabled}>
                    {loadingTypesOptions}
                  </Ant.Select>,
                )}
                <TooltipError error={getFieldError(FIELDS.loadingType)} />
              </div>
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Создал'} error={getFieldError(FIELDS.createdByFullName)}>
              {getFieldDecorator(FIELDS.createdByFullName, {
                rules: rules[FIELDS.createdByFullName](),
                initialValue: getFieldInitialValue(FIELDS.createdByFullName, values),
              })(<Ant.Input placeholder={''} disabled={true} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item
              disabled={disabled}
              label={'Максимальная высота ТС, м'}
              error={getFieldError(FIELDS.maxHeightFromGroundInCm)}
            >
              {getFieldDecorator(FIELDS.maxHeightFromGroundInCm, {
                rules: rules[FIELDS.maxHeightFromGroundInCm](),
                initialValue: getFieldInitialValue(FIELDS.maxHeightFromGroundInCm, values) || '',
              })(
                <Ant.InputNumber
                  placeholder={''}
                  min={0}
                  disabled={disabled}
                  allowClear={true}
                  decimalSeparator={','}
                  step={0.01}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item
              disabled={disabled}
              label={'Максимальная Грузоподьемность ТС, кг'}
              error={getFieldError(FIELDS.liftingCapacityMax)}
            >
              {getFieldDecorator(FIELDS.liftingCapacityMax, {
                rules: rules[FIELDS.liftingCapacityMax](),
                initialValue: getFieldInitialValue(FIELDS.liftingCapacityMax, values) || '',
              })(
                <Ant.InputNumber
                  placeholder={''}
                  min={0}
                  disabled={disabled}
                  allowClear={true}
                  decimalSeparator={','}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item
              disabled={disabled}
              label={'Настройка статусов адреса в МП'}
              error={getFieldError(FIELDS.statusFlowType)}
            >
              {getFieldDecorator(FIELDS.statusFlowType, {
                rules: rules[FIELDS.statusFlowType](),
                initialValue: getFieldInitialValue(FIELDS.statusFlowType, values) || '',
              })(
                <Ant.Select placeholder={''} disabled={disabled}>
                  {statusesFlowTypeOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item
              disabled={disabled}
              label={'Пропуск на въезд (Да/Нет)'}
              error={getFieldError(FIELDS.necessaryPass)}
            >
              {getFieldDecorator(FIELDS.necessaryPass, {
                rules: rules[FIELDS.necessaryPass](),
                initialValue: getFieldInitialValue(FIELDS.necessaryPass, values),
              })(
                <VzForm.FieldSwitch
                  checked={!!getFieldValue(FIELDS.necessaryPass)}
                  checkedTitle={'Необходим пропуск'}
                  unCheckedTitle={'нет'}
                  disabled={disabled}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Нужна тележка'} error={getFieldError(FIELDS.cart)}>
              {getFieldDecorator(FIELDS.cart, {
                rules: rules[FIELDS.cart](),
                initialValue: getFieldInitialValue(FIELDS.cart, values),
              })(
                <VzForm.FieldSwitch
                  checked={!!getFieldValue(FIELDS.cart)}
                  checkedTitle={'Нужна тележка'}
                  unCheckedTitle={'нет'}
                  disabled={disabled}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Лифт'} error={getFieldError(FIELDS.elevator)}>
              {getFieldDecorator(FIELDS.elevator, {
                rules: rules[FIELDS.elevator](),
                initialValue: getFieldInitialValue(FIELDS.elevator, values),
              })(
                <VzForm.FieldSwitch
                  checked={!!getFieldValue(FIELDS.elevator)}
                  checkedTitle={'Есть лифт'}
                  unCheckedTitle={'нет'}
                  disabled={disabled}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <VzForm.Item disabled={disabled} label={'Комментарий'} error={getFieldError(FIELDS.comment)}>
              {getFieldDecorator(FIELDS.comment, {
                rules: rules[FIELDS.comment](),
                initialValue: getFieldInitialValue(FIELDS.comment, values),
              })(
                <Ant.Input.TextArea
                  placeholder={''}
                  disabled={disabled}
                  allowClear={true}
                  autoSize={{
                    minRows: 3,
                    maxRows: 10,
                  }}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      {(onCancel || onSave) && (
        <VzForm.Actions>
          {mode === 'view' && (
            <Fragment>
              <Ant.Button disabled={APP === 'dispatcher' ? !delegated : false} onClick={onEdit} type={'primary'}>
                Редактировать
              </Ant.Button>
              <Ant.Button disabled={APP === 'dispatcher' ? !delegated : false} onClick={handleDelete} type={'primary'}>
                Удалить
              </Ant.Button>
            </Fragment>
          )}

          {mode !== 'view' && onCancel && (
            <Ant.Button onClick={handleCancel} type={'dashed'}>
              Отмена
            </Ant.Button>
          )}

          {mode !== 'view' && onSave && (
            <Ant.Button onClick={handleSave} type={'primary'} disabled={disabledSubmit}>
              Сохранить
            </Ant.Button>
          )}
        </VzForm.Actions>
      )}
      <ExistingAddressModal
        onSubmit={onChooseFromExisting}
        existingAddresses={existingAddresses}
        modalVisible={existingAddressModalVisible}
        setModalVisible={setExistingAddressModalVisible}
        modalText={
          'У вас уже есть адреса с такими координатами. Хотите продолжить создание или перейти в карточку одного из них?'
        }
        confirmText={'Перейти в карточку'}
      />
    </Ant.Form>
  );
};

export default Ant.Form.create({
  name: 'address_main_form',

  mapPropsToFields(props) {
    Object.values(FIELDS).map((item) => {
      return {
        item: Ant.Form.createFormField({
          ...props.values?.item,
          value: props.values?.item?.value,
        }),
      };
    });
  },
  onValuesChange(props, _, values) {
    props.onChange(values);
  },
})(AddressMainForm);
