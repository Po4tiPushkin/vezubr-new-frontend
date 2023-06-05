import React from 'react';
import { Ant, showAlert, VzForm, showError } from "@vezubr/elements";
import t from '@vezubr/common/localization';
import { Profile as ProfileService } from '@vezubr/services';
import { formatterUserDataForSend } from "../../../utils";
import ProfileUserForm from '../../../../../forms/profile-form/user-form'
function ProfileUserAdd(props) {
  const { dictionaries, goToUsers } = props;
  const [formErrors, setFormErrors] = React.useState({});
  const onSave = async (form, extraData) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }
    const submitData = formatterUserDataForSend(values);
    if (submitData.hasDigitalSignature) {
      submitData.digitalSignatureType = 1;
    }
    try {
      const { id } = await ProfileService.contractorAddUser(submitData);
      if (extraData?.groups?.length) {
        await ProfileService.addGroupsToEmployee({ employeeId: +id, requestGroupIds: extraData?.groups })
      }

      showAlert({
        title: 'Готово',
        content: t.profile('userCreated'),
        onOk: () => goToUsers(),
      });
    } catch (e) {
      showError(e);
      console.error(e);
      VzForm.Utils.handleApiFormErrors(e?.data, form)
    }
  }

  return (
    <ProfileUserForm
      dictionaries={dictionaries}
      onSave={onSave}
      errors={formErrors}
    />
  );
}

export default ProfileUserAdd;