import React from 'react';
import { WhiteBoxDeprecated, Logo, ButtonDeprecated } from '@vezubr/elements';
import InputField from '../inputField/inputField';
import autobind from 'autobind-decorator';
import { User as UserService } from '@vezubr/services';
import t from '@vezubr/common/localization';

class RegisterStep2 extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      activationCode: '',
      errors: {
        activationCode: false,
      },
      loading: false,
    };
  }

  @autobind
  handleChange(type, e) {
    const { errors } = this.state;
    errors[type] = false;
    this.setState({
      [type]: e.target.value,
      errors,
    });
  }

  @autobind
  async submit(e) {
    e.preventDefault();
    const { phoneNumber, onComplete } = this.props;
    const { errors } = this.state;
    const { activationCode } = this.state;
    this.setState({ loading: true });
    try {
      await UserService.confirmPhone({
        phone: phoneNumber.replace(/\D/g, ''),
        code: activationCode,
      });
      onComplete(activationCode);
    } catch (e) {
      errors.activationCode = t.error('activationCode');
      this.setState({ errors });
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

  render() {
    const { errors, activationCode } = this.state;
    const { phoneNumber } = this.props;
    return (
      <WhiteBoxDeprecated>
        <Logo />
        <form onSubmit={this.submit}>
          <h2 className={'main-sub-title'}>Регистрация</h2>
          <h3 className={'main-secondary-title'}>
            На номер {phoneNumber} было отправлено сообщение с кодом подтверждения. Введите полученный пароль для
            завершения регистрации.
          </h3>
          <div className={'form-wrapper'}>
            <InputField
              title={'КОД ПОДТВЕРЖДЕНИЯ'}
              type={'text'}
              className={activationCode.length ? 'active' : ''}
              value={activationCode}
              error={errors.activationCode}
              onChange={(e) => this.handleChange('activationCode', e)}
            />
            <div className={'buttons-wrapper margin-top-31'}>
              <ButtonDeprecated theme={'primary'} onClick={this.submit} loading={this.state.loading} wide={true}>
                Продолжить
              </ButtonDeprecated>
              <ButtonDeprecated className={'margin-top-16'} theme={'secondary'} onClick={this.rollBack} wide={true}>
                Изменить номер
              </ButtonDeprecated>
              <ButtonDeprecated
                className={'margin-top-16'}
                theme={'secondary'}
                onClick={this.resendActivationCode}
                wide={true}
              >
                {' '}
                Отправить пароль снова
              </ButtonDeprecated>
            </div>
          </div>
        </form>
      </WhiteBoxDeprecated>
    );
  }
}

export default RegisterStep2;
