import React, { useCallback, useMemo, useState } from 'react';
import { Ant, ButtonDeprecated, VzForm } from '@vezubr/elements';
import * as Uploader from '@vezubr/uploader';
import Regions from './additionalValues/regions';
import Categories from './additionalValues/categories';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Validators from '@vezubr/common/common/validators';
import moment from 'moment';
const FIELDS = {
  number: 'number',
  title: 'title',
  file: 'file',
  orderType: 'orderType',
  premiumRate: 'premiumRate',
  minPremium: 'minPremium',
  startsAt: 'startsAt',
  expiresAt: 'expiresAt',
  maxAmountRestriction: 'maxAmountRestriction',
};

const InsurerContractForm = ({ onSave, onCancel, form, values = {}, disabled, loading = false }) => {
  const { getFieldError, getFieldDecorator, setFieldsValue, getFieldValue, getFieldsValue } = form;
  const [restrictedCategoryIds, setRestrictedCategoryIds] = useState(values?.restrictedCategoryIds || []);
  const [restrictedRegionIds, setRestrictedRegionIds] = useState(values?.restrictedRegionIds || [28, 32]);
  const rules = VzForm.useCreateAsyncRules(Validators.createEditInsurerContract);
  const history = useHistory();
  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      const extraData = {
        restrictedCategoryIds,
        restrictedRegionIds,
      };
      if (onSave) {
        onSave(form, extraData);
      }
    },
    [form, onSave, restrictedCategoryIds, restrictedRegionIds],
  );

  const updatedFileAttached = useCallback(
    (fieldData) => {
      if (!fieldData.fileId) {
        return;
      }
      setFieldsValue({ [FIELDS.file]: fieldData });
    },
    [setFieldsValue],
  );

  const disabledStartDate = React.useCallback(
    (date) => {
      const valueFinishDate = getFieldValue(FIELDS.expiresAt);
      if (valueFinishDate) {
        return date.isAfter(valueFinishDate, 'date');
      }
    },
    [getFieldValue],
  );

  const disabledEndDate = React.useCallback(
    (date) => {
      const valueStartDate = getFieldValue(FIELDS.startsAt);
      if (valueStartDate) {
        return date.isBefore(valueStartDate, 'date');
      }
    },
    [getFieldValue],
  );

  return (
    <Ant.Form className="insurer-contract-form" layout="vertical" onSubmit={handleSubmit}>
      <h2 className={'insurer-info-title bold'}>{'Основная Информация'}</h2>
      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item
              required={true}
              disabled={disabled}
              label={'Номер договора'}
              error={getFieldError(FIELDS.number)}
            >
              {getFieldDecorator(FIELDS.number, {
                rules: rules[FIELDS.number](getFieldsValue()),
                initialValue: values?.[FIELDS.number],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item
              required={true}
              disabled={disabled}
              label={'Название договора'}
              error={getFieldError(FIELDS.title)}
            >
              {getFieldDecorator(FIELDS.title, {
                rules: rules[FIELDS.title](getFieldsValue()),
                initialValue: values?.[FIELDS.title],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item
              required={true}
              disabled={disabled}
              label={'Дата подписания'}
              error={getFieldError(FIELDS.startsAt)}
            >
              {getFieldDecorator(FIELDS.startsAt, {
                rules: rules[FIELDS.startsAt](getFieldsValue()),
                initialValue: values?.[FIELDS.startsAt] ? moment(values?.[FIELDS.startsAt]) : null,
              })(
                <Ant.DatePicker
                  placeholder={'дд.мм.гггг'}
                  disabled={disabled}
                  disabledDate={disabledStartDate}
                  allowClear={true}
                  format={'DD.MM.YYYY'}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={disabled} label={'Срок действия договора'} error={getFieldError(FIELDS.expiresAt)}>
              {getFieldDecorator(FIELDS.expiresAt, {
                rules: rules[FIELDS.expiresAt](getFieldsValue()),
                initialValue: values?.[FIELDS.expiresAt] ? moment(values?.[FIELDS.expiresAt]) : null,
              })(
                <Ant.DatePicker
                  placeholder={disabled ? 'Бессрочный' : 'дд.мм.гггг'}
                  disabled={disabled}
                  disabledDate={disabledEndDate}
                  allowClear={true}
                  format={'DD.MM.YYYY'}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item
              disabled={disabled}
              label={'Максимальная объявленная стоимость, руб'}
              error={getFieldError(FIELDS.maxAmountRestriction)}
              required={true}
            >
              {getFieldDecorator(FIELDS.maxAmountRestriction, {
                rules: rules[FIELDS.maxAmountRestriction](getFieldsValue()),
                initialValue: values?.[FIELDS.maxAmountRestriction],
              })(
                <Ant.InputNumber
                  min={0}
                  precision={0}
                  placeholder={''}
                  disabled={disabled}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  allowClear={true}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            {values?.[FIELDS.file] ? (
              <Uploader.FormFieldUpload
                label={'Просмотр договора (PDF)'}
                onChange={updatedFileAttached}
                fileData={{
                  fileType: 'application/pdf',
                  fileId: values?.[FIELDS.file].id,
                  fileNameOrigin: values?.[FIELDS.file].originalName,
                  fileName: values?.[FIELDS.file].originalName,
                  download: `${window.API_CONFIGS[APP].host.replace(/\/$/, '') + values?.[FIELDS.file]?.downloadUrl}`,
                }}
                disabled={disabled}
              />
            ) : (
              <Uploader.FormFieldUpload
                disabled={disabled}
                label={'Загрузите договор (PDF)'}
                onChange={updatedFileAttached}
              />
            )}
          </VzForm.Col>
          <VzForm.Col span={12}>
            {getFieldDecorator(FIELDS.file, {
              initialValue: values?.[FIELDS.file] || [],
            })(<Ant.Input type={'hidden'} />)}
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>
      <VzForm.Group>
        <Ant.Collapse className={'order-advanced-options'}>
          <Ant.Collapse.Panel header="Ограничения по регионам страхования" key="1">
            <Regions editable={!disabled} values={restrictedRegionIds} setValues={setRestrictedRegionIds} />
          </Ant.Collapse.Panel>
        </Ant.Collapse>
        <Ant.Collapse className={'order-advanced-options'}>
          <Ant.Collapse.Panel header="Ограничения по категориям товаров" key="2">
            <Categories editable={!disabled} values={restrictedCategoryIds} setValues={setRestrictedCategoryIds} />
          </Ant.Collapse.Panel>
        </Ant.Collapse>
      </VzForm.Group>
      <VzForm.Group>
        <h2 className={'insurer-info-title bold'}>{'Расчет страховой премии'}</h2>
        <VzForm.Row>
          <VzForm.Col span={8}>
            <VzForm.Item disabled={true} label={'Тип заказа'} error={getFieldError(FIELDS.orderType)}>
              {getFieldDecorator(FIELDS.orderType, {
                rules: rules[FIELDS.orderType](getFieldsValue()),
                initialValue: 'transport',
              })(
                <Ant.Select disabled={true}>
                  <Ant.Select.Option value={'transport'}>Автоперевозка</Ant.Select.Option>
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={8}>
            <VzForm.Item
              required={true}
              disabled={disabled}
              label={'Ставка страховой премии, в %'}
              error={getFieldError(FIELDS.premiumRate)}
            >
              {getFieldDecorator(FIELDS.premiumRate, {
                rules: rules[FIELDS.premiumRate](getFieldsValue()),
                initialValue: values?.[FIELDS.premiumRate],
              })(
                <Ant.InputNumber
                  precision={4}
                  min={0}
                  max={100}
                  placeholder={''}
                  decimalSeparator={','}
                  disabled={disabled}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={8}>
            <VzForm.Item
              required={true}
              disabled={disabled}
              label={'Но не менее, руб'}
              error={getFieldError(FIELDS.minPremium)}
            >
              {getFieldDecorator(FIELDS.minPremium, {
                rules: rules[FIELDS.minPremium](getFieldsValue()),
                initialValue: values?.[FIELDS.minPremium],
              })(<Ant.InputNumber min={1} max={100000} placeholder={''} disabled={disabled} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Actions>
        {onCancel && (
          <Ant.Button onClick={onCancel} loading={loading} className={'semi-wide margin-left-16'} type={'secondary'}>
            Отмена
          </Ant.Button>
        )}

        {onSave && (
          <Ant.Button loading={loading} onClick={handleSubmit} className={'semi-wide margin-left-16'} type={'primary'}>
            Сохранить
          </Ant.Button>
        )}
      </VzForm.Actions>
    </Ant.Form>
  );
};

export default Ant.Form.create({ name: 'insurer-contract_form' })(InsurerContractForm);
