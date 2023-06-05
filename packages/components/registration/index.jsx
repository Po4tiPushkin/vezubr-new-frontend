import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import loginBg from '@vezubr/common/assets/img/login-bg.jpg';
import t from '@vezubr/common/localization';
import { Logo, showAlert, showError, VzForm } from "@vezubr/elements";
import { Step0, Step1, Step2, Step3 } from './steps';
import { Register as RegisterService, User as UserService } from "@vezubr/services";
import { ROLES } from '@vezubr/common/constants/constants';
import cn from 'classnames';
import { Utils } from "@vezubr/common/common";
import Cookies from '@vezubr/common/common/cookies';

function RegisterView(props) {
  const { history } = props;
  const getParams = Utils.getUrlParams(history.location.search);

  const [role, setRole] = useState(0);
  const [step, setStep] = useState(0);
  const [contourInfo, setContourInfo] = useState(null);
  const [phone, setPhone] = useState({
    phoneNumber: '',
    code: '',
  });

  const registerManual = useMemo(() => {
    let link = ''
    switch (role) {
      case '4':
        link = 'https://vezubr-ru.gitbook.io/instrukciya-dlya-ekspeditorov/etapy-perevozki/untitled';
        break;
      case '1':
        link = 'https://vezubr-ru.gitbook.io/instrukciya-dlya-perevozchikov/rukovodstvo-polzovatelya-po-rabote-v-vezubr-perevozchiki/registraciya'
        break;
      case '2':
        link = 'https://vezubr-ru.gitbook.io/instrukciya-dlya-gruzovladelcev/lichnyi-kabinet-gruzovladelca/untitled'
        break;
    }
    return (
      <a target="_blank" rel="noopener noreferrer" className='registration__link' href={link}>
        Инструкция по регистрации и авторизации
      </a>
    )
  }, [role])

  const classForWidthStep = useMemo(() => {
    if (step === 1 || step === 2) {
      return 'registration__block-wrp--small';
    }

    return null;
  }, [step]);

  const isFunctionForContractor = useMemo(() => {
    if (role === '1') {
      return {
        function: 1,
      }
    }

    return null;
  }, [role]);

  const isContourCode = useMemo(() => {
    if (getParams?.contourCode) {
      return {
        contourCode: getParams?.contourCode,
      };
    }

    return null;
  }, [getParams]);


  useEffect(() => {
    const fetchData = async () => {
      if (isContourCode?.contourCode) {
        try {
          const contourInfoResponse = await UserService.getByCode(isContourCode.contourCode);
          setContourInfo(contourInfoResponse);
        } catch (e) {
          showError(e);
          if (e.code === 404) {
            history.push('/login');
          }
        }
      }
    }
    fetchData();
  }, [isContourCode?.contourCode]);

  const hostForRedirectAfterRegistration = useMemo(() => {
    let result = '/';
    if (role === '1') {
      result = window.API_CONFIGS.producer.url;
    } else if (role === '2') {
      result = window.API_CONFIGS.client.url;
    } else if (role === '4') {
      result = window.API_CONFIGS.dispatcher.url;
    }

    return result;
  }, [role]);

  const selectRole = (newRole) => {
    setRole(newRole);
    routeToStep1();
  }

  const routeToStep1 = () => {
    setStep(1);
  }

  const routeToStep2 = (phoneNumber, code) => {
    setPhone({
      phoneNumber,
      code,
    });

    setStep(2);
  }

  const routeToStep3 = (code) => {
    setPhone({
      ...phone,
      ...{ code },
    });
    setStep(3);
  }

  const onSave = async (form, org) => {
    const { values: { confirm, ...needValues }, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null) {
      return;
    }
    let orgBody = {};
    if (org) {
      orgBody = {
        addressLegal: org.addressLegal,
        kpp: org.kpp,
        companyFullName: org.fullName
      }
    }

    const body = {
      ...needValues,
      ...{
        phone: phone.phoneNumber,
        code: phone.code,
      },
      role,
      ...isFunctionForContractor,
      ...isContourCode,
      ...orgBody,
    }

    try {
      await RegisterService.completeRegistration(body);
      showAlert({
        content: t.common('Вы успешно зарегистрировались'),
        onOk: () => window.location.href = window.API_CONFIGS.enter.url,
        onCancel: () => window.location.href = window.API_CONFIGS.enter.url
      });
    } catch (e) {
      showError(e);
    }
  };

  const widthProgressBar = useMemo(() => {
    return `${((step + 1) / 4) * 100}%`;
  }, [step]);

  return (
    <div className={'registration'}>
      <img className={'bg'} src={loginBg} />
      <div className={'wrap'}>
        <div className={cn('registration__block-wrp', classForWidthStep)}>
          <Logo />
          <h2 className={'main-sub-title'}>{t.reg('title2')}</h2>
          {(role > 0) && (
            <p>{ROLES[role]}</p>
          )}
          {(step === 0) && (
            <Step0
              contourInfo={contourInfo}
              roles={ROLES}
              onComplete={selectRole}
            />
          )}
          {(step === 1) && (
            <Step1
              onComplete={routeToStep2}
              history={history}
              registerManual={registerManual}
            />
          )}
          {(step === 2) && (
            <Step2
              phone={phone}
              rollBack={routeToStep1}
              onComplete={routeToStep3}
            />
          )}
          {(step === 3) && (
            <Step3
              onSave={onSave}
              registerManual={registerManual}
              role={role}
            />
          )}
        </div>
      </div>
      <div className={'registration__progress-bar'} style={{ width: widthProgressBar }} />
    </div>
  )
}

RegisterView.propTypes = {
  history: PropTypes.object,
}

RegisterView.contextTypes = {
  routes: PropTypes.object.isRequired,
  store: PropTypes.object,
};
export default RegisterView;
