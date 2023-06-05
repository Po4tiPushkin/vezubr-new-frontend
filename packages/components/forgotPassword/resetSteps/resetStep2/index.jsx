import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WhiteBox, Logo, ButtonDeprecated, VzForm, Ant, showError } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { User as UserService } from '@vezubr/services';
import Static from '@vezubr/common/constants/static';
const patterns = Static.patterns;

const ResetStep2 = (props) => {
  const { token, onComplete } = props;
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState({
    password: '',
    passwordConfirm: '',
  })
  const validate = useCallback(() => {
    const newErrors = { ...errors }
    newErrors.password = !password
      ? t.error('noPassword')
      : !patterns.password.test(password)
        ? t.reg('passwordDesc')
        : '';
    newErrors.passwordConfirm =
      password && password !== passwordConfirm ? t.error('passwordMatch') : '';
    setErrors(newErrors);
    const totalErrors = Object.values(newErrors).filter((e) => !e);
    return totalErrors.length !== Object.keys(newErrors).length;
  }, [password, passwordConfirm]);

  const onSubmit = useCallback(async () => {
    if (validate()) {
      return;
    }
    try {
      const response = await UserService.forgotPasswordChange({ password: { password, passwordConfirm }, code: token });
      onComplete(2, response);
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [password, passwordConfirm, onComplete]);

  return (
    <WhiteBox style={{ height: '544px' }}>
      <Logo />
      <h2 className={'main-sub-title'}>{t.reg('recoverUser')}</h2>
      <h3 className={'main-secondary-title'}>Укажите новый пароль</h3>
      <div>
        <VzForm.Item className='margin-bottom-15' label={'Пароль'} error={errors?.password || ''}>
          <Ant.Input
            value={password}
            onChange={(e) => {
              if (errors?.password) {
                setErrors({ ...errors, password: '' });
              };
              setPassword(e.target.value);
            }}
          />
        </VzForm.Item>
        <VzForm.Item label={'Повтор пароля'} error={errors?.passwordConfirm || ''}>
          <Ant.Input
            value={passwordConfirm}
            onChange={(e) => {
              if (errors?.passwordConfirm) {
                setErrors({ ...errors, passwordConfirm: ''})
              };
              setPasswordConfirm(e.target.value);
            }}
          />
        </VzForm.Item>
      </div>
      <div className='margin-top-15'>
        <Ant.Button onClick={() => onSubmit()}>
          {t.buttons('confirm')}
        </Ant.Button>
      </div>
    </WhiteBox>
  )
}

export default ResetStep2;