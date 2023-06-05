import { Ant, showAlert, showError, VzForm } from "@vezubr/elements";
import { Profile as ProfileService } from '@vezubr/services';
import PropTypes from "prop-types";
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CustomPropsForm from "../../../../forms/settings/settings-custom-property-form";

function CustomPropsEdit(props) {
  const { dictionaries, match } = props;
  const history = useHistory()
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = React.useState({});
  const [values, setValues] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const id = match.params.id

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await ProfileService.customPropsInfo(id)
        setValues(resp)
      } catch (e) {
        showError(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const onSave = React.useCallback(async (form, possibleValues) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }
    setLoading(true)

    const submitData = {
      ...values,
    }

    if (values.type === 'multiple') {
      submitData.possibleValues = possibleValues
    }

    try {
      await ProfileService.customPropsEdit(id, submitData);
      const dataSource = await ProfileService.getCustomPropsList();
      dispatch({ type: 'SET_CUSTOM_PROPERTIES', payload: dataSource });
      showAlert({
        title: 'Готово',
        content: 'Поле успешно отредактировано',
        onOk: () => history.push('/settings/custom-props'),
      });
    } catch (err) {
      showError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <CustomPropsForm
      dictionaries={dictionaries}
      onSave={onSave}
      errors={formErrors}
      loading={loading}
      values={values}
    />
  );
}

CustomPropsEdit.propTypes = {
  contractor: PropTypes.object,
  dictionaries: PropTypes.object,
  history: PropTypes.object,
  goToUsers: PropTypes.func,
};


export default CustomPropsEdit;