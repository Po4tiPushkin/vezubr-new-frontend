import React, { Component } from 'react';
import { WhiteBoxDeprecated, Logo, ButtonDeprecated } from '@vezubr/elements';
import InputField from '../inputField/inputField';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import { User as UserService } from '@vezubr/services';
import Static from '@vezubr/common/constants/static';
import autobind from 'autobind-decorator';
const patterns = Static.patterns;

class ResetStep2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        password: '',
        password_confirm: '',
        code: props.token,
      },
      errors: {
        password: '',
        password_confirm: '',
      },
    };
  }

  @autobind
  async onComplete(e) {
    e.preventDefault();
    const errorsExists = this.validate();
    if (errorsExists) return;
    try {
      const response = await UserService.recover(this.state.data);
      this.props.onComplete(2, response);
    } catch (e) {
      console.error(e)
    }
  }

  handleChange(e, name) {
    const { errors, data } = this.state;
    errors[name] = false;
    data[name] = e.target.value;
    this.setState({
      data,
      errors,
    });
  }

  validate() {
    const { errors, data } = this.state;
    errors.password = !data.password
      ? t.error('noPassword')
      : !patterns.password.test(data.password)
      ? t.reg('passwordDesc')
      : false;
    errors.password_confirm =
      data.password && data.password !== data.password_confirm ? t.error('passwordMatch') : false;
    this.setState({ errors });
    const totalErrors = Object.values(errors).filter((e) => !e);
    return totalErrors.length !== Object.keys(errors).length;
  }
  render() {
    const { data, errors } = this.state;
    return (
      <WhiteBoxDeprecated style={{ height: 400 }}>
        <Logo />
        <h2 className={'main-sub-title'}>{t.reg('recoverUser')}</h2>
        <h3 className={'main-secondary-title'}>Укажите новый пароль</h3>
        <form onSubmit={this.onComplete}>
          <div className={'form-wrapper margin-bottom-32'}>
            <InputField
              withBorder={true}
              title={t.reg('newPassword').toUpperCase()}
              type={'password'}
              name={'password'}
              className={['margin-top-16', data.password.length ? 'active' : ''].join(' ')}
              value={data.password}
              error={errors.password}
              withError={t.error('noPassword')}
              required={true}
              onChange={(e) => this.handleChange(e, 'password')}
            />
            <InputField
              withBorder={true}
              title={t.reg('repeatNewPassword').toUpperCase()}
              type={'password'}
              name={'password_confirm'}
              className={['margin-top-16', data.password_confirm.length ? 'active' : ''].join(' ')}
              value={data.password_confirm}
              error={errors.password_confirm}
              withError={t.error('noPassword')}
              required={true}
              onChange={(e) => this.handleChange(e, 'password_confirm')}
            />
            <ButtonDeprecated theme={'primary wide margin-top-36 height-44'} type={'submit'}>
              {t.buttons('confirm').toUpperCase()}
            </ButtonDeprecated>
          </div>
        </form>
      </WhiteBoxDeprecated>
    );
  }
}

export default ResetStep2;
