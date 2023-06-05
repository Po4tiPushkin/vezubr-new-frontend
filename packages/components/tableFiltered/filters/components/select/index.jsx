import _isEqual from 'lodash/isEqual';
import React, { useEffect } from 'react';
import { Form, Select } from '@vezubr/elements/antd';
import PropTypes from 'prop-types';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import { FilterWrapper } from '../../helper';

function FilterSelect(props) {
  const { form, label: labelProp, name, config = {}, value } = props;
  const { data, label, title, itemProps: itemPropsInput, fieldProps, decoratorProps: decoratorPropsInput } = config;
  const { getFieldDecorator, getFieldError, setFieldsValue } = form;

  const initialValue = value;
  const initialValuePrev = usePrevious(initialValue);

  const decoratorProps = {
    initialValue,
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
    if (!_isEqual(initialValue, initialValuePrev)) {
      setFieldsValue({ [fieldName]: initialValue });
    }
  }, [initialValue, initialValuePrev, fieldName]);

  return (
    <FilterWrapper>
      <Form.Item {...itemProps} validateStatus={fieldNameError ? 'error' : ''}>
        {getFieldDecorator(
          fieldName,
          decoratorProps,
        )(
          <Select allowClear={true} {...fieldProps}>
            {(data || []).map((o) => (
              <Select.Option key={o.value} value={o.value} title={title || o.label} disabled={o.disabled}>
                {o.label}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </FilterWrapper>
  );
}

FilterSelect.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  config: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    itemProps: PropTypes.object,
    fieldProps: PropTypes.object,
    decoratorProps: PropTypes.object,
  }),
};

export default FilterSelect;
