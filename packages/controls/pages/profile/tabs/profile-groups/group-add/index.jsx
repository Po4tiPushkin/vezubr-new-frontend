import React from 'react';
import { Ant, showAlert, VzForm, showError } from "@vezubr/elements";
import PropTypes from "prop-types";
import { Profile as ProfileService } from '@vezubr/services';
import { formatterUserDataForSend } from "../../../utils";
import ProfileGroupForm from '../../../../../forms/profile-form/group-form'
function ProfileGroupAdd(props) {
  const { dictionaries, goToGroups } = props;
  const [formErrors, setFormErrors] = React.useState({});
  const onSave = async (form, extraData) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null || extraData?.groupRestrictions?.find(item => !item.value)) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }

    const submitData = {
      ...values,
      config: extraData.groupRestrictions.reduce((acc, curr) => {
        if (!acc[curr.id]) {
          acc[curr.id] = curr.id == 'clientId' ? parseInt(curr.value) : curr.value
        }
        return acc;
      }, {})
    }

    try {
      await ProfileService.contractorGroupAdd(submitData);
      showAlert({
        title: 'Готово',
        content: 'Группа успешно создана',
        onOk: () => goToGroups(),
      });
    } catch (e) {
      showError(e);
      console.error(e);
      VzForm.Utils.handleApiFormErrors(e, form)
    }
  }

  return (
    <ProfileGroupForm
      dictionaries={dictionaries}
      onSave={onSave}
      errors={formErrors}
    />
  );
}

export default ProfileGroupAdd;