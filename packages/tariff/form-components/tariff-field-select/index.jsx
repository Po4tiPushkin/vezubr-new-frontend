import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Ant, VzForm } from '@vezubr/elements';
import { observer } from 'mobx-react';

import { TariffContext } from '../../context';

function TariffFieldSelect(props) {
  const { setterProp, propField, label, objectList, disabled, list, className, ...otherProps } = props;

  const { store } = React.useContext(TariffContext);

  const renderOption = React.useCallback(
    ({ value, key, label, disabled = false }) => (
      <Ant.Select.Option key={key} value={value} disabled={disabled}>
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

        let label;
        if (Array.isArray(list.labelKey)) {
          for (const cLabel of list.labelKey) {
            label = item[cLabel];
            if (label) {
              break;
            }
          }
        } else {
          label = item[list.labelKey];
        }

        if (!label && list.defaultLabel) {
          label = list.defaultLabel;
        }

        const key = value;
        const disabled = item.disabled 
        return renderOption({ value, label, key, disabled });
      });
    }

    throw new Error('there is neither objectList nor list parameter for name: ' + propField);
  }, [objectList, list, propField]);

  const onChange = React.useCallback(
    (value) => {
      store[setterProp || propField](value);
    },
    [setterProp, propField],
  );

  return (
    <VzForm.Item className={cn('tariff-select-field', className)} label={label} error={store.getError(propField)}>
      <Ant.Select
        allowClear={true}
        showSearch={true}
        {...otherProps}
        optionFilterProp={'children'}
        className={cn('tariff-select-field__select', className)}
        value={store[propField]}
        onChange={onChange}
        disabled={!store.editable || disabled}
      >
        {options}
      </Ant.Select>
    </VzForm.Item>
  );
}

TariffFieldSelect.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  setterProp: PropTypes.string,
  propField: PropTypes.string,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  objectList: PropTypes.object,
  list: PropTypes.shape({
    array: PropTypes.array.isRequired,
    valueKey: PropTypes.string,
    valueIndex: PropTypes.bool,
    defaultLabel: PropTypes.string,
    labelKey: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  }),
};

export default observer(TariffFieldSelect);
