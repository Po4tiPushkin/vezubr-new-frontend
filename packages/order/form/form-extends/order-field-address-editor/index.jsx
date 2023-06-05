import React, { useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Address from '@vezubr/address';
import { Ant, VzForm } from '@vezubr/elements';
import InputMask from 'react-input-mask';
import Animate from 'rc-animate';
import { PHONE_MASK, PHONE_PLACEHOLDER } from '../../constants';
import * as Uploader from '@vezubr/uploader';
import LoadingType from './loadingType';
import { createDateTimeZoneZero } from '@vezubr/common/utils';
import { OrderContext } from '../../context';
import moment from 'moment';
import { useSelector } from 'react-redux';

export const FIELDS = {
  contacts: 'contacts',
  email: 'email',
  phone: 'phone',
  secondPhone: 'secondPhone',
  comment: 'comment',
  titleForFavourites: 'titleForFavourites',
  attachedFiles: 'attachedFiles',
  requiredArriveAt: 'requiredArriveAt',
  isLoadingWork: 'isLoadingWork',
  isUnloadingWork: 'isUnloadingWork',
  pointOwnerInn: 'pointOwnerInn',
  pointOwnerKpp: 'pointOwnerKpp',
  addressType: 'addressType',
  statusFlowType: 'statusFlowType',
  maxHeightFromGroundInCm: 'maxHeightFromGroundInCm',
  necessaryPass: 'necessaryPass',
  elevator: 'elevator',
  cart: 'cart',
  liftingCapacityMax: 'liftingCapacityMax',
};

function OrderFieldAddressEditor(props) {
  const { form, address, rules, loadingTypes, disabledLoadingTypes, canChange = true, orderType } = props;

  const { getFieldError, getFieldDecorator, getFieldValue, setFieldsValue, getFieldsValue } = form;

  const { store } = React.useContext(OrderContext);

  const { addressTypes, contractorPointFlowTypes } = useSelector((state) => state.dictionaries);

  const disabledAddressDateTime = React.useCallback((date) => {
    const { toStartAtDate, toStartAtTime } = store?.data;
    const currentDateTime = moment(`${toStartAtDate} ${toStartAtTime}`, 'YYYY-MM-DD HH:mm');

    return {
      date: date.isBefore(currentDateTime, 'date'),
      time: {
        disabledHours: () => {
          if (date.isSame(currentDateTime, 'date')) {
            return [...Array(currentDateTime.hours()).keys()];
          } else return [];
        },
        disabledMinutes: () => {
          if (date.isSame(currentDateTime, 'date') && date.hours() == currentDateTime.hours()) {
            return [...Array(currentDateTime.minutes()).keys()];
          } else return [];
        },
      },
    };
  }, []);

  const [addressDate, setAddressDate] = useState(null);

  const [keyNewAttached, setKeyNewAttached] = useState(Date.now());
  const isDeliveryOrIntermediateAddress = address.position > 1;

  const addressTypesOptions = useMemo(
    () =>
      addressTypes.map((item) => (
        <Ant.Select.Option key={item.id} value={item.id}>
          {item.title}
        </Ant.Select.Option>
      )),
    [addressTypes],
  );

  const isLoadingWorkDefault =
    typeof address?.[FIELDS.isLoadingWork] !== 'undefined'
      ? address?.[FIELDS.isLoadingWork]
      : !isDeliveryOrIntermediateAddress;

  const isUnloadingWorkDefault =
    typeof address?.[FIELDS.isUnloadingWork] !== 'undefined'
      ? address?.[FIELDS.isUnloadingWork]
      : isDeliveryOrIntermediateAddress;

  const updatedFileAttached = useCallback(
    (fieldData, fieldDataPrev) => {
      if (!fieldData.fileId) {
        return;
      }

      const attachedFiles = getFieldValue(FIELDS.attachedFiles) || [];
      const foundIndex = attachedFiles.findIndex((f) => f.fileId === fieldDataPrev?.fileId);

      let updatedAttachedFiles;

      if (foundIndex === -1) {
        updatedAttachedFiles = [...attachedFiles, fieldData];
        setKeyNewAttached(Date.now());
      } else {
        updatedAttachedFiles = [...attachedFiles];
        updatedAttachedFiles[foundIndex] = fieldData;
      }

      setFieldsValue({ [FIELDS.attachedFiles]: updatedAttachedFiles });
    },
    [setFieldsValue, getFieldValue],
  );

  const setRequiredArriveAt = useCallback(
    (value) => {
      setFieldsValue({ [FIELDS.requiredArriveAt]: value ? value.format('YYYY-MM-DD HH:mm:ss') : '' });
    },
    [setFieldsValue],
  );

  React.useEffect(() => {
    if (address.position === 1) {
      const timeString = store?.data?.toStartAtDate
        ? `${store?.data?.toStartAtDate} ${store?.data?.toStartAtTime || '00:00'}`
        : '';
      setAddressDate(createDateTimeZoneZero(timeString));
    }
  }, [store?.data?.toStartAtDate, store?.data?.toStartAtTime]);

  const handleChangeTypeOperation = useCallback(
    (value) => {
      switch (value) {
        case 'isLoadingWork': {
          setFieldsValue({ [FIELDS.isLoadingWork]: true, [FIELDS.isUnloadingWork]: false });
          break;
        }
        case 'isUnloadingWork': {
          setFieldsValue({ [FIELDS.isLoadingWork]: false, [FIELDS.isUnloadingWork]: true });
          break;
        }
        case 'all': {
          setFieldsValue({ [FIELDS.isLoadingWork]: true, [FIELDS.isUnloadingWork]: true });
          break;
        }
      }
    },
    [setFieldsValue],
  );

  const removeFileAttached = useCallback(
    (fieldData) => {
      if (!fieldData.fileId) {
        return;
      }
      const attachedFiles = getFieldValue(FIELDS.attachedFiles) || [];
      const updatedAttachedFiles = attachedFiles.filter((f) => f.fileId !== fieldData.fileId);

      setFieldsValue({ [FIELDS.attachedFiles]: updatedAttachedFiles });
    },
    [setFieldsValue, getFieldValue],
  );

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

  const statusesFlowTypeOptions = useMemo(() => {
    return contractorPointFlowTypes.map((item) => (
      <Ant.Select.Option key={item.id} value={item.id}>
        {item.title}
      </Ant.Select.Option>
    ));
  }, [contractorPointFlowTypes]);

  const disabledDate = React.useCallback((date) => disabledAddressDateTime(date).date, [disabledAddressDateTime]);

  const disabledTime = React.useCallback((date) => disabledAddressDateTime(date).time, [disabledAddressDateTime]);
  return (
    <>
      <VzForm.Group>
        <VzForm.Row>
          <Address.EditorFields.PointOwnerFields
            form={form}
            values={address}
            fields={FIELDS}
            rules={rules}
            span={12}
            disabled={!canChange}
          />
          <VzForm.Col span={12}>
            <VzForm.Item disabled={!canChange} label={'Тип адреса'} error={getFieldError(FIELDS.addressType)}>
              {getFieldDecorator(FIELDS.addressType, {
                rules: rules[FIELDS.addressType](),
                initialValue: address[FIELDS.addressType],
              })(
                <Ant.Select
                  placeholder={''}
                  allowClear={true}
                  showSearch={true}
                  optionFilterProp={'children'}
                  onChange={(val) => addressTypeChange(val)}
                  disabled={!canChange}
                >
                  {addressTypesOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={12}>
            {getFieldDecorator(FIELDS.isLoadingWork, {
              initialValue: isLoadingWorkDefault,
            })(<Ant.Input type={'hidden'} />)}

            {getFieldDecorator(FIELDS.isUnloadingWork, {
              initialValue: isUnloadingWorkDefault,
            })(<Ant.Input type={'hidden'} />)}

            <VzForm.Item disabled={!canChange} label={'Тип операции'}>
              <Ant.Select
                allowClear={true}
                placeholder={'Выбрать из списка'}
                defaultValue={
                  isLoadingWorkDefault && isUnloadingWorkDefault
                    ? 'all'
                    : isUnloadingWorkDefault
                    ? 'isUnloadingWork'
                    : 'isLoadingWork'
                }
                onChange={handleChangeTypeOperation}
                disabled={!canChange}
              >
                <Ant.Select.Option value="isLoadingWork">Погрузка</Ant.Select.Option>
                <Ant.Select.Option value="isUnloadingWork">Разгрузка</Ant.Select.Option>
                <Ant.Select.Option value="all">Погрузка и Разгрузка</Ant.Select.Option>
              </Ant.Select>
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            {getFieldDecorator(FIELDS.requiredArriveAt, {
              initialValue: address?.[FIELDS.requiredArriveAt] || '',
            })(<Ant.Input type={'hidden'} />)}
            <VzForm.Item disabled={!canChange || address.position === 1} label={'Требуемые дата и время прибытия'}>
              <Ant.DatePicker
                showTime
                format="DD-MM-YYYY HH:mm"
                allowClear={true}
                onChange={setRequiredArriveAt}
                disabled={!canChange || address.position === 1}
                disabledDate={disabledDate}
                disabledTime={disabledTime}
                {...{
                  [address.position == 1 ? 'value' : 'defaultValue']: address?.[FIELDS.requiredArriveAt]
                    ? moment(address?.[FIELDS.requiredArriveAt])
                    : null,
                }}
              />
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <Ant.Collapse>
        <Ant.Collapse.Panel header={'Контактное лицо'}>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <Address.EditorFields.AutocompleteDaData
                form={form}
                initialValue={address?.[FIELDS.contacts] || ''}
                placeholder={'Введите ФИО'}
                timer={500}
                label={'Контактное лицо'}
                rules={rules[FIELDS.contacts]()}
                type={'fio'}
                name={FIELDS.contacts}
                disabled={!canChange}
              />
            </VzForm.Col>
            <VzForm.Col span={12}>
              <Address.EditorFields.AutocompleteDaData
                form={form}
                initialValue={address?.[FIELDS.email] || ''}
                placeholder={'example@info.ru'}
                timer={500}
                label={'Электронная почта (ввод латиницей)'}
                rules={rules[FIELDS.email]()}
                type={'email'}
                name={FIELDS.email}
                disabled={!canChange}
              />
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item
                disabled={!canChange}
                label={'Номер мобильного телефона №1'}
                error={getFieldError(FIELDS.phone)}
              >
                {getFieldDecorator(FIELDS.phone, {
                  rules: rules[FIELDS.phone](),
                  initialValue: address?.[FIELDS.phone] || '',
                })(
                  <InputMask mask={PHONE_MASK} disabled={!canChange}>
                    <Ant.Input placeholder={PHONE_PLACEHOLDER} allowClear={true} />
                  </InputMask>,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item disabled={!canChange} label={'Номер телефона №2'} error={getFieldError(FIELDS.secondPhone)}>
                {getFieldDecorator(FIELDS.secondPhone, {
                  rules: rules[FIELDS.secondPhone](),
                  initialValue: address?.[FIELDS.secondPhone] || '',
                })(
                  <InputMask mask={PHONE_MASK} disabled={!canChange}>
                    <Ant.Input placeholder={PHONE_PLACEHOLDER} allowClear={true} />
                  </InputMask>,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </Ant.Collapse.Panel>
        <Ant.Collapse.Panel header={'Дополнительные параметры'} forceRender={true}>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <LoadingType
                form={form}
                address={address}
                rules={rules}
                loadingTypes={loadingTypes}
                disabledLoadingTypes={disabledLoadingTypes}
                disabled={!canChange}
              />
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item
                disabled={!canChange}
                label={'Настройка статусов адреса в МП'}
                error={getFieldError(FIELDS.statusFlowType)}
              >
                {getFieldDecorator(FIELDS.statusFlowType, {
                  rules: rules[FIELDS.statusFlowType](),
                  initialValue: address[FIELDS.statusFlowType] || '',
                })(
                  <Ant.Select disabled={!canChange} placeholder={''}>
                    {statusesFlowTypeOptions}
                  </Ant.Select>,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item
                disabled={!canChange}
                label={'Максимальная высота ТС, м'}
                error={getFieldError(FIELDS.maxHeightFromGroundInCm)}
              >
                {getFieldDecorator(FIELDS.maxHeightFromGroundInCm, {
                  rules: rules[FIELDS.maxHeightFromGroundInCm](),
                  initialValue: address[FIELDS.maxHeightFromGroundInCm] / 100 || '',
                })(
                  <Ant.InputNumber
                    placeholder={''}
                    disabled={!canChange}
                    min={0}
                    allowClear={true}
                    decimalSeparator={','}
                    step={0.01}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>

            <VzForm.Col span={12}>
              <VzForm.Item
                disabled={!canChange}
                label={'Максимальная Грузоподьемность ТС, кг'}
                error={getFieldError(FIELDS.liftingCapacityMax)}
              >
                {getFieldDecorator(FIELDS.liftingCapacityMax, {
                  rules: rules[FIELDS.liftingCapacityMax](),
                  initialValue: address[FIELDS.liftingCapacityMax] || '',
                })(<Ant.InputNumber
                  placeholder={''}
                  min={0}
                  disabled={!canChange}
                  allowClear={true}
                  decimalSeparator={','}
                />)}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            <VzForm.Col span={8}>
              <VzForm.Item disabled={!canChange} label={'Нужна тележка'} error={getFieldError(FIELDS.cart)}>
                {getFieldDecorator(FIELDS.cart, {
                  rules: rules[FIELDS.cart](),
                  initialValue: address[FIELDS.cart],
                })(
                  <VzForm.FieldSwitch
                    disabled={!canChange}
                    checked={!!getFieldValue(FIELDS.cart)}
                    checkedTitle={'Нужна тележка'}
                    unCheckedTitle={'Нет'}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>

            <VzForm.Col span={8}>
              <VzForm.Item
                label={'Пропуск на въезд (Да/Нет)'}
                disabled={!canChange}
                error={getFieldError(FIELDS.necessaryPass)}
              >
                {getFieldDecorator(FIELDS.necessaryPass, {
                  rules: rules[FIELDS.necessaryPass](),
                  initialValue: address[FIELDS.necessaryPass],
                })(
                  <VzForm.FieldSwitch
                    disabled={!canChange}
                    checked={!!getFieldValue(FIELDS.necessaryPass)}
                    checkedTitle={'Необходим пропуск'}
                    unCheckedTitle={'Нет'}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>

            <VzForm.Col span={8}>
              <VzForm.Item disabled={!canChange} label={'Лифт'} error={getFieldError(FIELDS.elevator)}>
                {getFieldDecorator(FIELDS.elevator, {
                  rules: rules[FIELDS.elevator](),
                  initialValue: address[FIELDS.elevator],
                })(
                  <VzForm.FieldSwitch
                    disabled={!canChange}
                    checked={!!getFieldValue(FIELDS.elevator)}
                    checkedTitle={'Есть лифт'}
                    unCheckedTitle={'Нет'}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            <VzForm.Col span={24}>
              <VzForm.Item label={'Комментарий к адресу'} error={getFieldError(FIELDS.comment)}>
                {getFieldDecorator(FIELDS.comment, {
                  rules: rules[FIELDS.comment](),
                  initialValue: address?.[FIELDS.comment] || '',
                })(
                  <Ant.Input.TextArea
                    allowClear={true}
                    autoSize={{
                      minRows: 1,
                      maxRows: 5,
                    }}
                    disabled={!canChange}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            {getFieldDecorator(FIELDS.attachedFiles, {
              initialValue: address?.[FIELDS.attachedFiles] || [],
            })(<Ant.Input type={'hidden'} />)}

            {(getFieldValue(FIELDS.attachedFiles) || []).map((fileData) => (
              <VzForm.Col key={fileData.fileId} span={12}>
                <Uploader.FormFieldUpload
                  fileData={fileData}
                  label={'Загруженный файл'}
                  onRemove={removeFileAttached}
                  onChange={updatedFileAttached}
                  disabled={!canChange}
                />
              </VzForm.Col>
            ))}

            {canChange && (
              <VzForm.Col span={24}>
                <Uploader.FormFieldUpload
                  key={keyNewAttached}
                  label={'Файл для загрузки'}
                  onChange={updatedFileAttached}
                />
              </VzForm.Col>
            )}
          </VzForm.Row>
        </Ant.Collapse.Panel>
      </Ant.Collapse>
    </>
  );
}

OrderFieldAddressEditor.propTypes = {
  form: PropTypes.object.isRequired,
  address: PropTypes.object,
  loadingTypes: PropTypes.object,
};

export default OrderFieldAddressEditor;
