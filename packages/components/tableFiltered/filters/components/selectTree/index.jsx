import React, { useEffect } from 'react';
import _isEqual from 'lodash/isEqual';
import { Form, TreeSelect } from '@vezubr/elements/antd';
import PropTypes from 'prop-types';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import { FilterWrapper } from '../../helper';

function FilterSelectTree(props) {
  const { form, name, label: labelProp, config = {}, value } = props;
  const { data, label, itemProps: itemPropsInput, fieldProps, decoratorProps: decoratorPropsInput } = config;
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
        {getFieldDecorator(fieldName, decoratorProps)(<TreeSelect allowClear={true} treeData={data} {...fieldProps} />)}
      </Form.Item>
    </FilterWrapper>
  );
}

FilterSelectTree.propTypes = {
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

export default FilterSelectTree;
