import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm, showError } from '@vezubr/elements';
import _merge from 'lodash/merge';
import _isEqual from 'lodash/isEqual';
import { Common as CommonServices } from '@vezubr/services';
import TooltipError from '@vezubr/elements/form/controls/tooltip-error';
import cn from 'classnames';
import t from '@vezubr/common/localization';

const AUTO_UPDATE = [
  {
    key: 0,
    value: true,
    text: 'Да',
  },
  {
    key: 1,
    value: false,
    text: 'Нет',
  },
];

const CALCULATE_STRATEGY = [
  {
    key: 0,
    value: 'increase_changes',
    text: 'Обновлять предложение только при увеличении Базовых Предложений',
  },
  {
    key: 1,
    value: 'any_changes',
    text: 'Обновлять при любом изменении Базовых предложений',
  },
];

const FIELDS = {
  isAutoUpdate: 'isAutoUpdate',
  minStepPercent: 'minStepPercent',
  calculateStrategy: 'calculateStrategy',
};

export const validators = {
  [FIELDS.minStepPercent]: (minStepPercent) => !minStepPercent && 'Выберите величину изменения среднего значения',
  [FIELDS.calculateStrategy]: (calculateStrategy) => !calculateStrategy && 'Выберите алгоритм изменения ',
};

const CLS = 'settings-form'

const MESSAGE_KEY = '__SettingsCargoPlace__';

const SettingsBargainForm = ({ setValues, values = {}, form }) => {
  const { getFieldError, getFieldDecorator, setFieldsValue } = form;
  const rules = VzForm.useCreateAsyncRules(validators);

  const autoUpdateOptions = useMemo(
    () =>
      AUTO_UPDATE.map((item) => (
        <Ant.Select.Option key={item.key} value={item.value}>
          {item.text}
        </Ant.Select.Option>
      )),
    [AUTO_UPDATE],
  );

  const calculateStrategyOptions = useMemo(
    () =>
      CALCULATE_STRATEGY.map((item) => (
        <Ant.Select.Option key={item.key} value={item.value}>
          {item.text}
        </Ant.Select.Option>
      )),
    [CALCULATE_STRATEGY],
  );

  const assignMeaning = (path, value) => {
    const cur = path[0];

    if (path.length === 1) {
      return {
        [cur]: value,
      };
    }

    path.shift();
    return {
      [cur]: assignMeaning(path, value),
    };
  };

  const handleChange = async (value, path) => {
    const result = _merge({ ...values }, assignMeaning(path.split('.'), value));
    if (!result.isAutoUpdate) {
      setValues(() => {
        Object.entries(result).forEach((el) => {
          if (el[0] !== 'isAutoUpdate') {
            result[el[0]] = null;
            setFieldsValue({ [el[0]]: null });
          }
        });
        return result;
      });
    } else {
      setValues((prev) => ({ ...prev, ...result }));
    }
    await VzForm.Utils.validateFieldsFromAntForm(form);
  };

  return (
    <Ant.Form layout="vertical">
      <VzForm.Group>
        <div className={`${CLS}__group__subtitle`}>
          <Ant.Tooltip placement="right" title={t.settings('hint.autoUpdate')}>
            <div className={`settings-page__hint-title`}>
              Автоматически изменять предложение заказчику на основе базовых предложений {<Ant.Icon type={'info-circle'} />}
            </div>
          </Ant.Tooltip>
        </div>
        <VzForm.Row>
          <VzForm.Col span={7}>
            <VzForm.Item label={'Включить автоматическое изменение'}>
              {getFieldDecorator(FIELDS.isAutoUpdate, {
                rules: rules[FIELDS.isAutoUpdate](),
                initialValue: values?.[FIELDS.isAutoUpdate] || false,
              })(<Ant.Select onChange={(e) => handleChange(e, 'isAutoUpdate')}>{autoUpdateOptions}</Ant.Select>)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={7}>
            <VzForm.Item label={'Величина изменения среднего значения, %'}>
              {getFieldDecorator(FIELDS.minStepPercent, {
                rules: rules[FIELDS.minStepPercent]() || '',
                initialValue: values?.[FIELDS.minStepPercent] || null,
              })(
                <Ant.InputNumber
                  placeholder={''}
                  allowClear={true}
                  decimalSeparator={','}
                  min={0}
                  max={100}
                  step={1}
                  disabled={!values?.isAutoUpdate}
                  onChange={(e) => handleChange(e, 'minStepPercent')}
                />,
              )}
              {values[FIELDS.isAutoUpdate] ? <TooltipError error={getFieldError(FIELDS.minStepPercent)} /> : null}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
        <div className={`${CLS}__group__subtitle`}>
          <div className={`settings-page__hint-title`}>
            Алгоритм изменения предложения заказчику на основе изменения базовых предложений
          </div>
        </div>
        <VzForm.Row>
          <VzForm.Col span={14}>
            <VzForm.Item label={'Задать алгоритм изменения предложения заказчику'}>
              {getFieldDecorator(FIELDS.calculateStrategy, {
                rules: rules[FIELDS.calculateStrategy](),
                initialValue: values?.[FIELDS.calculateStrategy] || null,
              })(
                <Ant.Select disabled={!values?.isAutoUpdate} onChange={(e) => handleChange(e, 'calculateStrategy')}>
                  {calculateStrategyOptions}
                </Ant.Select>,
              )}
              {values[FIELDS.isAutoUpdate] ? <TooltipError error={getFieldError(FIELDS.calculateStrategy)} /> : null}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>
    </Ant.Form>
  );
};

SettingsBargainForm.propTypes = {
  setValues: PropTypes.func,
  form: PropTypes.object,
  values: PropTypes.object,
  title: PropTypes.string,
};

export default Ant.Form.create({
  name: 'settings_form',
})(SettingsBargainForm);
