import React from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _debounce from 'lodash/debounce';
import autobind from 'autobind-decorator';
import { ButtonDeprecated, Logo, WhiteBoxDeprecated } from '@vezubr/elements';
import InputField from '../inputField/inputField';
import { PasswordStrength } from '../index';
import t from '@vezubr/common/localization';
import Static from '@vezubr/common/constants/static';
import { User as UserService } from '@vezubr/services';
import Cookies from '@vezubr/common/common/cookies';
import { Link } from 'react-router-dom';

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
    };
    this.getInn = _debounce(this.getInn, 500);
  }

  componentWillMount() {
    const { data, errors } = this.state;
    RegisterStep3.getActiveType().keys.map((item) => {
      data[item.name] = '';
      errors[item.name] = false;
    });
    this.setState({ data, errors });
  }

  static getActiveType() {
    return Static.customerTypes().values.find((item) => item.active);
  }

  async getInn() {
    const { data, errors } = this.state;
    if (data.inn.length) {
      try {
        const validInn = await UserService.companyProfile(data.inn);
        errors['inn'] = false;
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
    errors[type] = false;
    data[type] = e.target.value;
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

  validate() {
    const { data, errors, activeType } = this.state;
    if (activeType.urlKeyName === 'registerCorporate') {
      errors.inn = !data.inn ? t.error('inn') : false;
      errors.name = !data.name ? t.error('firstName') : false;
      errors.surname = !data.surname ? t.error('lastName') : false;
    }
    if (activeType.urlKeyName === 'registerIndividual') {
      errors.name = !data.name ? t.error('firstName') : false;
      errors.surname = !data.surname ? t.error('lastName') : false;
    }

    if (activeType.urlKeyName === 'truckOwner') {
      errors.inn = !data.inn ? t.error('inn') : false;
      errors.name = !data.name ? t.error('firstName') : false;
      errors.surname = !data.surname ? t.error('lastName') : false;
    }

    if (activeType.urlKeyName === 'loadersService') {
      errors.inn = !data.inn ? t.error('inn') : false;
      errors.name = !data.name ? t.error('firstName') : false;
      errors.surname = !data.surname ? t.error('lastName') : false;
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
    const { data, activeType } = this.state;
    const { phoneNumber } = this.props;
    const reqData = _cloneDeep(data);
    if (activeType.urlKeyName === 'truckOwner') {
      reqData.function = 1;
      reqData.phone = phoneNumber.replace(/\D/g, '');
    } else if (activeType.urlKeyName === 'loadersService') {
      reqData.function = 2;
      reqData.phone = phoneNumber.replace(/\D/g, '');
    }
    delete reqData.cPassword;
    return reqData;
  }

  @autobind
  async submit() {
    try {
      const { activeType } = this.state;
      const { history, routes, bootstrap } = this.props;
      const errorsExists = this.validate();
      if (errorsExists) return;
      const reqData = this.serialize();
      const r = await UserService.register(reqData, activeType.urlKeyName);
      Cookies.set('token', r.data.token);
      await bootstrap();
      history.push(routes.producerProfile.url);
    } catch (e) {
      if (e.error_no === 403) {
        const { errors } = this.state;
        errors.email = t.error('emailExists');
        this.setState({
          errors,
        });
      }
    }
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
              withBorder={true}
              minLength={item.name === 'inn' ? 10 : undefined}
              maxLength={item.name === 'inn' ? 12 : undefined}
              placeholder={item.name === 'email' ? 'username@example.com' : ''}
              icon={{
                active: 'xSmall',
                position: 'bottom-right',
                show: data[item.name].length > 0,
                state: 'active',
                onClick: (e) => this.clearInput(item.name),
              }}
              onChange={(e) => {
                this.handleChange(item.name, e);
                item.name === 'inn' ? this.getInn() : void 0;
              }}
            />
          );
        })}
      </div>
    );
  }

  render() {
    const { data, customerTypes, activeType } = this.state;
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
        <Logo />
        <h2 className={'main-sub-title'}>{t.reg('title')}</h2>
        <div className={'form-wrapper small flexbox size-1'}>
          <div className={'flexbox column align-left size-0_8 space-between registration-types'}>
            <div>{customers}</div>
            <ul className={'registration-terms no-decoration'}>
              <li>
                <Link to={'terms'} target={'blank'} className={'no-decoration light-bold'}>
                  {t.reg('terms')}
                </Link>
              </li>
              <li>
                <Link to={'license'} target={'blank'} className={'no-decoration light-bold'}>
                  {t.reg('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to={'faq'} target={'blank'} className={'no-decoration light-bold'}>
                  {t.reg('faq')}
                </Link>
              </li>
            </ul>
          </div>
          <div className={'full-width-input flexbox column align-left size-1'}>
            {this.renderInputs(activeType)}
            <p className={'text-left margin-top-10'}>{t.reg('passwordDesc')}</p>
            <PasswordStrength password={data.password} />
            <ButtonDeprecated theme={'primary'} onClick={this.submit} full={true}>
              {t.reg('completeReg')}
            </ButtonDeprecated>
          </div>
        </div>
      </WhiteBoxDeprecated>
    );
  }
}

export default RegisterStep3;
