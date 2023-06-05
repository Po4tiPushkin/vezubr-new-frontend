import React from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _debounce from 'lodash/debounce';
import autobind from 'autobind-decorator';
import { ButtonDeprecated, Logo, WhiteBoxDeprecated, showError } from '@vezubr/elements';
import InputField from '../inputField/inputField';
import PasswordStrength from '../DEPRECATED/fields/passwordStrength/passwordStrength';
import t from '@vezubr/common/localization';
import Static from '@vezubr/common/constants/static';
import { User as UserService } from '@vezubr/services';
import Cookies from '@vezubr/common/common/cookies';
import AgentDocument from '@vezubr/common/assets/agreements/Условия Агентского договора.pdf';
import userAgreement from '@vezubr/common/assets/agreements/Правила пользования платформой.pdf';
import PropTypes from 'prop-types';
import { Utils } from '@vezubr/common/common';
import Loader from '../loader';
const patterns = Static.patterns;

class RegisterStep3 extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      validInn: false,
      data: {},
      errors: {},
      customerTypes: Static.customerTypes(),
      activeType: RegisterStep3.getActiveType(),
      checkingInn: false,
    };
    this.getInn = _debounce(this.getInn, 500);
  }

  componentWillMount() {
    const { data: dataInput, errors } = this.state;
    const { observer } = this.props;

    const data = { ...dataInput };

    RegisterStep3.getActiveType().keys.map((item) => {
      data[item.name] = '';
      errors[item.name] = false;
    });

    this.setState({ data, errors });
  }

  static getActiveType() {
    const typeReq = localStorage.getItem('typeReq');

    if (typeReq === 'producer:contractor_type2') {
      const type = Static.customerTypes().values[1];
      Static.customerTypes().values.map((item) => (item.active = false));
      type.active = true;
      return type;
    }
    return Static.customerTypes().values.find((item) => item.active);
  }

  async getInn() {
    const { data, errors } = this.state;
    if (data.inn.length) {
      try {
        const validInn = await UserService.companyProfile(data.inn);
        errors['inn'] = false;
        this.checkInn(data.inn);
        this.setState({ validInn, errors });
      } catch (e) {
        errors['inn'] = t.error(e.error_no);
        this.setState({ validInn: false, errors });
      }
    } else {
      // errors['inn'] = data.inn.length <10 ? t.error(e.error_no) : data.inn.length > 12 ? t.error(e.error_no): false ;
      this.setState({ validInn: false, errors });
      this.setState({ validInn: false });
    }
  }

  @autobind
  handleChange(type, e) {
    const { errors, data } = this.state;
    if (type === 'name') {
      errors.name = e.target.value.length < 2 ? t.error('firstName') : false;
    } else if (type === 'surname') {
      errors.surname = e.target.value.length < 2 ? t.error('lastName') : false;
    } else {
      errors[type] = false;
    }
    data[type] = e.target.value;

    if (type === 'inn') {
      errors[type] = t.error('innNotFromSuggestions');
      if (e.suggestions) {
        errors[type] = false;
        data[type + '_value'] = e.target.value;
        data[type] = e?.val?.shortName;
        this.checkInn(e.target.value);
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
    if (type === 'inn') {
      this.setState({ validInn: false, data });
    } else {
      this.setState({ data });
    }
  }

  async checkInn(inn) {
    const { activeType, errors, checkingInn } = this.state;
    try {
      this.setState({ checkingInn: true });
      const response = await UserService.checkInn({ inn, role: activeType.id === 3 ? 1 : activeType.id })
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
    if (
      activeType.urlKeyName === 'registerCorporate' ||
      activeType.urlKeyName === 'truckOwner' ||
      activeType.urlKeyName === 'loadersService'
    ) {
      errors.inn = errors.inn ? errors.inn : !data.inn ? t.error('inn') : false;
    }
    errors.name = data.name && data.name.length > 1 ? false : t.error('firstName');
    errors.surname = data.surname && data.surname.length > 1 ? false : t.error('lastName');
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
    const { data, activeType } = this.state;
    const { phoneNumber, code } = this.props;
    const reqData = _cloneDeep(data);

    reqData.contourCode = Utils.queryString()?.contourCode || '';

    if (activeType.urlKeyName === 'truckOwner') {
      reqData.function = 1;
      reqData.phone = phoneNumber.replace(/\D/g, '');
    } else if (activeType.urlKeyName === 'loadersService') {
      reqData.function = 2;
      reqData.phone = phoneNumber.replace(/\D/g, '');
    }
    reqData.inn = data?.inn_value;
    delete reqData['inn_value'];
    reqData.code = code;
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
      Cookies.set('producerToken', r.data.token);
      cb(true);
    } catch (e) {
      console.error(e);
      if (e.error_no === 403 || e.error_no === 454) {
        const { errors } = this.state;
        errors.email = t.error('emailExists');
        this.setState({
          errors,
        });
      }
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
    const { customerTypes } = this.state;
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
    const { phoneNumber } = this.props;
    data = {
      phone: phoneNumber.replace(/\D/g, ''),
      function: type.id === 3 ? 1 : type.id === 4 ? 2 : undefined,
    };
    errors = {};
    type.keys.map((key) => {
      data[key.name] = '';
      errors[key.name] = false;
    });
    return { data, errors };
  }

  @autobind
  renderInputs(activeType) {
    const { data, errors, validInn } = this.state;
    return (
      <div className={'full-width'}>
        {activeType.keys.map((item, key) => {
          return (
            <InputField
              key={key}
              title={item.title}
              name={item.name}
              type={item.type}
              className={item.className}
              value={item.name === 'inn' && validInn ? validInn.data.companyShortName : data[item.name]}
              error={errors[item.name]}
              shortInfo={item.shortInfo}
              shortInfoShow={true}
              withBorder={true}
              minLength={item.name === 'inn' ? 10 : undefined}
              maxLength={item.name === 'inn' ? 12 : undefined}
              placeholder={item.name === 'email' ? 'username@example.com' : ''}
              icon={{
                active: 'xSmall',
                position: 'bottom-right',
                show: data[item?.name]?.length > 0,
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

  openFile(file) {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = file;
    link.click();
  }

  renderLicenseContent() {
    const { activeType } = this.state;
    if (activeType.urlKeyName === 'truckOwner' || activeType.urlKeyName === 'loadersService') {
      return (
        <div>
          Нажав на кнопку Завершить регистрацию, Вы соглашаетесь с условиями{' '}
          <span onClick={() => this.openFile(AgentDocument)} className={'download-document'}>
            Агентского договора{' '}
          </span>{' '}
          и{' '}
          <span className={'download-document'} onClick={() => this.openFile(userAgreement)}>
            Правилами пользования платформой{' '}
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
              className={`customer-box flexbox align-center title-bold ${type.active ? 'active' : ''}`}
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
        {' '}
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
            <ButtonDeprecated theme={'primary'} loading={this.state.loading} onClick={this.submit} full={true}>
              {t.reg('completeReg')}
            </ButtonDeprecated>
          </div>
        </div>
      </WhiteBoxDeprecated>
    );
  }
}

RegisterStep3.contextTypes = {
  observer: PropTypes.object,
};

export default RegisterStep3;
