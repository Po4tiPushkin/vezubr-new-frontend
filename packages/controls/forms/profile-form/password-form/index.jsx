import React, { useMemo, useCallback, useState } from 'react';
import { Ant, VzForm } from "@vezubr/elements";
const FIELDS = {
  currentPassword: 'currentPassword',
  newPassword: 'newPassword',
  confirmPassword: 'confirmPassword',
};


function ProfilePasswordForm(props) {
  const { form, disabled = false, values = {}, onPasswordChange } = props;
  const { getFieldError, getFieldDecorator, getFieldValue } = form;

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
                <VzForm.Col span={8}>
                  <VzForm.Item disabled={disabled} label={'Старый пароль'} error={getFieldError(FIELDS.currentPassword)}>
                    {getFieldDecorator(FIELDS.currentPassword, {
                      rules: [{ required: true, message: 'Обязательное поле' }],
                    })(<Ant.Input.Password disabled={disabled} placeholder={''} />)}
                  </VzForm.Item>
                </VzForm.Col>
              </VzForm.Row>
              <VzForm.Row>
                <VzForm.Col span={8}>
                  <VzForm.Item disabled={disabled} label={'Новый пароль'} error={getFieldError(FIELDS.newPassword)}>
                    {getFieldDecorator(FIELDS.newPassword, {
                      rules: [{ required: true, message: 'Обязательное поле' }],
                    })(<Ant.Input.Password disabled={disabled} placeholder={''} />)}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={8}>
                  <VzForm.Item disabled={disabled} label={'Подтвердите новый пароль'} error={getFieldError(FIELDS.confirmPassword)}>
                    {getFieldDecorator(FIELDS.confirmPassword, {
                      rules: [{ required: true, message: 'Обязательное поле' }],
                    })(<Ant.Input.Password disabled={disabled} placeholder={''} />)}
                  </VzForm.Item>
                </VzForm.Col>
              </VzForm.Row>
              <VzForm.Actions>
                <Ant.Button disabled={disabled} type="primary" onClick={onChange} className={'semi-wide margin-left-16'}>
                  Изменить пароль
                </Ant.Button>
              </VzForm.Actions>
            </VzForm.Group>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ant.Form.create({})(ProfilePasswordForm);