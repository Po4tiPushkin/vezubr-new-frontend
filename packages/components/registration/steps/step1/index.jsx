import React, { useState } from 'react';
import t from "@vezubr/common/localization";
import InputField from "../../../inputField/inputField";
import { ButtonDeprecated, InputCheckbox, showError } from "@vezubr/elements";
import platformName from "@vezubr/common/common/platformName";
import PropTypes from 'prop-types';
import Icon from "@vezubr/elements/DEPRECATED/icon/icon";
import ReactTooltip from "react-tooltip";
import DataUsage from "@vezubr/common/assets/agreements/Согласие на обработку персональных данных.pdf";
import PrivacyPolicy from '@vezubr/common/assets/agreements/Политика конфиденциальности.pdf';
import UserAgreement from '@vezubr/common/assets/agreements/Правила пользования платформой.pdf';
import { Register as RegisterService } from "@vezubr/services";

function RegisterStep1(props) {
  const { onComplete, history, registerManual } = props;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agree, setAgree] = useState(false);
  const [phoneError, setPhoneError] = useState(null);
  const [agreeError, setAgreeError] = useState(null);
  const [loading, setLoading] = useState(false);

  const openFile = (file) => {
    window.open(file);
  }

  const handleChange = (type, e) => {
    const val = e.target.value;
    setPhoneNumber(val);
    if (val !== '+7 (___) ___-__-__') {
      setPhoneError(null);
    }
  }

  const triggerAgree = () => {
    setAgree(!agree);
    setAgreeError(null);
  }

  const handleSubmit = async () => {
    const errors = {
      agree: null,
      phone: null,
    }
    if (!agree) {
      errors.agree = t.reg('selectAgree');
    }
    if (!phoneNumber) {
      errors.phone = t.reg('fillPhone');
    }
    if (errors?.agree || errors?.phone) {
      setAgreeError(errors?.agree);
      setPhoneError(errors?.phone);
      return false;
    }
    try {
      const phone = phoneNumber.replace(/\D/g, '');
      setLoading(true);
      const resp = await RegisterService.requestCode({
        phone: phone,
      });
      const code = resp?.code ? resp?.code : resp?.data ? resp?.data.code : null;
      onComplete(phone, code || null);
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoading(false);
  }

  const handleToMainPage = () => {
    history.push('/');
  }

  return (
    <div>
      <h3 className={'main-secondary-title'}>{t.reg('subTitle')}</h3>
      <div className={'form-wrapper'}>
        <InputField
          title={`${t.reg('phoneNumber')}`}
          placeholder={'+7 (___) ___-__-__'}
          mask={'+7 (999) 999-99-99'}
          telephone={true}
          type={'text'}
          className={phoneNumber.length ? 'active' : ''}
          value={phoneNumber}
          error={phoneError}
          onChange={(e) => handleChange('phone', e)}
        />
        <div
          className={'vz-input margin-top-20 flexbox tos' + (agreeError ? ' error' : '')}
          style={{ backgroundColor: '#fff', border: '1px solid #fff' }}
        >
          <InputCheckbox
            onChange={triggerAgree}
            className={'margin-left-57 margin-top-minus-10 padding-left-2 padding-right-2'}
            theme={'primary'}
            style={{ width: '75px' }}
          />
          <span className={'margin-top-13'}>
            Регистрируясь в системе &ldquo;{platformName}&rdquo;, вы даете &nbsp;
            <span className={'download-document'} onClick={() => openFile(DataUsage)}>Согласие на обработку персональных данных</span>
            &nbsp; и соглашаетесь с&nbsp;
            <span className={'download-document'} onClick={() => openFile(PrivacyPolicy)}>Политикой конфиденциальности</span>
            ,&nbsp;
            <span className={'download-document'} onClick={() => openFile(UserAgreement)}>Правилами пользования платформой</span>
            .
          </span>
          {agreeError && (
            <div data-tip="React-tooltip" data-for={'agree'} className={`bottom-right`}>
              <Icon name={'danger'} />
              <ReactTooltip id={'agree'} className={'vz-tooltip'} place="bottom" type="dark" effect="solid">
                <span>{agreeError}</span>
              </ReactTooltip>
            </div>
          )}
        </div>
        <div className='margin-top-15'>
          {registerManual}
        </div>
        <div className={'buttons-wrapper margin-top-31'}>
          <ButtonDeprecated theme={'primary'} onClick={handleSubmit} loading={loading} wide={true}>
            {t.reg('getSmsCode')}
          </ButtonDeprecated>
          <ButtonDeprecated className={'registration__button-comeback'} theme={'secondary'} onClick={handleToMainPage} wide={true}>
            Вернуться на главную
          </ButtonDeprecated>
        </div>
      </div>
    </div>
  )
}

RegisterStep1.propTypes = {
  onComplete: PropTypes.func,
  history: PropTypes.object,
}

export default RegisterStep1;