import React, { useEffect } from 'react';
import { Form, Input, InputNumber } from '@vezubr/elements/antd';
import PropTypes from 'prop-types';
import { FilterWrapper } from '../../helper';

const rangeTypesElem = {
  number: InputNumber,
  text: Input,
};

function FilterRange(props) {
  const { form, name, value, config = {} } = props;
  const {
    label,
    fieldPropsTo: fieldPropsToInput,
    fieldPropsFrom: fieldPropsFromInput,
    rangeType = 'text',
  } = config;
  const { getFieldDecorator, setFieldsValue } = form;

  const [fieldNameFrom, fieldNameTo] = name;
  const [fromValueInput, toValueInput] = value;

  if (!rangeTypesElem[rangeType]) {
    throw new Error('Has no range type' + rangeType);
  }

  const InputElem = rangeTypesElem[rangeType];

  const fieldPropsFrom = {
    placeholder: 'от',
    ...fieldPropsFromInput,
  };

  const fieldPropsTo = {
    placeholder: 'до',
    ...fieldPropsToInput,
  };

  useEffect(() => {
    setFieldsValue({
      [fieldNameFrom]: fromValueInput,
      [fieldNameTo]: toValueInput,
    });
  }, [fieldNameFrom, fieldNameTo, fromValueInput, toValueInput]);

  return (
    <FilterWrapper>
      <Form.Item label={label} help={false} validateStatus={""}>
        <Input.Group className="range-simple" compact={true}>
          {getFieldDecorator(fieldNameFrom, {
            initialValue: fromValueInput,
          })(<InputElem {...fieldPropsFrom} allowClear={true} className="range-simple-from" />)}

          <Input className="range-simple-delimiter" placeholder="~" disabled={true} />

          {getFieldDecorator(fieldNameTo, {
            initialValue: toValueInput,
          })(<InputElem allowClear={true} className="range-simple-to" {...fieldPropsTo} />)}
        </Input.Group>
      </Form.Item>
    </FilterWrapper>
  );
}

FilterRange.propTypes = {
  name: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  form: PropTypes.object,
  config: PropTypes.shape({
    label: PropTypes.string,
    rangeType: PropTypes.oneOf(['text', 'number']),
    fieldPropsFrom: PropTypes.object,
    fieldPropsTo: PropTypes.object,
  }),
};

export default FilterRange;
