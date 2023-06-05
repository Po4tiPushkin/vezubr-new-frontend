import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm } from '@vezubr/elements';
import _merge from 'lodash/merge';
import cn from 'classnames';
import t from '@vezubr/common/localization';
const MARGIN_MODES_CHANGES = [
  {
    key: 0,
    value: 'amount',
    text: 'Фиксированная стоимость',
  },
  {
    key: 1,
    value: 'percent',
    text: 'В процентах',
  },
];

const PUBLICATION_MODES_CHANGES = [
  {
    key: 0,
    value: 'auto',
    text: 'Автоматический режим',
  },
  {
    key: 1,
    value: 'manual',
    text: 'Ручной режим',
  },
];

const CLS = 'settings-form';

const SettingsContourForm = ({ onSave, values = {}, title }) => {
  const publicationModesOptions = useMemo(
    () =>
      PUBLICATION_MODES_CHANGES.map((item) => (
        <Ant.Select.Option key={item.key} value={item.value}>
          {item.text}
        </Ant.Select.Option>
      )),
    [PUBLICATION_MODES_CHANGES],
  );

  const marginModesOptions = useMemo(
    () =>
      MARGIN_MODES_CHANGES.map((item) => (
        <Ant.Select.Option key={item.key} value={item.value}>
          {item.text}
        </Ant.Select.Option>
      )),
    [MARGIN_MODES_CHANGES],
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

  const handleChange = (value, path) => {
    const result = _merge({ ...values }, assignMeaning(path.split('.'), value));
    onSave(result);
  };

  const formatter = React.useCallback((value, format) => {
    const parsed = ~~value;

    return format === 'percent' ? `${parsed} %` : `${parsed} руб`;
  }, []);

  return (
    <>
      <Ant.Form layout="vertical">
        <VzForm.Group>
          <h2 className={`${CLS}__group__title`}>
            <Ant.Tooltip placement="right" title={t.settings('hint.sharing')}>
              <div className={`settings-page__hint-title`}> {title} {<Ant.Icon type={'info-circle'} />}</div>
            </Ant.Tooltip>
          </h2>
          <VzForm.Row>
            <VzForm.Col span={24}>
              <VzForm.Item label={'Режим публикации рейса в собственном контуре'}>
                <Ant.Select value={values?.strategy} onChange={(e) => handleChange(e, 'strategy')}>
                  {publicationModesOptions}
                </Ant.Select>
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <h2 className={`${CLS}__group__subtitle`}>
            <Ant.Tooltip placement="right" title={t.settings(`hint.margin${values?.type}`)}>
              <div className={`settings-page__hint-title`}>Маржинальность {<Ant.Icon type={'info-circle'} />}</div>
            </Ant.Tooltip>
          </h2>
          <VzForm.Row>
            <VzForm.Col span={8}>
              <div className={`${CLS}__group__body`}>
                <Ant.Tooltip placement="right" title={t.settings('hint.sharingCity')}>
                  <div className={`settings-page__hint-title`}>Городской рейс {<Ant.Icon type={'info-circle'} />}</div>
                </Ant.Tooltip>
              </div>
              <VzForm.Col span={24}>
                <VzForm.Item label={'Задать минимальную маржинальность'}>
                  <Ant.Select
                    value={values?.margin?.transport?.type || 'amount'}
                    onChange={(e) => handleChange(e, 'margin.transport.type')}
                  >
                    {marginModesOptions}
                  </Ant.Select>
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={24}>
                <VzForm.Item
                  label={`Значение маржинальности ${values?.margin?.transport?.type === 'percent' ? '%' : 'руб.'}`}
                >
                  <Ant.InputNumber
                    placeholder={''}
                    allowClear={true}
                    decimalSeparator={','}
                    maxLength={values?.margin?.transport?.type === 'percent' ? 5 : 9}
                    max={values?.margin?.transport?.type === 'percent' ? 100 : 99999999999}
                    min={0}
                    precision={values?.margin?.transport?.type === 'percent' ? 2 : 0}
                    step={1}
                    defaultValue={values?.margin?.transport?.value}
                    value={values?.margin?.transport?.value}
                    onChange={(e) => handleChange(e, 'margin.transport.value')}
                  />
                </VzForm.Item>
              </VzForm.Col>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <div className={`${CLS}__group__body`}>
                <Ant.Tooltip placement="right" title={t.settings('hint.sharingIntercity')}>
                  <div className={`settings-page__hint-title`}>
                    Междугородний рейс {<Ant.Icon type={'info-circle'} />}
                  </div>
                </Ant.Tooltip>
              </div>
              <VzForm.Col span={24}>
                <VzForm.Item label={'Задать минимальную маржинальность'}>
                  <Ant.Select
                    value={values?.margin?.transportIntercity?.type || 'amount'}
                    onChange={(e) => handleChange(e, 'margin.transportIntercity.type')}
                  >
                    {marginModesOptions}
                  </Ant.Select>
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={24}>
                <VzForm.Item
                  label={`Значение маржинальности ${values?.margin?.transportIntercity?.type === 'percent' ? '%' : 'руб.'
                    }`}
                >
                  <Ant.InputNumber
                    placeholder={''}
                    allowClear={true}
                    decimalSeparator={','}
                    maxLength={values?.margin?.transportIntercity?.type === 'percent' ? 5 : 9}
                    max={values?.margin?.transportIntercity?.type === 'percent' ? 100 : 99999999999}
                    min={0}
                    step={1}
                    precision={values?.margin?.transportIntercity?.type === 'percent' ? 2 : 0}
                    defaultValue={values?.margin?.transportIntercity?.value}
                    value={values?.margin?.transportIntercity?.value}
                    onChange={(e) => handleChange(e, 'margin.transportIntercity.value')}
                  />
                </VzForm.Item>
              </VzForm.Col>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <div className={`${CLS}__group__body`}>
                <Ant.Tooltip placement="right" title={t.settings('hint.sharingLoaders')}>
                  <div className={`settings-page__hint-title`}>
                    ПРР {<Ant.Icon type={'info-circle'} />}
                  </div>
                </Ant.Tooltip>
              </div>
              <VzForm.Col span={24}>
                <VzForm.Item label={'Задать минимальную маржинальность'}>
                  <Ant.Select
                    defaultValue={values?.margin?.loaders?.type || 'amount'}
                    onChange={(e) => handleChange(e, 'margin.loaders.type')}
                  >
                    {marginModesOptions}
                  </Ant.Select>
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={24}>
                <VzForm.Item
                  label={`Значение маржинальности ${values?.margin?.loaders?.type === 'percent' ? '%' : 'руб.'
                    }`}
                >
                  <Ant.InputNumber
                    placeholder={''}
                    allowClear={true}
                    decimalSeparator={','}
                    maxLength={values?.margin?.loaders?.type === 'percent' ? 5 : 9}
                    max={values?.margin?.loaders?.type === 'percent' ? 100 : 99999999999}
                    min={0}
                    precision={values?.margin?.loaders?.type === 'percent' ? 2 : 0}
                    step={1}
                    defaultValue={values?.margin?.loaders?.value}
                    value={values?.margin?.loaders?.value}
                    onChange={(e) => handleChange(e, 'margin.loaders.value')}
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

SettingsContourForm.propTypes = {
  onSave: PropTypes.func,
  form: PropTypes.object,
  values: PropTypes.object,
  title: PropTypes.string,
};

export default Ant.Form.create({
  name: 'settings_form',
})(SettingsContourForm);
