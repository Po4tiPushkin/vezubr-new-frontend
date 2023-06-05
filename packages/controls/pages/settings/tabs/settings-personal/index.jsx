import compose from '@vezubr/common/hoc/compose';
import { Ant, showError, WhiteBox, VzForm, IconDeprecated } from '@vezubr/elements';
import { User as UserService } from '@vezubr/services';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SettingsPersonalForm from '../../../../forms/settings/settings-personal-form';

const MESSAGE_KEY = 'settings_personal_saving';

function SettingsPersonal() {
  const userSettings = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();
  const [edited, setEdited] = React.useState(false);

  const onSave = useCallback(
    async (form) => {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

      if (errors !== null) {
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }
      const { monitorFilter } = values;
      try {
        Ant.message.loading({
          content: 'Сохраняем',
          key: MESSAGE_KEY,
        });
        await UserService.saveInterfaceSettings({ ...userSettings, monitorFilter });
        dispatch({ type: 'USER_SETTINGS_UPDATE', settings: { monitorFilter } })
        setEdited(false)
        Ant.message.success({
          content: 'Данные обновлены',
          key: MESSAGE_KEY,
        });
      } catch (e) {
        console.error(e);
        showError(e);
      }
    },
    [userSettings],
  );

  return (
    <>
      <WhiteBox.Header type={'h1'} icon={<IconDeprecated name={'settingsOrange'} />} iconStyles={{ color: '#F57B23' }}>
        Персональные настройки
      </WhiteBox.Header>
      <SettingsPersonalForm onSave={onSave} userSettings={userSettings} edited={edited} setEdited={setEdited} />
    </>
  );
}

SettingsPersonal.propTypes = {
  transportOrderStatuses: PropTypes.object,
  vehicleTypes: PropTypes.object,
  addressTypes: PropTypes.object,
};

export default compose([observer])(SettingsPersonal);
