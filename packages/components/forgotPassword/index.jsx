import React, { useEffect, useState, useCallback, useMemo } from 'react';
import loginBg from '@vezubr/common/assets/img/login-bg.jpg';
import { showError, showAlert } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import Cookies from '@vezubr/common/common/cookies';
import { useHistory } from 'react-router-dom';
import ResetStep1 from './resetSteps/resetStep1';
import ResetStep2 from './resetSteps/resetStep2';
const ForgotPassword = (props) => {
  const { match } = props;
  const [step, setStep] = useState(1);
  const [token, setToken] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const { token: newToken } = match?.params || {};
    if (newToken && newToken !== 'email') {
      setStep(2);
      setToken(newToken);
    }
  }, []);

  const onComplete = useCallback((step) => {
    if (step === 1) {
      showAlert({
        title: 'Инструкции по изменению пароля были отправлены на ваш email',
        onOk: () => {
          history.push(`/login`);
        },
        onCancel: () => {
          history.push('/login');
        }
      });
    }
    if (step === 2) {
      showAlert({
        title: 'Пароль был успешно изменен',
        onOk: () => {
          history.push(`/login`);
        },
        onCancel: () => {
          history.push('/login');
        }
      });
    }
  }, [])

  return (
    <div className='login'>
      <img className={'bg'} src={loginBg} />
      <div className={'wrap'}>
        {step === 1 ? (
          <ResetStep1 onComplete={onComplete} history={history} />
        ) : step === 2 ? (
          <ResetStep2 token={token} onComplete={onComplete} />
        ) : null}
      </div>-
    </div>
  )
}

export default ForgotPassword;