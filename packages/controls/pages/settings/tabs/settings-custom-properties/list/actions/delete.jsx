import React from 'react';
import { Profile as ProfileService } from '@vezubr/services';
import { IconDeprecated, showError, CustomBoxDeprecated, showConfirm, Ant } from '@vezubr/elements';
import { ModalDeprecated, InputField } from '@vezubr/components'
import t from '@vezubr/common/localization'

function DeleteAction({ id, reloadCustomProps }) {

  const onDelete = React.useCallback(async () => {
    try {
      showConfirm({
        onOk: async () => {
          await ProfileService.customPropsDelete(id);
          reloadCustomProps();
        }
      })
    } catch (e) {
      showError(e)
      console.error(e);
    }
  }, []);

  return (
    <>
      <div onClick={onDelete}>
        <IconDeprecated name={'trashBinBlack'} />
      </div>
    </>
  );
}

export default DeleteAction;
