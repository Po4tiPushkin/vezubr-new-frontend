import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm, WhiteBox, IconDeprecated, showError } from '@vezubr/elements';
import cn from 'classnames';
import t from '@vezubr/common/localization';
import { useSelector } from 'react-redux';
import { TopNavControl } from '@vezubr/components';
import _isEqual from 'lodash/isEqual';

const FIELDS = {
  monitorFilter: 'monitorFilter',
};

const CLS = 'settings-form'

const SettingsPersonalForm = ({ onSave, form, userSettings, edited }) => {
  const { getFieldDecorator } = form;
  const dictionaries = useSelector((state) => state.dictionaries);
  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      if (onSave) {
        onSave(form);
      }
    },
    [form, onSave],
  );

  const viewModesInMonitorOptions = useMemo(
    () =>
      dictionaries?.monitorFilterSetting?.map((item) => (
        <Ant.Select.Option key={item.id} value={item.id}>
          {item.title}
        </Ant.Select.Option>
      )),
    [dictionaries?.monitorFilterSetting],
  );

  return (
    <Ant.Form layout="vertical" onSubmit={handleSave}>
      <VzForm.Group>
        <div className={`${CLS}__group__title`}>
          <Ant.Tooltip placement="right" title={t.settings('hint.monitor')}>
            <div className={`settings-page__hint-title`}>Монитор {<Ant.Icon type={'info-circle'} />}</div>
          </Ant.Tooltip>
        </div>
        <VzForm.Row>
          <VzForm.Item label={'Выводить в мониторе'}>
            {getFieldDecorator(FIELDS.monitorFilter, {
              initialValue: userSettings?.monitorFilter,
            })(<Ant.Select>{viewModesInMonitorOptions}</Ant.Select>)}
          </VzForm.Item>
        </VzForm.Row>
      </VzForm.Group>
      <VzForm.Group>
        <div className={`${CLS}__group__title`}>
          <Ant.Tooltip placement="right" title={t.settings('hint.topNav')}>
            <div className={`settings-page__hint-title`}>
              Настройка верхнего меню {<Ant.Icon type={'info-circle'} />}
            </div>
          </Ant.Tooltip>
        </div>
        <VzForm.Row>
          <TopNavControl />
        </VzForm.Row>
      </VzForm.Group>
      <VzForm.Actions className={'settings-form__actions'}>
        <Ant.Button type="primary" disabled={!edited} onClick={handleSave} className={cn('semi-wide')}>
          Сохранить
        </Ant.Button>
      </VzForm.Actions>
    </Ant.Form>
  );
};

SettingsPersonalForm.propTypes = {
  onSave: PropTypes.func,
  form: PropTypes.object,
  values: PropTypes.object,
};

export default Ant.Form.create({
  name: 'settings_form',
  onValuesChange: ({ setEdited, userSettings }, changedValues) => {
    setEdited(!_isEqual(changedValues, userSettings));
  },
})(SettingsPersonalForm);
