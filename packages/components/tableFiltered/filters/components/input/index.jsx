import React, { useEffect } from 'react';
import { Form, Input, Icon, Tooltip } from '@vezubr/elements/antd';
import PropTypes from 'prop-types';
import { FilterWrapper } from '../../helper';

function FilterInput(props) {
  const { form, label: labelProp, name, config = {}, value } = props;
  const { label, itemProps: itemPropsInput, fieldProps, decoratorProps: decoratorPropsInput, minLength = 0 } = config;
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
    <FilterWrapper classNames={`${minLength > 0 ? 'has-min-length' : ''}`}>
      <Form.Item {...itemProps} validateStatus={fieldNameError ? 'error' : ''}>
        <Input 
        allowClear={true} 
        value={getFieldValue(fieldName)} 
        suffix={<Icon type="search" />} 
        {...fieldProps} 
        onChange={onInputChange}
        addonAfter={minLength > 0 ?
          <Tooltip placement="left" title={`Поиск по полю работает после введения ${minLength} символа`}>
            <div className={`settings-page__hint-title margin-top-7`}>
              {<Icon type={'info-circle'} />}
            </div>
          </Tooltip>
          :
          ''
        } />
        {getFieldDecorator(fieldName, decoratorProps)(<Input type="hidden" />)}
      </Form.Item>
    </FilterWrapper>
  );
}

FilterInput.propTypes = {
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

export default FilterInput;
