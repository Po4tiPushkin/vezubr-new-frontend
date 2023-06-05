import React from 'react';
import PropTypes from 'prop-types';

import { ButtonDeprecated, Loader } from '@vezubr/elements';
import { InputField } from '@vezubr/components';
import t from '@vezubr/common/localization';
import Static from '@vezubr/common/constants/static';
const patterns = Static.patterns;

const validators = {
  name: (name) => !name.trim() && t.error('requiredField'),
  comment: (comment) => !comment.trim() && t.error('requiredField'),
  workingConditions: (workingConditions) => !workingConditions.trim() && t.error('requiredField'),
  email: (email) => (!email.trim() ? t.error('noEmail') : !patterns.email.test(email) ? t.error('emailFormat') : false),
};

const validateValues = (values) => {
  const errors = {};

  for (const name of Object.keys(values)) {
    errors[name] = validators[name] && validators[name](values[name]);
  }

  const hasErrors = Object.values(errors).some((errVal) => !!errVal);

  return [hasErrors, errors];
};

function AgentForm(props) {
  const { values: valuesInput, sending, onCancel } = props;

  const [values, setValues] = React.useState({
    name: '',
    comment: '',
    workingConditions: '',
    email: '',
    ...valuesInput,
  });

  const [errors, setErrors] = React.useState({});

  const onChange = React.useCallback(
    (fieldName, e) => {
      const currValues = {
        [fieldName]: e.target.value,
      };

      const [, currErrors] = validateValues(currValues);

      setValues({ ...values, ...currValues });
      setErrors({ ...errors, ...currErrors });
    },
    [values, errors],
  );

  const onSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      const [hasErrors, errors] = validateValues(values);

      if (hasErrors) {
        setErrors(errors);
        return;
      }

      if (props.onSubmit) {
        props.onSubmit(values);
      }
    },
    [errors, values],
  );

  return (
    <div className="agent-form">
      <div className={'area'}>
        <p className={'area-title'}>{t.order('generalInfo')}</p>
        <div className={'flexbox margin-top-14'}>
          <div className={'area-left'}>
            <InputField
              title={'Имя агента'}
              placeholder={'ФИО'}
              type={'text'}
              name={'name'}
              error={errors['name']}
              value={values['name'] || ''}
              onChange={(e) => onChange('name', e)}
            />
          </div>
          <div className={'area-right margin-left-8'}>
            <InputField
              title={t.order('contactEmail')}
              type={'text'}
              name={'email'}
              error={errors['email']}
              value={values['email'] || ''}
              onChange={(e) => onChange('email', e)}
            />
          </div>
        </div>
      </div>

      <div className={'area'}>
        <p className={'area-title'}>{t.order('more')}</p>
        <InputField
          title={t.order('comments')}
          name={'comment'}
          textarea={true}
          error={errors['comment']}
          value={values['comment'] || ''}
          onChange={(e) => onChange('comment', e)}
        />
        <div className={'margin-top-14'}>
          <InputField
            title="Условия труда"
            name={'workingConditions'}
            textarea={true}
            error={errors['workingConditions']}
            value={values['workingConditions'] || ''}
            onChange={(e) => onChange('workingConditions', e)}
          />
        </div>
      </div>

      <div className={'flexbox justify-right margin-top-24 margin-bottom-24'}>
        {onCancel && (
          <ButtonDeprecated className={'semi-wide'} theme={'secondary'} onClick={onCancel}>
            {t.order('cancel')}
          </ButtonDeprecated>
        )}

        <ButtonDeprecated onClick={onSubmit} className={'semi-wide margin-left-16'} theme={'primary'} loading={sending}>
          Сохранить
        </ButtonDeprecated>
      </div>

      {sending && <Loader />}
    </div>
  );
}

AgentForm.contextTypes = {
  history: PropTypes.object,
};

AgentForm.propTypes = {
  values: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  sending: PropTypes.bool,
};

export default AgentForm;
