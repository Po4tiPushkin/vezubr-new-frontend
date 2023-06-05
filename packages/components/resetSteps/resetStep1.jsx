import React, { Component } from 'react';
import { WhiteBoxDeprecated, Logo, ButtonDeprecated } from '@vezubr/elements';
import InputField from '../inputField/inputField';
import { User as UserService } from '@vezubr/services';
import t from '@vezubr/common/localization';
import autobind from 'autobind-decorator';
import Static from '@vezubr/common/constants/static';
const patterns = Static.patterns;

class ResetStep1 extends Component {
  state = {
    data: {
      email: '',
    },
    errors: {
      email: '',
    },
    loading: false,
  };

  handleChange(e, name) {
    const { target } = e;
    const { value } = target;
    this.setState({
      data: { [name]: value },
    });
  }

  @autobind
  async onComplete(e) {
    e.preventDefault();
    const { email } = this.state.data;
    const errorsExists = this.validate();
    if (errorsExists) return;
    this.validate();
    this.setState({ loading: true });
    if (email.length) {
      try {
        await UserService.resetPassword({ email });
        this.props.onComplete(1);
      } catch (e) {}
    }
    this.setState({ loading: false });
  }

  cancel() {
    this.props.history.push('/login');
  }

  validate() {
    const { data, errors } = this.state;
    errors.email = !data.email ? t.error('noEmail') : !patterns.email.test(data.email) ? t.error('emailFormat') : false;
    this.setState({ errors });
    const totalErrors = Object.values(errors).filter((e) => !e);
    return totalErrors.length !== Object.keys(errors).length;
  }

  render() {
    const { data, errors } = this.state;
    return (
      <WhiteBoxDeprecated style={{ height: 400 }}>
        <Logo />
        <h2 className={'main-sub-title'}>{t.reg('resetEmailText')}</h2>
        <h3 className={'main-secondary-title margin-top-8'}>{t.reg('resetEmailDescription')}</h3>
        <form onSubmit={this.onComplete}>
          <div className={'form-wrapper'}>
            <InputField
              withBorder={true}
              title={t.reg('email')}
              type={'email'}
              name={'email'}
              className={['margin-top-16', data.email.length ? 'active' : ''].join(' ')}
              value={data.email}
              error={errors.email}
              withError={t.error('noEmail')}
              required={true}
              onChange={(e) => this.handleChange(e, 'email')}
            />
            <ButtonDeprecated theme={'primary wide margin-top-36'} type={'submit'} loading={this.state.loading}>
              {t.buttons('resetPassword')}
            </ButtonDeprecated>
            <ButtonDeprecated onClick={this.cancel} className={'margin-top-16'} theme={'secondary'} wide={true}>
              {t.buttons('cancel')}
            </ButtonDeprecated>
          </div>
        </form>
      </WhiteBoxDeprecated>
    );
  }
}

export default ResetStep1;
