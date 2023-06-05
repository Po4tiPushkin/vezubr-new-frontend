import React from 'react';
import StrengthCalculator from './strengthCalculator';
import t from '@vezubr/common/localization';

const shapesLength = [0, 20, 40, 60, 70];

class PasswordStrength extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { password } = this.props;
    const score = password.length ? StrengthCalculator.score(password) : 0;
    const strengthText = StrengthCalculator.text(score);
    const shapes = shapesLength.map((val, key) => {
      const className = score >= val && score !== 0 ? 'active' : 'passive';
      return <div key={key} className={`shape ${className} ${score <= 20 && score !== 0 ? 'poor' : ''}`} />;
    });
    return (
      <div className={'password-strength flexbox margin-top-18 column'}>
        <div className={'flexbox'}>{shapes}</div>
        <p className={'text-left margin-top-13'}>
          {t.reg('pwdStrength')}: {strengthText}
        </p>
      </div>
    );
  }
}

export default PasswordStrength;
