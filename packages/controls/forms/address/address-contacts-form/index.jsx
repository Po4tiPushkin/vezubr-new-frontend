import React, { useCallback, useEffect, useRef } from 'react';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { Ant, VzForm } from '@vezubr/elements';
// import { documentContactValidator, documentPhoneValidator, documentEmailValidator } from './validate';
import { Form } from '@vezubr/elements/antd';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import { PHONE_MASK, PHONE_PLACEHOLDER } from '../constants';
import InputMask from 'react-input-mask';

const FIELDS = {
  contact: 'contact',
  phone: 'phone',
  extraPhone: 'extraPhone',
  extraPhone2: 'extraPhone2',
  phone2: 'phone2',
  email: 'email',
};

export const validators = {
  // [FIELDS.contact]: (contact) => documentContactValidator(contact, true),
  // [FIELDS.phone]: (phone) => documentPhoneValidator(phone, true),
  // [FIELDS.email]: (email) => documentEmailValidator(email, true),
};

const AddressContactForm = (props) => {
  const { onSave, checkOnInit, onCancel, form, values, disabled, mode, onEdit, onInit, disabledSubmit, delegated = false } = props;
  const { getFieldError, getFieldDecorator, setFieldsValue } = form;

  const rules = VzForm.useCreateAsyncRules(validators);

  const prevValues = usePrevious(values);

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

  const timeOutUpdater = useRef(0);

  useEffect(() => {
    if (!_isEmpty(values) && !_isEqual(values, prevValues)) {
      const fieldsValue = Object.keys(FIELDS).reduce((fieldsValue, fieldName) => {
        if (values?.[fieldName]) {
          fieldsValue[fieldName] = values[fieldName];
        }

        return fieldsValue;
      }, {});

      if (timeOutUpdater.current) {
        clearTimeout(timeOutUpdater.current);
      }

      timeOutUpdater.current = setTimeout(() => setFieldsValue(fieldsValue), 100);
    }
  }, [values, prevValues]);

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

  return (
    <Ant.Form layout="vertical" onSubmit={handleSave}>
      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Контактное лицо'} error={getFieldError(FIELDS.contact)}>
              {getFieldDecorator(FIELDS.contact, {
                rules: rules[FIELDS.contact]('d'),
                initialValue: values?.[FIELDS.contact] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Номер телефона'} error={getFieldError(FIELDS.phone)}>
              {getFieldDecorator(FIELDS.phone, {
                rules: rules[FIELDS.phone](),
                initialValue: values?.[FIELDS.phone] || '',
              })(
                <InputMask mask={PHONE_MASK} disabled={disabled}>
                  <Ant.Input placeholder={PHONE_PLACEHOLDER} allowClear={true} />
                </InputMask>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Добавочный номер 1'} error={getFieldError(FIELDS.extraPhone)}>
              {getFieldDecorator(FIELDS.extraPhone, {
                rules: rules[FIELDS.extraPhone]('d'),
                initialValue: values?.[FIELDS.extraPhone] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'E-mail'} error={getFieldError(FIELDS.email)}>
              {getFieldDecorator(FIELDS.email, {
                rules: rules[FIELDS.email]('d'),
                initialValue: values?.[FIELDS.email] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Рабочий номер телефона'} error={getFieldError(FIELDS.phone2)}>
              {getFieldDecorator(FIELDS.phone2, {
                rules: rules[FIELDS.phone2](),
                initialValue: values?.[FIELDS.phone2] || '',
              })(
                <InputMask mask={PHONE_MASK} disabled={disabled}>
                  <Ant.Input placeholder={PHONE_PLACEHOLDER} allowClear={true} />
                </InputMask>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Добавочный номер 2'} error={getFieldError(FIELDS.extraPhone2)}>
              {getFieldDecorator(FIELDS.extraPhone2, {
                rules: rules[FIELDS.extraPhone2]('d'),
                initialValue: values?.[FIELDS.extraPhone2] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      {(onCancel || onSave) && (
        <VzForm.Actions>
          {mode === 'view' && (
            <Ant.Button disabled={APP === 'dispatcher' ? !delegated : false} onClick={onEdit} type={'primary'}>
              Редактировать
            </Ant.Button>
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
    </Ant.Form>
  );
};

AddressContactForm.propTypes = {
  values: PropTypes.object,
  checkOnInit: PropTypes.bool,
  disabledSubmit: PropTypes.bool,
  onSave: PropTypes.func,
  onChange: PropTypes.func,
  onInit: PropTypes.func,
  onCancel: PropTypes.func,
  onEdit: PropTypes.func,
  mode: PropTypes.string,
  form: PropTypes.object,
  disabled: PropTypes.bool,
};

export default Form.create({
  name: 'address_main_form',
  onValuesChange: (props, changedValues, allValues) => {
    const { onChange, form } = props;
    if (onChange) {
      props.onChange(form, allValues, changedValues);
    }
  },
})(AddressContactForm);
