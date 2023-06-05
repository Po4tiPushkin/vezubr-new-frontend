import React, { useState, useMemo, useCallback } from 'react';
import { WhiteBox, Logo, ButtonDeprecated, showError, Ant, VzForm } from '@vezubr/elements';
import { User as UserService } from '@vezubr/services';
import t from '@vezubr/common/localization';
import Static from '@vezubr/common/constants/static';

const patterns = Static.patterns;

const ResetStep1 = (props) => {
  const { onComplete, history } = props;
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = useCallback(() => {
    const newError = !email ? t.error('noEmail') : !patterns.email.test(email) ? t.error('emailFormat') : false;
    setError(newError);
    return newError;
  }, [email])

  const onSend = useCallback(async () => {
    if (validate()) {
      return;
    }
    setLoading(true);
    try {
      await UserService.forgotPasswordRequest({ email });
      onComplete(1);
    } catch (e) {
      console.error(e);
      showError(e);
    }
    finally {
      setLoading(false);
    }
  }, [email, error, onComplete])

  return (
    <WhiteBox style={{ height: '544px' }}>
      <Logo />
      <h2 className={'main-sub-title'}>{t.reg('resetEmailText')}</h2>
      <h3 className={'main-secondary-title margin-top-8'}>{t.reg('resetEmailDescription')}</h3>
      <div className={'form-wrapper'}>
        <VzForm.Item label={'Введите почту'} error={error || ''}>
          <Ant.Input
            value={email}
            onChange={(e) => {
              if (error) {
                setError('');
              };
              setEmail(e.target.value);
            }}
          />
        </VzForm.Item>
        <div className='margin-top-15'>
          <div>
            <Ant.Button type='primary' style={{ width: '100%' }} loading={loading} onClick={() => onSend()} >
              {t.buttons('resetPassword')}
            </Ant.Button>
          </div>
          <div>
            <Ant.Button type='secondary' className='margin-top-15' style={{ width: '100%' }} onClick={() => history.push('/login')} >
              {t.buttons('cancel')}
            </Ant.Button>
          </div>

        </div>
      </div>
    </WhiteBox>
  )
}

export default ResetStep1;