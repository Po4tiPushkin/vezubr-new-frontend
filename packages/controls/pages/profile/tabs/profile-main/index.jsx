import React, { useState, useMemo } from 'react';
import { Utils } from "@vezubr/common/common";
import { Ant, showAlert, VzForm, showError } from "@vezubr/elements";
import PropTypes from "prop-types";
import { Profile as ProfileService } from '@vezubr/services';
import MainForm from '../../../../forms/profile-form/main-form';
import t from '@vezubr/common/localization';
import { useDispatch } from 'react-redux';
const ProfileMain = (props) => {
  const {
    dictionaries,
    contractor
  } = props;
  const dispatch = useDispatch();

  const [canViewStampAndSignature, setCanView] = React.useState(false);
  const [edited, setEdited] = useState(false)

  React.useEffect(() => {
    const fetchUser = async () => {
      const userData = await ProfileService.contractorGetUser(contractor?.decoded?.userId);

      setCanView(userData.employeeRoles.includes(13))
    }
    fetchUser()
  }, [contractor?.decoded?.userId])

  const onSave = async (form, files) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }

    const submitData = Utils.formattedProfileForSendData(values);
    try {
      const newUser = await ProfileService.contractorUpdate({
        ...submitData,
        ...files
      });
      showAlert({
        title: 'Готово',
        content: 'Профиль успешно обновлен',
        onOk: () => { },
      });
      dispatch({
        type: 'SET_USER', user: {
          ...contractor,
          ...newUser
        }
      });
      setEdited(false);
    } catch (e) {
      console.error(e)
      showError(e);
    }
  }

  if (!contractor) {
    return null;
  }

  return (
    <MainForm
      dictionaries={dictionaries}
      values={contractor}
      canViewStampAndSignature={canViewStampAndSignature}
      onSave={onSave}
      edited={edited}
      setEdited={setEdited}
    />
  );
}


export default ProfileMain;