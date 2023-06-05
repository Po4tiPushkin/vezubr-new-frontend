import React from 'react';
import PropTypes from 'prop-types';

import { ButtonDeprecated, Loader } from '@vezubr/elements';
import { InputField } from '@vezubr/components';
import t from '@vezubr/common/localization';

import { CONTOUR_COMMISSION_PAYER, CONTOUR_TYPES } from '@vezubr/common/constants/constants';

const validators = {
  title: (title) => !title.trim() && t.error('requiredField'),
  type: (type) => !type && t.error('requiredField'),
  comissionPayer: (comissionPayer) => !comissionPayer && t.error('requiredField'),
};

const validateValues = (values) => {
  const errors = {};

  for (const name of Object.keys(values)) {
    errors[name] = validators[name] && validators[name](values[name]);
  }

  const hasErrors = Object.values(errors).some((errVal) => !!errVal);

  return [hasErrors, errors];
};

const getCheckboxConfig = (value) => ({
  checked: value,
  text: value ? 'Да' : 'Нет',
});

function ContourForm(props) {
  const { values: valuesInput, sending, onCancel } = props;

  const [values, setValues] = React.useState({
    title: '',
    type: '',
    contractorAutoJoin: 0,
    allowDocAccept: 0,
    allowRegistries: 0,
    allowActs: 0,
    comissionPayer: 0,
    ...valuesInput,
  });

  const [errors, setErrors] = React.useState({});

  const onChange = React.useCallback(
    (fieldName, e) => {
      let currValue = e?.target?.value;

      if (fieldName === 'type' || fieldName === 'comissionPayer') {
        currValue = parseInt(e?.key, 10);
      } else if (typeof currValue === 'boolean') {
        currValue = currValue ? 1 : 0;
      }

      const currValues = {
        [fieldName]: currValue,
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
    <div className="contour-form">
      <div className={'area'}>
        <p className={'area-title'}>{t.order('generalInfo')}</p>
        <div className={'flexbox margin-top-14'}>
          <div className={'area-left'}>
            <InputField
              title="Наименование контура"
              type={'text'}
              name={'title'}
              error={errors['title']}
              value={values['title'] || ''}
              onChange={(e) => onChange('title', e)}
            />
          </div>
          <div className={'area-right margin-left-8'}>
            <InputField
              title="Тип контура"
              type={'text'}
              name={'type'}
              dropDown={{
                data: CONTOUR_TYPES,
              }}
              error={errors['type']}
              value={CONTOUR_TYPES[values.type] || ''}
              onChange={(e) => onChange('type', e)}
            />
          </div>
        </div>

        <div className={'flexbox margin-top-14'}>
          <div className={'area-left'}>
            <InputField
              title="Автоматическое присоединение"
              name={'contractorAutoJoin'}
              checkbox={getCheckboxConfig(values.contractorAutoJoin)}
              value={values['contractorAutoJoin'] || false}
              onChange={(e) => onChange('contractorAutoJoin', { target: { value: !values.contractorAutoJoin } })}
            />
          </div>
          <div className={'area-right margin-left-8'}>
            <InputField
              title="Включена проверка документов"
              name={'allowDocAccept'}
              checkbox={getCheckboxConfig(values.allowDocAccept)}
              value={values['allowDocAccept'] || false}
              onChange={(e) => onChange('allowDocAccept', { target: { value: !values.allowDocAccept } })}
            />
          </div>
        </div>

        <div className={'flexbox margin-top-14'}>
          <div className={'area-left'}>
            <InputField
              title="Включены реестры"
              name={'allowRegistries'}
              checkbox={getCheckboxConfig(values.allowRegistries)}
              value={values['allowRegistries'] || false}
              onChange={(e) => onChange('allowRegistries', { target: { value: !values.allowRegistries } })}
            />
          </div>
          <div className={'area-right margin-left-8'}>
            <InputField
              title="Включены акты"
              name={'allowActs'}
              checkbox={getCheckboxConfig(values.allowActs)}
              value={values['allowActs'] || false}
              onChange={(e) => onChange('allowActs', { target: { value: !values.allowActs } })}
            />
          </div>
        </div>

        <div className={'flexbox margin-top-14'}>
          <div className={'area-left'}>
            <InputField
              title="Кто платит комиссию"
              type={'text'}
              name={'type'}
              dropDown={{
                data: CONTOUR_COMMISSION_PAYER,
              }}
              error={errors['comissionPayer']}
              value={CONTOUR_COMMISSION_PAYER[values.comissionPayer] || ''}
              onChange={(e) => onChange('comissionPayer', e)}
            />
          </div>

          <div className={'area-right margin-left-8'} />
        </div>

        <div className={'flexbox justify-right margin-top-24 margin-bottom-24'}>
          {onCancel && (
            <ButtonDeprecated className={'semi-wide'} theme={'secondary'} onClick={onCancel}>
              {t.order('cancel')}
            </ButtonDeprecated>
          )}
          <ButtonDeprecated
            onClick={onSubmit}
            className={'semi-wide margin-left-16'}
            theme={'primary'}
            loading={sending}
          >
            Сохранить
          </ButtonDeprecated>
        </div>
      </div>

      {sending && <Loader />}
    </div>
  );
}

ContourForm.contextTypes = {
  history: PropTypes.object,
};

ContourForm.propTypes = {
  values: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  sending: PropTypes.bool,
};

export default ContourForm;
