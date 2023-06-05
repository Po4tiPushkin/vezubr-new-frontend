import React, { useMemo, useCallback, useEffect } from 'react';
import t from '@vezubr/common/localization';
import { Ant, ButtonDeprecated, VzForm } from '@vezubr/elements';
import InputMask from "react-input-mask";
import _isEqual from 'lodash/isEqual'

const FIELDS = {
  id: 'id',
  addressLegal: 'addressLegal',
  inn: 'inn',
  addressFact: 'addressFact',
  fullName: 'fullName',
  name: 'name',
  addressPost: 'addressPost',
  phone: 'phone',
  vatRate: 'vatRate',
};

const IS_COST_WITH_VAT_OPTIONS = [
  {
    value: true,
    title: 'С НДС',
  },
  {
    value: false,
    title: 'Без НДС',
  },
]

const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';
const PHONE_MASK = '+7 (999) 999-99-99';

const MainForm = (props) => {
  const {
    form,
    values,
    dictionaries
  } = props;
  const { vatRate } = dictionaries;
  const { getFieldError, getFieldDecorator, getFieldValue } = form;

  const vatRateOptions = useMemo(
    () =>
      vatRate && Object.values(vatRate).map((item) => (
        <Ant.Select.Option key={item?.id} value={item?.id}>
          {item?.title}
        </Ant.Select.Option>
      )) || null,
    [vatRate],
  );

  return (
    <div className={'flexbox size-1 column'}>
      <div className={'company-info'}>
        <h2 className={'company-info-title bold'}>{t.profile('companyInfoTitle')}</h2>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={'ID'} error={getFieldError(FIELDS.id)}>
              {getFieldDecorator(FIELDS.id, {
                initialValue: values?.[FIELDS.id] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={t.profile('addressLegal')} error={getFieldError(FIELDS.addressLegal)}>
              {getFieldDecorator(FIELDS.addressLegal, {
                initialValue: values?.[FIELDS.addressLegal] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={t.profile('inn')} error={getFieldError(FIELDS.inn)}>
              {getFieldDecorator(FIELDS.inn, {
                initialValue: values?.[FIELDS.inn] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={t.profile('fullName')} error={getFieldError(FIELDS.fullName)}>
              {getFieldDecorator(FIELDS.fullName, {
                initialValue: values?.[FIELDS.fullName] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item
              disabled={true}
              label={`${t.profile('addressFact')} (${t.common('optional')})`}
              error={getFieldError(FIELDS.addressFact)}
            >
              {getFieldDecorator(FIELDS.addressFact, {
                initialValue: values?.[FIELDS.addressFact] || '',
              })(<Ant.Input disabled={true} placeholder={'Укажите адрес'} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={t.profile('addressPost')} disabled={true} error={getFieldError(FIELDS.addressPost)}>
              {getFieldDecorator(FIELDS.addressPost, {
                initialValue: values?.[FIELDS.addressPost] || '',
              })(<Ant.Input disabled={true} placeholder={'Укажите адрес'} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={t.profile('phone')} disabled={true} error={getFieldError(FIELDS.phone)}>
              {getFieldDecorator(FIELDS.phone, {
                initialValue: values?.[FIELDS.phone] || '',
              })(
                <InputMask disabled={true} mask={PHONE_MASK}>
                  <Ant.Input placeholder={PHONE_PLACEHOLDER} allowClear={true} />
                </InputMask>
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={t.profile('nds')} disabled={true} error={getFieldError(FIELDS.vatRate)}>
              {getFieldDecorator(FIELDS.vatRate, {
                initialValue: (!!parseInt(values?.[FIELDS.vatRate]) + 1) || null,
              })(
                <Ant.Select
                  placeholder={t.order('selectFromList')}
                  allowClear={true}
                  showSearch={true}
                  optionFilterProp={'children'}
                  disabled={true}
                >
                  {vatRateOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </div>
    </div>
  );
};

export default Ant.Form.create({})(MainForm);
