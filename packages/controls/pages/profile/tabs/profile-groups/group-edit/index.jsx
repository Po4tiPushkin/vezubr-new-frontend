import React, { useState, useEffect } from 'react';
import { Ant, showAlert, VzForm, showError } from "@vezubr/elements";
import { Profile as ProfileService } from '@vezubr/services';
import jwtDecode from 'jwt-decode';
import Cookies from '@vezubr/common/common/cookies';
import { useSelector } from 'react-redux';
import t from "@vezubr/common/localization"
import { formatterUserDataForSend } from "../../../utils";
import ProfileGroupForm from '../../../../../forms/profile-form/group-form';
import ProfilePasswordForm from '../../../../../forms/profile-form/password-form';
const ProfileGroupEdit = (props) => {
  const user = useSelector((state) => state.user);
  const dictionaries = useSelector((state) => state.dictionaries);
  const { match, goToUsers, disabledEditUser } = props;
  const [groupData, setGroupData] = useState(null);
  const [passwordVal, setPasswordVal] = useState(false);
  // const onSave = async (form) => {
  //   const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

  //   if (errors !== null) {
  //     Ant.message.error('Исправьте ошибки в форме');
  //     return;
  //   }
  //   try {
  //     await ProfileService.contractorEditUser({
  //       id: match.params.id,
  //       data
  //     });
  //     showAlert({
  //       title: 'Готово',
  //       content: 'Данные пользователя успешно изменены',
  //       onOk: () => goToUsers(),
  //     });
  //   } catch (err) {
  //     showError(e);
  //     console.error(e);
  //     VzForm.Utils.handleApiFormErrors(e, form)
  //   }
  // }

  const fetchUser = async () => {
    try {
      const groupData = await ProfileService.contractorGetGroup(match.params.id);
      setGroupData(groupData);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <ProfileGroupForm
      dictionaries={dictionaries}
      values={groupData}
      disabled={true}
    />
  );
}

export default ProfileGroupEdit;