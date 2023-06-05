import React from 'react';
import { Utils } from "@vezubr/common/common";
import { Ant, showAlert, VzForm, showError } from "@vezubr/elements";
import { useSelector, useDispatch } from 'react-redux';
import { Profile as ProfileService } from '@vezubr/services';
import Form from '../../../../forms/profile-form/additional-form';

function ProfileAdditional(props) {
  const {
    contractor
  } = props;

  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState(contractor)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [edited, setEdited] = React.useState(false)

  const onBikChange = React.useCallback(async (e) => {
    if (e.target.value.length == 9) {
      const bankInfo = await ProfileService.getBankInformation(e.target.value)
      if (bankInfo.correspondentAccount) {
        setValues({
          ...values,
          correspondentAccount: bankInfo.correspondentAccount,
          bankName: bankInfo.name
        })
      } else {
        showError('Банк с указанным БИК не был найден')
      }
    }
  }, [values, setValues])

  const onSave = async (form, files) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }
    const submitData = Utils.formattedProfileForAdditionalData({ ...values, ...files });
    try {
      setLoading(true);
      const newUser = await ProfileService.contractorUpdateAdditional(submitData);
      showAlert({
        title: 'Готово',
        content: 'Профиль успешно обновлен',
        onOk: () => { },
      });
      dispatch({ type: 'SET_USER', user: { ...user, ...newUser } })
      setEdited(false);
    } catch (e) {
      console.error(e);
      showError(e);
    }
    finally {
      setLoading(false);
    }
  }

  if (!values) {
    return null;
  }

  return (
    <Form
      contractor={values}
      onSave={onSave}
      loading={loading}
      onBikChange={onBikChange}
      edited={edited}
      setEdited={setEdited}
    />
  );
}

export default ProfileAdditional;