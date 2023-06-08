import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Ant, VzForm } from "@vezubr/elements";
import moment from "moment";
import InputMask from "react-input-mask";
import PropTypes from "prop-types";
import Validators from '@vezubr/common/common/validators';

const FIELDS = {
  surname: 'surname',
  name: 'name',
  patronymic: 'patronymic',
  role: 'role',
  email: 'email',
  phone: 'phone',
  hasDigitalSignature: 'hasDigitalSignature',
  digitalSignatureIssuedAtDate: 'digitalSignatureIssuedAtDate',
  digitalSignatureValidTill: 'digitalSignatureValidTill',
  digitalSignatureIdentifier: 'digitalSignatureIdentifier',
  digitalSignatureOperator: 'digitalSignatureOperator',
  types: 'types'
};

const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';
const PHONE_MASK = '+7 (999) 999-99-99';

function ProfileUserForm(props) {
  const { onSave, dictionaries, form, disabled = false, values = {}, onPasswordChange, errors } = props;
  const { getFieldError, getFieldDecorator, getFieldValue, getFieldsValue } = form;
  const [loading, setLoading] = useState(false);
  const rules = VzForm.useCreateAsyncRules(Validators.createEditUser);
  const digitalSignatureOperatorTypes = useMemo(() => {
    return dictionaries?.digitalSignatureOperator?.map(({ id, title }) => (
      <Ant.Select.Option key={id} value={id}>
        {title}
      </Ant.Select.Option>
    ))
  }, [dictionaries?.digitalSignatureOperator])

  const userRolesOptions = useMemo(() =>
    dictionaries?.userRoles?.map(({ id, title }) => (
      <Ant.Select.Option key={id} value={Number(id)}>
        {title}
      </Ant.Select.Option>
    ))
    , [dictionaries]);

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      if (onSave) {
        onSave(form);
      }
    },
    [form, onSave],
  );

  const onChange = useCallback(
    (e) => {
      e.preventDefault();
      if (onPasswordChange) {
        onPasswordChange(form)
      }
    },
    [form, onPasswordChange]
  )

  return (
    <div style={{ width: '100%' }}>
      <div className={'flexbox'}>
        <div className={'flexbox column size-1'}>
          <div className={'company-info'}>
            <VzForm.Group>
              <VzForm.Row>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Фамилия'} error={getFieldError(FIELDS.surname)}>
                    {getFieldDecorator(FIELDS.surname, {
                      initialValue: values?.[FIELDS.surname] || '',
                    })(<Ant.Input disabled={disabled} placeholder={''} />)}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Тип пользователя'} error={getFieldError(FIELDS.types)}>
                    {getFieldDecorator(FIELDS.types, {
                      initialValue: Array.isArray(values?.types)
                        ? [...new Set(values?.types)]
                        : values?.types,
                    })(
                      <Ant.Select mode={'multiple'} disabled={disabled} showSearch={true} optionFilterProp={'children'}>
                        {userRolesOptions}
                      </Ant.Select>
                    )}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Имя'} error={getFieldError(FIELDS.name)}>
                    {getFieldDecorator(FIELDS.name, {
                      initialValue: values?.[FIELDS.name] || '',
                    })(<Ant.Input disabled={disabled} placeholder={''} />)}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Отчество'} error={getFieldError(FIELDS.patronymic)}>
                    {getFieldDecorator(FIELDS.patronymic, {
                      initialValue: values?.[FIELDS.patronymic] || '',
                    })(<Ant.Input disabled={disabled} placeholder={''} />)}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Номер телефона'} error={getFieldError(FIELDS.phone)}>
                    {getFieldDecorator(FIELDS.phone, {
                      initialValue: values?.[FIELDS.phone]
                    })(
                      <InputMask disabled={disabled} mask={PHONE_MASK}>
                        <Ant.Input placeholder={PHONE_PLACEHOLDER} allowClear={true} />
                      </InputMask>
                    )}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Электронная почта'} error={(errors?.email ? errors.email[0] : undefined) || getFieldError(FIELDS.email)}>
                    {getFieldDecorator(FIELDS.email, {
                      initialValue: values?.[FIELDS.email] || '',
                    })(<Ant.Input disabled={disabled} placeholder={''} />)}
                  </VzForm.Item>
                </VzForm.Col>
              </VzForm.Row>
            </VzForm.Group>
            <VzForm.Group>
              <VzForm.Row>
                <VzForm.Col span={12}>
                  <VzForm.Item
                    disabled={disabled}
                    error={getFieldError(FIELDS.hasDigitalSignature)}
                  >
                    {getFieldDecorator(FIELDS.hasDigitalSignature, {
                      initialValue: values?.[FIELDS.hasDigitalSignature] || false,
                    })(
                      <VzForm.FieldSwitch
                        disabled={disabled}
                        checkedTitle={'Наличие ЭЦП'}
                        unCheckedTitle={'Наличие ЭЦП'}
                        colorChecked={false}
                        checked={getFieldValue(FIELDS.hasDigitalSignature) || false}
                      />
                    )}
                  </VzForm.Item>
                </VzForm.Col>
              </VzForm.Row>
              {getFieldValue(FIELDS.hasDigitalSignature) && (
                <>
                  <VzForm.Row>
                    <VzForm.Col span={12}>
                      <VzForm.Item
                        disabled={disabled}
                        label={'Начало действия подписи'}
                        error={getFieldError(FIELDS.digitalSignatureIssuedAtDate)}
                      >
                        {getFieldDecorator(FIELDS.digitalSignatureIssuedAtDate, {
                          initialValue: moment(values?.[FIELDS.digitalSignatureIssuedAtDate]).isValid()
                            ? moment(values?.[FIELDS.digitalSignatureIssuedAtDate])
                            : null,
                        })(
                          <Ant.DatePicker
                            disabled={disabled}
                            allowClear={true}
                            placeholder={'дд.мм.гггг'}
                            format={'DD.MM.YYYY'}
                          />,
                        )}
                      </VzForm.Item>
                    </VzForm.Col>
                    <VzForm.Col span={12}>
                      <VzForm.Item
                        disabled={disabled}
                        label={'Конец действия подписи'}
                        error={getFieldError(FIELDS.digitalSignatureValidTill)}
                      >
                        {getFieldDecorator(FIELDS.digitalSignatureValidTill, {
                          initialValue: moment(values?.[FIELDS.digitalSignatureValidTill]).isValid()
                            ? moment(values?.[FIELDS.digitalSignatureValidTill])
                            : null,
                        })(
                          <Ant.DatePicker
                            disabled={disabled}
                            allowClear={true}
                            placeholder={'дд.мм.гггг'}
                            format={'DD.MM.YYYY'}
                          />,
                        )}
                      </VzForm.Item>
                    </VzForm.Col>
                  </VzForm.Row>
                </>
              )}
            </VzForm.Group>
            {onSave && (
              <VzForm.Group>
                <VzForm.Actions>
                  <Ant.Button disabled={disabled} type="primary" onClick={handleSave} className={'semi-wide margin-left-16'}>
                    Сохранить
                  </Ant.Button>
                </VzForm.Actions>
              </VzForm.Group>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ant.Form.create({})(ProfileUserForm);