import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import compose from '@vezubr/common/hoc/compose';
import { Ant } from '@vezubr/elements';
import withOrderFormFieldWrapper, { OrderFormFieldProps } from '../../hoc/withOrderFormFieldWrapper';

function OrderFieldSelect(props) {
  const { name, allowClear = true, objectList, value, list, setValue, className, optionId, ...otherProps } = props;

  const renderOption = React.useCallback(
    ({ value, key, label, ...otherProps }) => (
      <Ant.Select.Option id={`${optionId}-${value}`} key={key} value={value} {...otherProps}>
        {label}
      </Ant.Select.Option>
    ),
    [],
  );

  const options = React.useMemo(() => {
    if (objectList) {
      return Object.keys(objectList).map((idString) => {
        const value = ~~idString;
        const label = objectList[idString];
        const key = value;
        return renderOption({ value, label, key });
      });
    } else if (list) {
      return list.array.map((item, index) => {
        const value = list.valueIndex ? index : item[list.valueKey];
        const label = item[list.labelKey];
        const key = value;
        return renderOption({ value, label, key, ...item });
      });
    }

    throw new Error('there is neither objectList nor list parameter for name: ' + name);
  }, [objectList, list, name]);

  return (
    <Ant.Select
      allowClear={allowClear}
      showSearch={true}
      optionFilterProp={'children'}
      {...otherProps}
      className={cn('order-field-select', className)}
      value={value}
      onChange={setValue}
    >
      {options}
    </Ant.Select>
  );
}

OrderFieldSelect.propTypes = {
  ...OrderFormFieldProps,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  objectList: PropTypes.object,
  list: PropTypes.shape({
    array: PropTypes.array.isRequired,
    valueKey: PropTypes.string,
    valueIndex: PropTypes.bool,
    labelKey: PropTypes.string.isRequired,
  }),
};

export default compose([withOrderFormFieldWrapper])(OrderFieldSelect);
