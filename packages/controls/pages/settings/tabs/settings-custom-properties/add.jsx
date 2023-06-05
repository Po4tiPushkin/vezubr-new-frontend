import { Ant, showAlert, showError, VzForm } from "@vezubr/elements";
import { Profile as ProfileService } from '@vezubr/services';
import PropTypes from "prop-types";
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CustomPropsForm from "../../../../forms/settings/settings-custom-property-form";

function CustomPropsAdd(props) {
  const { dictionaries } = props;
  const dispatch = useDispatch();
  const history = useHistory()
  const [formErrors, setFormErrors] = React.useState({});
  const onSave = async (form, possibleValues) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }

    const submitData = {
      ...values,
    }

    if (values.type === 'multiple') {
      submitData.possibleValues = possibleValues
    }
    
    try {
      await ProfileService.createCustomProps(submitData);
      const dataSource = await ProfileService.getCustomPropsList();
      dispatch({ type: 'SET_CUSTOM_PROPERTIES', payload: dataSource });
      showAlert({
        title: 'Готово',
        content: 'Поле успешно создано',
        onOk: () => history.push('/settings/custom-props'),
      });
    } catch (err) {
      showError(err)
    }
  }

  return (
    <CustomPropsForm
      dictionaries={dictionaries}
      onSave={onSave}
      errors={formErrors}
    />
  );
}

CustomPropsAdd.propTypes = {
  contractor: PropTypes.object,
  dictionaries: PropTypes.object,
  history: PropTypes.object,
  goToUsers: PropTypes.func,
};


export default CustomPropsAdd;