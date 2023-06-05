import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm } from '@vezubr/elements';
import _merge from 'lodash/merge';
import t from '@vezubr/common/localization';

const CLS = 'settings-form';

const SettingsTimeoutForm = ({ onSave, values = {}, title }) => {
  const handleChange = (value, path) => {
    const result = {
      ...values,
      [path]: value,
    };
    onSave(result);
  };

  return (
    <>
      <Ant.Form layout="vertical">
        <VzForm.Group>
          <h2 className={`${CLS}__group__subtitle`}>
            <div className={`settings-page__hint-title`}>
              {title}
            </div>
          </h2>
          <VzForm.Row>
            <VzForm.Col span={6}>
              <div className={`${CLS}__group__body`}>
                <div className={`settings-page__hint-title`}>Городской рейс</div>
              </div>
              <VzForm.Col span={24}>
                <VzForm.Item label={`Значение (в часах)`}>
                  <Ant.InputNumber
                    placeholder={''}
                    allowClear={true}
                    maxLength={9}
                    max={99999999999}
                    min={1}
                    precision={0}
                    step={1}
                    defaultValue={values?.transport}
                    value={values?.transport}
                    onChange={(e) => handleChange(e, 'transport')}
                  />
                </VzForm.Item>
              </VzForm.Col>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <div className={`${CLS}__group__body`}>
                <div className={`settings-page__hint-title`}>Междугородний рейс</div>
              </div>
              <VzForm.Col span={24}>
                <VzForm.Item label={`Значение (в часах)`}>
                  <Ant.InputNumber
                    placeholder={''}
                    allowClear={true}
                    decimalSeparator={','}
                    maxLength={9}
                    max={99999999999}
                    min={1}
                    step={1}
                    precision={0}
                    defaultValue={values?.transportIntercity}
                    value={values?.transportIntercity}
                    onChange={(e) => handleChange(e, 'transportIntercity')}
                  />
                </VzForm.Item>
              </VzForm.Col>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <div className={`${CLS}__group__body`}>
                <div className={`settings-page__hint-title`}>ПРР</div>
              </div>
              <VzForm.Col span={24}>
                <VzForm.Item label={`Значение (в часах)`}>
                  <Ant.InputNumber
                    placeholder={''}
                    allowClear={true}
                    decimalSeparator={','}
                    maxLength={9}
                    max={99999999999}
                    min={1}
                    precision={0}
                    step={1}
                    defaultValue={values?.loaders}
                    value={values?.loaders}
                    onChange={(e) => handleChange(e, 'loaders')}
                  />
                </VzForm.Item>
              </VzForm.Col>
            </VzForm.Col>
            <VzForm.Col span={6}>
                <div className={`${CLS}__group__body`}>
                  <div className={`settings-page__hint-title`}>Международный рейс </div>
                </div>
                <VzForm.Col span={24}>
                  <VzForm.Item label={`Значение (в часах)`}>
                    <Ant.InputNumber
                      placeholder={''}
                      allowClear={true}
                      decimalSeparator={','}
                      maxLength={9}
                      max={99999999999}
                      min={1}
                      precision={0}
                      step={1}
                      defaultValue={values?.transportInternational}
                      value={values?.transportInternational}
                      onChange={(e) => handleChange(e, 'transportInternational')}
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

SettingsTimeoutForm.propTypes = {
  onSave: PropTypes.func,
  form: PropTypes.object,
  values: PropTypes.object,
  title: PropTypes.string,
};

export default Ant.Form.create({
  name: 'settings_form',
})(SettingsTimeoutForm);
