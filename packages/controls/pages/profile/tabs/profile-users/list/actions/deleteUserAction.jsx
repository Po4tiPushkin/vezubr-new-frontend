import React from 'react';
import { Profile as ProfileService } from '@vezubr/services';
import { IconDeprecated, showError, CustomBoxDeprecated } from '@vezubr/elements';
import { ModalDeprecated, InputField } from '@vezubr/components'
import t from '@vezubr/common/localization'

function DeleteUserAction({ userId, reloadUsers }) {
  const [modalVisible, setModalVisible] = React.useState(false)
  const [password, setPassword] = React.useState(null)

  const onUserDelete = React.useCallback(async () => {
    if (!password) return;
    try {
      await ProfileService.contractorDeleteUser({ id: String(userId), password });
      reloadUsers()
      setModalVisible(false)
      setPassword(null)
    } catch (e) {
      if (e.error_no === 3) {
        showError(e)
      }
      console.warn(e);
    }
  });

  return (
    <>
      <div onClick={(e) => setModalVisible(true)}>
        <IconDeprecated name={'trashBinBlack'} />
      </div>
      <ModalDeprecated
        title={{
          classnames: 'identificator',
          text: t.common('confirm'),
        }}
        options={{ showModal: modalVisible, showClose: true }}
        size={'small'}
        onClose={() => setModalVisible(false)}
        animation={false}
        content={
          <CustomBoxDeprecated
            content={
              <div>
                <InputField
                  title={t.reg('password')}
                  type={'password'}
                  name={'docName'}
                  value={password || ''}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            }
            buttons={[
              {
                text: t.common('confirm'),
                theme: 'primary',
                event: onUserDelete,
              },
            ]}
          />
        }
      />
    </>
  );
}

export default DeleteUserAction;
