import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import compose from '@vezubr/common/hoc/compose';
import { User as UserService } from '@vezubr/services';
import { Ant, showError, WhiteBox } from '@vezubr/elements';
import SettingsNotificationForm from '../../../../forms/settings/settings-notification-form';
import Utils from '@vezubr/common/common/utils';

const MESSAGE_KEY = '__SettingsNotification__';

function SettingsNotification(props) {
  const onSubmit = useCallback(async (formStore) => {
    formStore.setSending(true);

    const { values, errors } = formStore.getValidateData();

    if (errors) {
      await Utils.setDelay(300);
      Ant.message.error({
        content: 'Исправьте ошибки в форме',
        key: MESSAGE_KEY,
      });
      formStore.setSending(false);
      return;
    }

    try {
      Ant.message.loading({
        content: 'Сохраняем',
        key: MESSAGE_KEY,
      });
      await UserService.saveNotificationSettings(values);
      Ant.message.success({
        content: 'Данные обновлены',
        key: MESSAGE_KEY,
      });
      formStore.setEdited(false)
    } catch (e) {
      console.error(e);
      showError(e);
    }

    formStore.setSending(false);
  }, []);

  const onInit = useCallback(async (formStore) => {
    formStore.setLoading(true);

    try {
      const response = await UserService.getNotificationSettings();
      formStore.setDirtyData(response || {});
      formStore.setEdited(false)
    } catch (e) {
      console.error(e);
      showError(e);
    }

    formStore.setLoading(false);
  }, []);

  return (
    <>
      <WhiteBox.Header type={'h1'} icon={<Ant.Icon type={'message'} />} iconStyles={{ color: '#F57B23' }}>
        Настройка уведомлений
      </WhiteBox.Header>
      <SettingsNotificationForm onSubmit={onSubmit} onInit={onInit} />
    </>
  );
}

SettingsNotification.propTypes = {
  transportOrderStatuses: PropTypes.object,
};

export default compose([observer])(SettingsNotification);
