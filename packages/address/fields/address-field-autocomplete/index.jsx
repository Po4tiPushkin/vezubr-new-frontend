import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import _concat from 'lodash/concat';
import _compact from 'lodash/compact';
import _uniqBy from 'lodash/uniqBy';
import { Ant, VzForm } from '@vezubr/elements';
import useDebouncedSuggestions from '@vezubr/common/hooks/useDebouncedSuggestions';

export const AddressFieldAutocompleteProps = {
  initialValue: PropTypes.any,
  placeholder: PropTypes.string,
  error: VzForm.Types.ErrorItemProp,
  label: PropTypes.string,
  rules: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
};

function AddressFieldAutocomplete(props) {
  const { form, name, initialValue, rules: rulesInput, label, error, ...otherProps } = props;
  const { getFieldError, getFieldDecorator } = form;

  const rules = rulesInput || [];

  const fieldError = _compact(_concat(getFieldError(name), error));

  return (
    <VzForm.Item className={'address-field-autocomplete'} label={label} error={fieldError}>
      {getFieldDecorator(name, {
        rules,
        initialValue,
      })(<VzForm.FieldAutocompleteSuggestions {...otherProps} />)}
    </VzForm.Item>
  );
}

AddressFieldAutocomplete.propTypes = AddressFieldAutocompleteProps;

export default AddressFieldAutocomplete;
