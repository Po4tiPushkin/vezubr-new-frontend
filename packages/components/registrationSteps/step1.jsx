import React, { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';
import { WhiteBoxDeprecated, Logo, ButtonDeprecated, InputCheckbox } from '@vezubr/elements';
import InputField from '../inputField/inputField';
import Icon from '@vezubr/elements/DEPRECATED/icon/icon';
import { User as UserService } from '@vezubr/services';
import autobind from 'autobind-decorator';
import t from '@vezubr/common/localization';
import PrivacyPolicy from '@vezubr/common/assets/agreements/Политика конфиденциальности.pdf';
import UserAgreement from '@vezubr/common/assets/agreements/Правила пользования платформой.pdf';
import DataUsage from '@vezubr/common/assets/agreements/Согласие на обработку персональных данных.pdf';
import { Utils } from '@vezubr/common/common';
import platformName from '@vezubr/common/common/platformName';

function editDecorator(target, key, descriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args) {
    const typeReq = this.state.typeReq;
    if (typeReq.length > 0) {
      return originalMethod.call(this, ...args);
    }
    return false;
  };
}

class RegisterStep1 extends React.Component {
  constructor(props) {
    super(props);

    let typeReq = localStorage.getItem('typeReq');
    let type = '';
    if (typeReq && typeReq.split(':')[0] === APP) {
      type = typeReq.split(':')[1];
    } else if (typeReq) {
      localStorage.removeItem('typeReq');
    }

    this.state = {
      phone: '',
      agree: false,
      errors: {
        phone: false,
        agree: false,
      },
      loading: false,
      typeReq: type,
    };
  }

  componentDidMount() {
    const phone = (this.props.getParams?.phone || '').replace(/[^0-9]/, '');
    if (phone.length > 9) {
      this.setState({
        phone: phone.slice(-10).replace(/^(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4'),
      });
    }
  }

  @autobind
  @editDecorator
  handleChange(type, e) {
    const { errors } = this.state;
    errors[type] = false;
    this.setState({
      [type]: e.target.value,
      errors,
    });
  }

  @autobind
  triggerAgree() {
    const { agree, errors } = this.state;
    if (!agree) {
      errors.agree = false;
    }
    this.setState({ agree: !agree, errors });
  }

  @autobind
  @editDecorator
  async submit() {
    const { phone, errors, agree } = this.state;
    const { onComplete } = this.props;
    if (!agree) {
      errors.agree = t.reg('selectAgree');
    }
    if (!phone) {
      errors.phone = t.reg('fillPhone');
    }
    if (errors.agree || errors.phone) {
      return this.setState({ errors });
    }
    try {
      this.setState({ loading: true });
      const resp = await UserService.requestCode({
        phone: phone.replace(/\D/g, ''),
      });
      const code = resp.code ? resp.code : resp.data ? resp.data.code : null;
      onComplete(phone, code || null);
    } catch (e) {
      errors.phone = t.error(e.error_no);
      this.setState({ errors });
    }
    this.setState({ loading: false });
  }

  openFile(file) {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = file;
    link.click();
  }

  chooseType(type) {
    const contourCode = Utils.queryString()?.contourCode;
    const queryString = Utils.toQueryString({ contourCode });

    if (APP == 'client' && (type === 'contractor_type1' || type === 'contractor_type2')) {
      localStorage.setItem('typeReq', 'producer:' + type);
      window.location.href = window.API_CONFIGS.producer.host + 'register' + queryString;
      return;
    } else if (APP == 'producer' && (type === 'customert_type1' || type === 'customert_type2')) {
      localStorage.setItem('typeReq', 'client:' + type);
      window.location.href = window.API_CONFIGS.client.host + 'register' + queryString;
      return;
    }
    localStorage.setItem('typeReq', APP + ':' + type);
    this.setState({ typeReq: type });
  }

  render() {
    const { errors, phone, agree, typeReq } = this.state;
    return (
      <WhiteBoxDeprecated>
        <Logo />
        <h2 className={'main-sub-title'}>{t.reg('title2')}</h2>

        <div className={'registrationStep1'}>
          <div>
            <p>{t.reg('customer')}</p>
            <ButtonDeprecated
              theme={typeReq === 'customert_type1' ? 'primary' : 'secondary'}
              onClick={() => this.chooseType('customert_type1')}
            >
              {t.reg('legal_entity')}
            </ButtonDeprecated>
            <ButtonDeprecated theme={'disabled'} className={'disabled'}>
              {t.reg('individual')}
            </ButtonDeprecated>
          </div>
          <div>
            <p>{t.reg('contractor')}</p>
            <ButtonDeprecated
              theme={typeReq === 'contractor_type1' ? 'primary' : 'secondary'}
              onClick={() => this.chooseType('contractor_type1')}
            >
              {t.reg('transporter')}
            </ButtonDeprecated>
            <ButtonDeprecated
              theme={typeReq === 'contractor_type2' ? 'primary' : 'secondary'}
              onClick={() => this.chooseType('contractor_type2')}
            >
              {t.reg('movers_services')}
            </ButtonDeprecated>
          </div>
        </div>

        <div className={typeReq.length > 0 ? 'registrationStep1_show' : 'registrationStep1_disable'}>
          <h3 className={'main-secondary-title'}>{t.reg('subTitle')}</h3>
          <div className={'form-wrapper'}>
            <InputField
              title={`${t.reg('phoneNumber')}`}
              placeholder={'+7 (___) ___-__-__'}
              mask={'+7 (999) 999-99-99'}
              telephone={true}
              type={'text'}
              className={phone.length ? 'active' : ''}
              value={phone}
              error={errors.phone}
              onChange={(e) => this.handleChange('phone', e)}
            />
            <div
              className={'vz-input margin-top-20 flexbox align-center tos' + (errors.agree ? ' error' : '')}
              style={{ backgroundColor: '#fff', border: '1px solid #fff' }}
            >
              <InputCheckbox
                onChange={this.triggerAgree}
                className={'margin-left-57 margin-top-minus-10 padding-left-2 padding-right-2'}
                theme={'primary'}
                style={{ width: '75px' }}
              />
              <span className={'margin-left-5 margin-top-13'}>
                Регистрируясь в системе "{platformName}", вы даете &nbsp;
                <span className={'download-document'} onClick={() => this.openFile(DataUsage)}>
                  &nbsp; Согласие на обработку персональных данных
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
              </span>
              {errors.agree ? (
                <div data-tip="React-tooltip" data-for={'agree'} className={`bottom-right`}>
                  <Icon name={'danger'} />
                  <ReactTooltip id={'agree'} className={'vz-tooltip'} place="bottom" type="dark" effect="solid">
                    <span>{errors.agree}</span>
                  </ReactTooltip>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className={'buttons-wrapper margin-top-31'}>
              <ButtonDeprecated theme={'primary'} onClick={this.submit} loading={this.state.loading} wide={true}>
                {t.reg('getSmsCode')}
              </ButtonDeprecated>
            </div>
          </div>
        </div>
      </WhiteBoxDeprecated>
    );
  }
}

export default RegisterStep1;
