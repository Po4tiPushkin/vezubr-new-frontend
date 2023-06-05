import React, { useEffect } from 'react';
import { Form, Input, Icon } from '@vezubr/elements/antd';
import PropTypes from 'prop-types';
import { FilterWrapper } from '../../helper';
import InputMask from "react-input-mask";

const PHONE_MASK = '+7 (999) 999-99-99';
function FilterPhone(props) {
  const { form, label: labelProp, name, config = {}, value } = props;
  const { label, itemProps: itemPropsInput, fieldProps, decoratorProps: decoratorPropsInput } = config;
  const { getFieldDecorator, getFieldError, setFieldsValue, getFieldValue } = form;

  const decoratorProps = {
    initialValue: value,
    ...decoratorPropsInput,
  };

  const itemProps = {
    label: label || labelProp,
    colon: false,
    ...itemPropsInput,
  };

  const fieldName = name;
  const fieldNameError = getFieldError(fieldName);

  useEffect(() => {
    setFieldsValue({ [fieldName]: decoratorProps.initialValue });
  }, [decoratorProps.initialValue, fieldName]);

  const onInputChange = (e) => {
    const value = e.target.value;
    setFieldsValue({ [fieldName]: value });

    const {
      config: { minLength = 0 },
    } = props;

    if (value.length > minLength) {
      setFieldsValue({ [fieldName]: value });
    }

    if (value.length === 0) {
      setFieldsValue({ [fieldName]: '' });
    }
  };

  return (
    <FilterWrapper>
      <Form.Item {...itemProps} validateStatus={fieldNameError ? 'error' : ''}>
        <InputMask mask={PHONE_MASK} maskPlaceholder={null} onChange={onInputChange} value={getFieldValue(fieldName)} {...fieldProps}>
          <Input allowClear={true} suffix={<Icon type="search" />}   />
        </InputMask>
        {getFieldDecorator(fieldName, decoratorProps)(<Input type="hidden" />)}
      </Form.Item>
    </FilterWrapper>
  );
}

FilterPhone.propTypes = {
  name: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  value: PropTypes.any,
  config: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    itemProps: PropTypes.object,
    fieldProps: PropTypes.object,
    decoratorProps: PropTypes.object,
    minLength: PropTypes.number,
  }),
};

export default FilterPhone;
