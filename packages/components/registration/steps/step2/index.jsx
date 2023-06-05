import React, { useState } from 'react';
import t from "@vezubr/common/localization";
import InputField from "../../../inputField/inputField";
import {ButtonDeprecated} from "@vezubr/elements";
import PropTypes from 'prop-types';
import {Register as RegisterService} from "@vezubr/services";

function RegisterStep2(props) {
  const { onComplete, phone, rollBack } = props;
  const { phoneNumber } = phone;
  const [activationCode, setActivationCode] = useState('');
  const [activationCodeError, setActivationCodeError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (val) => {
    setActivationCode(val);
    if (val !== '') {
      setActivationCodeError(null);
    }
  }

  const handleSubmit = async () => {
    if (!activationCode) {
      return setActivationCodeError(t.error('activationCodeEmpty'));
    }

    try {
      setLoading(true);
      const body = {
        phone: phoneNumber,
        code: activationCode,
      }
      await RegisterService.confirmCode(body);
      onComplete(activationCode);
    } catch (e) {
      setLoading(false);
      setActivationCodeError(t.error('activationCode'));
    }
    setLoading(false);
  }

  const resendActivationCode = async () => {
    try {
      await RegisterService.requestCode({
        phone: phoneNumber,
      });
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <div>
      <h3 className={'main-secondary-title'}>
        На номер {phoneNumber} было отправлено сообщение с кодом подтверждения. Введите полученный пароль для
        завершения регистрации.
      </h3>
      <div className={'form-wrapper'}>
        <InputField
          title={'КОД ПОДТВЕРЖДЕНИЯ'}
          type={'text'}
          className={activationCode ? 'active' : ''}
          value={activationCode}
          error={activationCodeError}
          onChange={(e) => handleChange(e.target.value)}
        />
        <div className={'buttons-wrapper margin-top-31'}>
          <ButtonDeprecated theme={'primary'} onClick={handleSubmit} loading={loading} wide={true}>
            Продолжить
          </ButtonDeprecated>
          <ButtonDeprecated className={'margin-top-16'} theme={'secondary'} onClick={rollBack} wide={true}>
            Изменить номер
          </ButtonDeprecated>
          <ButtonDeprecated
            className={'margin-top-16'}
            theme={'secondary'}
            onClick={resendActivationCode}
            wide={true}
          >
            {' '}
            Отправить пароль снова
          </ButtonDeprecated>
        </div>
      </div>
    </div>
  )
}

RegisterStep2.propTypes = {
  onComplete: PropTypes.func,
  phone: PropTypes.object,
  rollBack: PropTypes.func,
}

export default RegisterStep2;