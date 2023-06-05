import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm } from '@vezubr/elements';
import _merge from 'lodash/merge';
import cn from "classnames";

const MARGIN_MODES_CHANGES = [
  {
    key: 0,
    value: 'amount',
    text: 'Фиксированная стоимость'
  },
  {
    key: 1,
    value: 'percent',
    text: 'В процентах'
  },
]

const PUBLICATION_MODES_CHANGES = [
  {
    key: 0,
    value: 'auto',
    text: 'Автоматический режим'
  },
  {
    key: 1,
    value: 'manual',
    text: 'Ручной режим'
  }
]

const CLS = 'settings-form';

const MarginForm = ({ onSave, values = {}, title, disabled = false, notActive = false }) => {
  const publicationModesOptions = useMemo(() =>
    PUBLICATION_MODES_CHANGES.map((item) => (
      <Ant.Select.Option key={item.key} value={item.value}>
        {item.text}
      </Ant.Select.Option>
    ))
    , [PUBLICATION_MODES_CHANGES]);

  const marginModesOptions = useMemo(() =>
    MARGIN_MODES_CHANGES.map((item) => (
      <Ant.Select.Option key={item.key} value={item.value}>
        {item.text}
      </Ant.Select.Option>
    ))
    , [MARGIN_MODES_CHANGES]);

  const assignMeaning = (path, value) => {
    const cur = path[0];

    if (path.length === 1) {
      return {
        [cur]: value,
      }
    }

    path.shift();
    return {
      [cur]: assignMeaning(path, value),
    }
  }

  const handleChange = (value, path) => {
    const result = _merge({ ...values }, assignMeaning(path.split('.'), value));
    onSave(result);
  }

  const formatter = React.useCallback((value, format) => {
    const parsed = ~~value;

    return format === 'percent' ? `${parsed} %` : `${parsed} руб`
  }, []);

  return (
    <>
      <Ant.Form layout="vertical">
        <VzForm.Group>
          <Ant.Tooltip placement="right">
            <div className="settings-page__form-title">{title}</div>
          </Ant.Tooltip>
          <h2 className={`${CLS}__group__title`}>Маржинальность</h2>
          <VzForm.Row>
            {/* span={window.screen.width > 620 ? 8 : 24} - todo after window size hook */}
            <VzForm.Col span={8}>
              <div className={`${CLS}__group__body`}>Городской рейс</div>
              <VzForm.Col span={24}>
                <VzForm.Item disabled={disabled || notActive} label={'Задать минимальную маржинальность'}>
                  <Ant.Select
                    disabled={disabled || notActive}
                    value={values?.transport?.type || 'amount'}
                    onChange={(e) => handleChange(e, 'transport.type')}
                  >
                    {marginModesOptions}
                  </Ant.Select>
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={24}>
                <VzForm.Item
                  disabled={disabled || notActive}
                  label={`Значение маржинальности ${values?.transport?.type === 'percent' ? '%' : 'руб.'}`}
                >
                  <Ant.InputNumber
                    disabled={disabled || notActive}
                    placeholder={''}
                    allowClear={true}
                    decimalSeparator={','}
                    maxLength={values?.transport?.type === 'percent' ? 5 : 9}
                    max={values?.transport?.type === 'percent' ? 100 : 99999999999}
                    precision={values?.transport?.type === 'percent' ? 2 : 0}
                    min={0}
                    step={1}
                    defaultValue={values?.transport?.value}
                    value={values?.transport?.value}
                    onChange={(e) => handleChange(e, 'transport.value')}
                  />
                </VzForm.Item>
              </VzForm.Col>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <div className={`${CLS}__group__body`}>Междугородний рейс</div>
              <VzForm.Col span={24}>
                <VzForm.Item disabled={disabled || notActive} label={'Задать минимальную маржинальность'}>
                  <Ant.Select
                    disabled={disabled || notActive}
                    value={values?.transportIntercity?.type || 'amount'}
                    onChange={(e) => handleChange(e, 'transportIntercity.type')}
                  >
                    {marginModesOptions}
                  </Ant.Select>
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={24}>
                <VzForm.Item
                  disabled={disabled || notActive}
                  label={`Значение маржинальности ${values?.transportIntercity?.type === 'percent' ? '%' : 'руб.'}`}
                >
                  <Ant.InputNumber
                    disabled={disabled || notActive}
                    placeholder={''}
                    allowClear={true}
                    decimalSeparator={','}
                    maxLength={values?.transportIntercity?.type === 'percent' ? 5 : 9}
                    max={values?.transportIntercity?.type === 'percent' ? 100 : 99999999999}
                    min={0}
                    step={1}
                    precision={2}
                    defaultValue={values?.transportIntercity?.value}
                    value={values?.transportIntercity?.value}
                    onChange={(e) => handleChange(e, 'transportIntercity.value')}
                  />
                </VzForm.Item>
              </VzForm.Col>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <div className={`${CLS}__group__body`}>ПРР</div>
              <VzForm.Col span={24}>
                <VzForm.Item disabled={disabled || notActive} label={'Задать минимальную маржинальность'}>
                  <Ant.Select
                    disabled={disabled || notActive}
                    value={values?.loaders?.type || 'amount'}
                    onChange={(e) => handleChange(e, 'loaders.type')}
                  >
                    {marginModesOptions}
                  </Ant.Select>
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={24}>
                <VzForm.Item
                  disabled={disabled || notActive}
                  label={`Значение маржинальности ${values?.loaders?.type === 'percent' ? '%' : 'руб.'}`}
                >
                  <Ant.InputNumber
                    disabled={disabled || notActive}
                    placeholder={''}
                    allowClear={true}
                    decimalSeparator={','}
                    maxLength={values?.loaders?.type === 'percent' ? 5 : 9}
                    max={values?.loaders?.type === 'percent' ? 100 : 99999999999}
                    min={0}
                    step={1}
                    precision={2}
                    defaultValue={values?.loaders?.value}
                    value={values?.loaders?.value}
                    onChange={(e) => handleChange(e, 'loaders.value')}
                  />
                </VzForm.Item>
              </VzForm.Col>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      </Ant.Form>
    </>
  );
};

export default Ant.Form.create({ name: 'settings_form' })(MarginForm);
