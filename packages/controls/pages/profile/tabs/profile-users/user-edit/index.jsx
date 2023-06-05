import React, { useState, useEffect } from 'react';
import { Ant, showAlert, VzForm, showError, Loader, IconDeprecated, WhiteBox } from "@vezubr/elements";
import { Profile as ProfileService } from '@vezubr/services';
import jwtDecode from 'jwt-decode';
import Cookies from '@vezubr/common/common/cookies';
import { useSelector } from 'react-redux';
import t from "@vezubr/common/localization"
import { formatterUserDataForSend } from "../../../utils";
import ProfileUserForm from '../../../../../forms/profile-form/user-form';
import ProfilePasswordForm from '../../../../../forms/profile-form/password-form';
import { store } from '../../../../../infrastructure';
const ProfileUserEdit = (props) => {
  const user = useSelector((state) => state.user);
  const dictionaries = useSelector((state) => state.dictionaries);
  const { match, goToUsers, disabledEditUser } = props;
  const [userData, setUserData] = useState(null);
  const [passwordVal, setPasswordVal] = useState(false);
  const onSave = async (form, extraData) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }
    const data = formatterUserDataForSend({ ...values });
    if (data.hasDigitalSignature) {
      data.digitalSignatureType = 1;
    }
    try {
      await ProfileService.contractorEditUser({
        id: match.params.id,
        data
      });
      if (!userData?.requestGroupIds?.length && extraData?.groups?.length ||
        !_.isEqual(userData?.requestGroupIds, extraData?.groups)
      ) {
        await ProfileService.addGroupsToEmployee({ employeeId: +match.params.id, requestGroupIds: extraData?.groups })
      }
      showAlert({
        title: 'Готово',
        content: 'Данные пользователя успешно изменены',
        onOk: () => goToUsers(),
      });
    } catch (e) {
      showError(e);
      console.error(e);
      VzForm.Utils.handleApiFormErrors(e, form)
    }
  }

  const fetchUser = async () => {
    try {
      const userData = await ProfileService.contractorGetUser(match.params.id);
      setUserData(userData);
    } catch (e) {
      console.error(e);
    }
  }

  const onPasswordChange = React.useCallback(async (form) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = values
    if (currentPassword) {
      if (newPassword !== confirmPassword) {
        showError({
          message: 'Пароли не совпадают'
        })
      }
      try {
        await ProfileService.contractorChangePassword({
          currentPassword,
          password: {
            new: newPassword,
            confirm: confirmPassword
          }
        })
        showAlert({
          title: 'Готово',
          content: 'Пароль пользователя успешно изменен',
          onOk: () => goToUsers(),
        });
      } catch (err) {

        showAlert({
          title: 'Ошибка',
          content: t.error(err.data.message),
          onOk: () => { },
        });
      }
    }
  }, []);
  const canChangePassword = React.useMemo(() => userData?.id === jwtDecode(Cookies.get(`${APP}Token`))?.userId, [userData, user])

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {userData ? (
        <>
          <div className="margin-left-24 margin-right-24">
            <WhiteBox.Header
              type={'h1'}
              icon={<IconDeprecated name={'orderTypeLoad'} />}
              iconStyles={{ color: '#F57B23' }}
            >
              {`${userData.surname} ${userData.name} ${userData?.patronymic ? userData?.patronymic : ''}`}
            </WhiteBox.Header>
          </div>
          <ProfileUserForm
            dictionaries={dictionaries}
            onSave={onSave}
            values={userData}
            disabled={disabledEditUser}
            canChangePassword={canChangePassword}
            onPasswordChange={onPasswordChange}
          />
          {canChangePassword && (
            <ProfilePasswordForm
              dictionaries={dictionaries}
              values={userData}
              disabled={disabledEditUser}
              onPasswordChange={onPasswordChange}
            />
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default ProfileUserEdit;