import React from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import autobind from 'autobind-decorator';
import { ButtonDeprecated, Logo, WhiteBoxDeprecated, showError } from '@vezubr/elements';
import InputField from '../inputField/inputField';
import PasswordStrength from '../DEPRECATED/fields/passwordStrength/passwordStrength';
import t from '@vezubr/common/localization';
import Static from '@vezubr/common/constants/static';
import { User as UserService } from '@vezubr/services';
import Cookies from '@vezubr/common/common/cookies';
import PrivacyPolicy from '@vezubr/common/assets/agreements/Политика конфиденциальности.pdf';
import UserAgreement from '@vezubr/common/assets/agreements/Правила пользования платформой.pdf';
import DataUsage from '@vezubr/common/assets/agreements/Согласие на обработку персональных данных.pdf';
import { Utils } from '@vezubr/common/common';
import platformName from '@vezubr/common/common/platformName';
import Loader from '../loader';

const patterns = Static.patterns;

class RegisterStep3 extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: {},
      errors: {},
      customerTypes: Static.customerTypes('client'),
      activeType: RegisterStep3.getActiveType(),
      loading: false,
      checkingInn: false,
    };
  }

  componentWillMount() {
    const { data: dataInput, errors } = this.state;

    const data = { ...dataInput };

    RegisterStep3.getActiveType().keys.map((item) => {
      data[item.name] = '';
      errors[item.name] = false;
    });

    data['contourCode'] = Utils.queryString()?.contourCode || '';

    this.setState({ data, errors });
  }

  static getActiveType() {
    return Static.customerTypes().values.find((item) => item.active);
  }

  @autobind
  handleChange(type, e) {
    const data = { ...this.state.data };
    const errors = { ...this.state.errors };

    const value = e?.target?.value || '';

    if (type === 'name' || type === 'fName') {
      errors[type] = value.length < 2 ? t.error('firstName') : false;
    } else if (type === 'surname' || type === 'lName') {
      errors[type] = value.length < 2 ? t.error('lastName') : false;
    } else {
      errors[type] = false;
    }

    data[type] = value;

    if (type === 'inn') {
      errors[type] = t.error('innNotFromSuggestions');
      if (e.suggestions) {
        errors[type] = false;
        data[type + '_value'] = value;
        data[type] = e?.val?.shortName;
        this.checkInn(value);
      }
    }

    this.setState({
      data,
      errors,
    });
  }

  clearInput(type) {
    const { data } = this.state;
    data[type] = '';
    this.setState({ data });
  }

  async checkInn(inn) {
    const { activeType, errors, checkingInn } = this.state;
    try {
      this.setState({ checkingInn: true });
      const response = await UserService.checkInn({ inn, role: activeType.id })
      this.setState({ checkingInn: false });
    } catch (e) {
      if (e.data?.status === false) {
        errors.inn = 'Данный ИНН уже занят';
        this.setState(
          {
            errors,
          }
        )
      }
      console.error(e);
      this.setState({ checkingInn: false });
    }
  }

  validate() {
    const { data, errors, activeType } = this.state;
    if (activeType.urlKeyName === 'registerCorporate') {
      errors.inn = errors.inn ? errors.inn : !data.inn ? t.error('inn') : false;
      errors.name = data.name && data.name.length > 1 ? false : t.error('firstName');
      errors.surname = data.surname && data.surname.length > 1 ? false : t.error('lastName');
    } else if (activeType.urlKeyName === 'registerIndividual') {
      errors.fName = data.fName && data.fName.length > 1 ? false : t.error('firstName');
      errors.lName = data.lName && data.lName.length > 1 ? false : t.error('lastName');
    }
    errors.email = !data.email ? t.error('noEmail') : !patterns.email.test(data.email) ? t.error('emailFormat') : false;
    errors.password = !data.password
      ? t.error('noPassword')
      : !patterns.password.test(data.password)
      ? t.reg('passwordDesc')
      : false;
    errors.cPassword = data.password && data.password !== data.cPassword ? t.error('passwordMatch') : false;
    this.setState({ errors });
    const totalErrors = Object.values(errors).filter((e) => !e);
    return totalErrors.length !== Object.keys(errors).length;
  }

  serialize() {
    const { data } = this.state;
    const { phoneNumber, code } = this.props;
    const reqData = _cloneDeep(data);

    reqData.contourCode = Utils.queryString()?.contourCode || '';

    /*if (activeType.urlKeyName === 'registerCorporate') {
			reqData.name = reqData.fName;
			reqData.surname = reqData.lName;
			delete reqData.fName;
			delete reqData.lName;
		}*/
    reqData.inn = data?.inn_value;
    delete reqData['inn_value'];
    reqData.code = code;
    reqData.phone = phoneNumber.replace(/\D/g, '');
    delete reqData.cPassword;

    return reqData;
  }

  @autobind
  async submit() {
    try {
      const { activeType, checkingInn } = this.state;
      const { cb } = this.props;
      const errorsExists = this.validate();
      if (errorsExists) return;
      if (checkingInn) {
        showError('Дождитесь окончания проверки ИНН');
        return;
      }
      this.setState({ loading: true });
      const reqData = this.serialize();
      const r = await UserService.register(reqData, activeType.urlKeyName);
      Cookies.set('clientToken', r.token);
      cb(true);
    } catch (e) {
      if (e.error_no === 403 || e.error_no === 41) {
        const { errors } = this.state;
        errors.email = t.error('emailExists');
        this.setState({
          errors,
        });
      }
      console.warn(e);
    }
    this.setState({ loading: false });
  }

  @autobind
  resendActivationCode() {}

  @autobind
  rollBack() {
    const { rollBack } = this.props;
    rollBack();
  }

  @autobind
  selectCustomerType(type) {
    if (type.id > 2) return;
    let { customerTypes } = this.state;
    customerTypes.values.map((item) => (item.active = false));
    type.active = true;
    const { data, errors } = this.resetData(type);
    this.setState({
      data,
      errors,
      customerTypes,
      activeType: type,
    });
  }

  @autobind
  resetData(type) {
    let { data, errors } = this.state;
    data = {};
    errors = {};
    type.keys.map((key) => {
      data[key.name] = '';
      errors[key.name] = false;
    });
    return { data, errors };
  }

  @autobind
  renderInputs(activeType) {
    const { data, errors } = this.state;
    return (
      <div className={'full-width'}>
        {activeType.keys.map((item, key) => {
          return (
            <InputField
              key={key}
              title={item.title}
              name={item.name}
              type={item.type}
              required={true}
              className={item.className}
              value={data[item.name]}
              error={errors[item.name]}
              shortInfo={item.shortInfo}
              shortInfoShow={true}
              withError={item.error}
              placeholder={item.name === 'email' ? 'username@example.com' : ''}
              icon={{
                active: 'xSmall',
                position: 'bottom-right',
                show: data[item.name]?.length > 0,
                state: 'active',
                onClick: (e) => this.clearInput(item.name),
              }}
              showSuggestions={item.name === 'password' || item.name === 'cPassword' ? false : item.name}
              onChange={(e) => {
                this.handleChange(item.name, e);
              }}
            />
          );
        })}
      </div>
    );
  }

  openFile(file, name) {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = file;
    link.click();
  }

  renderLicenseContent() {
    const { activeType } = this.state;
    if (activeType.urlKeyName === 'registerCorporate') {
      return (
        <div>
          Регистрируясь в системе "{platformName}", вы даете &nbsp;
          <span className={'download-document'} onClick={() => this.openFile(DataUsage)}>
            Согласие на обработку персональных данных
          </span>
          &nbsp; и соглашаетесь с{' '}
          <span className={'download-document'} onClick={() => this.openFile(PrivacyPolicy)}>
            {' '}
            Политикой конфиденциальности
          </span>
          ,
          <span className={'download-document'} onClick={() => this.openFile(UserAgreement)}>
            {' '}
            Правилами пользования платформой
          </span>
          .
        </div>
      );
    }
  }

  render() {
    const { data, customerTypes, activeType, checkingInn } = this.state;
    const customers = (
      <div className={'margin-bottom-24'}>
        <p className={'text-left text-middle margin-left-16 text-grey narrow type-title'}>{customerTypes.title}</p>
        {customerTypes.values.map((type) => {
          return (
            <div
              className={`customer-box flexbox align-center title-bold ${
                type.active ? 'active' : type.urlKeyName === 'registerIndividual' ? 'disabled' : ''
              }`}
              key={type.id}
              onClick={() => this.selectCustomerType(type)}
            >
              {type.title}
            </div>
          );
        })}
      </div>
    );

    return (
      <WhiteBoxDeprecated className={'wide margin-bottom-86'} style={{ justifyContent: 'unset' }}>
        <Logo />
        <h2 className={'main-sub-title'}>{t.reg('title')}</h2>
        <div className={'form-wrapper registration-step-3 small flexbox size-1'}>
          <div className={'flexbox column align-left size-0_8 space-between registration-types'}>
            <div>{customers}</div>
            <div className={'text-left padding-right-25'}>{this.renderLicenseContent()}</div>
          </div>
          <div className={'full-width-input flexbox column align-left size-1'}>
          {checkingInn ? <div className="inn-check"><Loader/> Идет проверка ИНН</div>  : ''}
            {this.renderInputs(activeType)}
            <p className={'text-left margin-top-10'}>{t.reg('passwordDesc')}</p>
            <PasswordStrength password={data.password} />
            <ButtonDeprecated theme={'primary'} onClick={this.submit} loading={this.state.loading} full={true}>
              {t.reg('completeReg')}
            </ButtonDeprecated>
          </div>
        </div>
      </WhiteBoxDeprecated>
    );
  }
}

export default RegisterStep3;
