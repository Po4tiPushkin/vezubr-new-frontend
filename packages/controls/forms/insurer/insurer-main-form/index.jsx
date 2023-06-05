import React, { useMemo, useCallback, useEffect } from 'react';
import t from '@vezubr/common/localization';
import { Ant, ButtonDeprecated, VzForm } from '@vezubr/elements';
import { Utils } from '@vezubr/common/common';
import { useSelector } from 'react-redux';
import InputMask from "react-input-mask";
const FIELDS = {
  id: 'id',
  title: 'title',
  inn: 'inn',
  kpp: 'kpp',
  isBlocked: 'isBlocked',
  website: 'website',
  contact: 'contact',
  phone: 'phone'
};

const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';
const PHONE_MASK = '+7 (999) 999-99-99';

const MainForm = (props) => {
  const {
    onSave,
    form,
    values = {},
    disabled
  } = props;

  const { getFieldError, getFieldDecorator, getFieldValue } = form;

  return (
    <div className={'flexbox size-1 column'}>
      <div className={'insurer-info'}>
        <h2 className={'insurer-info-title bold'}>{t.profile('companyInfoTitle')}</h2>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={'ID'}>
              {getFieldDecorator(FIELDS.id, {
                initialValue: values?.[FIELDS.id] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={'Название'}>
              {getFieldDecorator(FIELDS.title, {
                initialValue: values?.[FIELDS.title] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={t.profile('inn')} >
              {getFieldDecorator(FIELDS.inn, {
                initialValue: values?.[FIELDS.inn] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={t.profile('kpp')}>
              {getFieldDecorator(FIELDS.kpp, {
                initialValue: values?.[FIELDS.kpp] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={'Контактное лицо'}>
              {getFieldDecorator(FIELDS.contact, {
                initialValue: values?.[FIELDS.contact] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={'Контактный номер телефона'} disabled={true}>
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
            <VzForm.Item
              disabled={true}
            >
              {getFieldDecorator(FIELDS.isBlocked, {
                initialValue: values?.[FIELDS.isBlocked] || false,
              })(
                <VzForm.FieldSwitch
                  disabled={true}
                  checkedTitle={'Заблокирован'}
                  unCheckedTitle={'Заблокирован'}
                  colorChecked={false}
                  checked={getFieldValue(FIELDS.isBlocked) || false}
                />
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={'Веб-сайт'}>
              {getFieldDecorator(FIELDS.website, {
                initialValue: values?.[FIELDS.website] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

        </VzForm.Row>
      </div>
    </div>
  );
};

export default Ant.Form.create({})(MainForm);
