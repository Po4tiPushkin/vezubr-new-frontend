import React, { useEffect } from 'react';
import { FilterWrapper } from '../../helper';
import { Form, Input, DatePicker } from '@vezubr/elements/antd';
import moment from 'moment';

const FilterDate = (props) => {
  const { form, name, label: labelProp, config = {}, value } = props;
  const { label,
    itemProps: itemPropsInput,
    fieldProps,
    decoratorProps: decoratorPropsInput,
    formatDisplay = 'DD.MM.YYYY',
    formatParser = 'YYYY-MM-DD',
  } = config;
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
  useEffect(() => {
    setFieldsValue({ [name]: decoratorProps.initialValue });
  }, [decoratorProps.initialValue, name]);


  const onDateChange = (date) => {
    const newValue = date && date.format(formatParser) || null;
    setFieldsValue({
      [name]: newValue
    })
  };
  return (
    <FilterWrapper>
      <Form.Item {...itemProps} validateStatus={getFieldError(name) ? 'error' : ''}>
        <DatePicker
          value={value ? moment(value) : null}
          format={[formatDisplay, formatParser]}
          onChange={onDateChange}
          {...fieldProps}
        />
      </Form.Item>
      {getFieldDecorator(name, {
        initialValue: value,
      })(<Input type="hidden" />)}
    </FilterWrapper>
  )
}

export default FilterDate;