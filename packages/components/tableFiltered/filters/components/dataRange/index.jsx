import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker } from '@vezubr/elements/antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import t from '@vezubr/common/localization';
import { Select } from 'antd';
import { FilterWrapper } from '../../helper';
import { setLocalStorageItem } from '@vezubr/common/common/utils';

const { RangePicker } = DatePicker;

function FilterDateRange(props) {
  const { form, label: labelProp, name, value, config = {}, filterSetName } = props;
  const {
    label,
    useSetter = true,
    formatDisplay = 'DD.MM.YYYY',
    formatParser = 'YYYY-MM-DD',
    requiredOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
    setterProps,
    pickerProps,
    id
  } = config;
  const { getFieldDecorator, setFieldsValue } = form;

  const [fieldNameFrom, fieldNameTo] = name;
  const [fromValueInput, toValueInput] = value;

  const allOptions = [
    {
      value: 0,
      title: t.common('forAllTime'),
    },
    {
      value: 1,
      title: t.common('todayAndTomorrow'),
    },
    {
      value: 2,
      title: t.common('today'),
    },
    {
      value: 3,
      title: t.common('yesterday'),
    },
    {
      value: 4,
      title: t.common('futureWeek'),
    },
    {
      value: 5,
      title: t.common('forWeek'),
    },
    {
      value: 6,
      title: t.common('forMonth'),
    },
    {
      value: 7,
      title: t.common('forYear'),
    },
    {
      value: 8,
      title: t.common('custom'),
    },
  ]

  const [{ fromValue, toValue, optionValue }, setStateValues] = useState({
    fromValue: fromValueInput,
    toValue: toValueInput,
    optionValue: null,
  });

  const setValues = (values) => {
    const { fromValue, toValue, optionValue } = values;
    setStateValues({
      fromValue,
      toValue,
      optionValue,
    });
    setFieldsValue({
      [fieldNameFrom]: fromValue,
      [fieldNameTo]: toValue,
    });
  };

  const onRangeChange = (dates) => {
    const fromValue = dates?.[0] && dates[0].startOf('day').format(formatParser) || undefined;
    const toValue =  dates?.[1] && dates[1].endOf('day').format(formatParser) || undefined;
    setValues({
      fromValue,
      toValue,
      optionValue: getOptionValueByFieldsValue({fromValue, toValue}),
    });
  };

  const getFieldValueByOptionValue = (optionValue) => {
    let newFromValue = fromValue;
    let newToValue = toValue;

    switch (optionValue) {
      case 0:
        newFromValue = undefined;
        newToValue = undefined;
        if (filterSetName === 'monitor') {
          setLocalStorageItem('monitorDateType', '0')
        }
        if (filterSetName === 'orders') {
          setLocalStorageItem('ordersListParamsType', '0')
        }
        break;
      case 1:
        newFromValue = moment().startOf('day').format(formatParser);
        newToValue = moment().add(1, 'days').endOf('day').format(formatParser);
        if (filterSetName === 'monitor') {
          setLocalStorageItem('monitorDateType', optionValue)
        }
        if (filterSetName === 'orders') {
          setLocalStorageItem('ordersListParamsType', optionValue)
        }
        break;
      case 2:
        newFromValue = moment().startOf('day').format(formatParser);
        newToValue = moment().endOf('day').format(formatParser);
        if (filterSetName === 'orders') {
          setLocalStorageItem('ordersListParamsType', optionValue)
        }
        break;
      case 3:
        newFromValue = moment().subtract(1, 'days').startOf('day').format(formatParser);
        newToValue = moment().subtract(1, 'days').endOf('day').format(formatParser);
        if (filterSetName === 'orders') {
          setLocalStorageItem('ordersListParamsType', optionValue)
        }
        break;
      case 4:
        newFromValue = moment().startOf('day').format(formatParser);
        newToValue = moment().endOf('day').add(7, 'days').format(formatParser);
        if (filterSetName === 'monitor') {
          setLocalStorageItem('monitorDateType', optionValue)
        }
        if (filterSetName === 'orders') {
          setLocalStorageItem('ordersListParamsType', optionValue)
        }
        break;
      case 5:
        newFromValue = moment().startOf('day').subtract(7, 'days').format(formatParser);
        newToValue = moment().endOf('day').format(formatParser);
        if (filterSetName === 'orders') {
          setLocalStorageItem('ordersListParamsType', optionValue)
        }
        break;
      case 6:
        newFromValue = moment().startOf('day').subtract(1, 'month').format(formatParser);
        newToValue = moment().endOf('day').format(formatParser);
        if (filterSetName === 'orders') {
          setLocalStorageItem('ordersListParamsType', optionValue)
        }
        break;
      case 7:
        newFromValue = moment().startOf('day').subtract(1, 'year').format(formatParser);
        newToValue = moment().endOf('day').format(formatParser);
        if (filterSetName === 'orders') {
          setLocalStorageItem('ordersListParamsType', optionValue)
        }
        break
      case 8:
        if (filterSetName === 'monitor') {
          setLocalStorageItem('monitorDateType', optionValue)
        }
        if (filterSetName === 'orders') {
          setLocalStorageItem('ordersListParamsType', 8)
        }
        break
      default:
        throw new Error('Has no number type of range value');
    }

    return {
      fromValue: newFromValue,
      toValue: newToValue,
    };
  };

  const getOptionValueByFieldsValue = (values) => {
    const { fromValue, toValue } = values;
    for (let rangeIndex = 0; rangeIndex < 8; rangeIndex++) {
      const { fromValue: calcFromValue, toValue: calcToValue } = getFieldValueByOptionValue(rangeIndex);
      if (fromValue === calcFromValue && toValue === calcToValue && requiredOptions?.includes(rangeIndex.toString())) {
        return rangeIndex;
      }
    }
    if (filterSetName === 'monitor') {
      setLocalStorageItem('monitorDateType', '8')
    }
    return 8;
  };

  const onSelectChange = (optionValue) => {
    const { fromValue, toValue } = getFieldValueByOptionValue(optionValue);
    setValues({
      fromValue,
      toValue,
      optionValue,
    });
  };

  useEffect(() => {
    setValues({
      fromValue: fromValueInput,
      toValue: toValueInput,
      optionValue: getOptionValueByFieldsValue({
        fromValue: fromValueInput,
        toValue: toValueInput,
      }),
    });
  }, [fieldNameFrom, fieldNameTo, fromValueInput, toValueInput]);

  return (
    <FilterWrapper classNames='filter-date-range'>
      {useSetter && (
        <Form.Item colon={false} className="setter" label={label || labelProp}>
          <Select 
            onChange={onSelectChange} 
            value={optionValue} 
            id={`${id}-select`}
            {...setterProps}
          >
            {requiredOptions.map((item) => {
              const {value, title} = allOptions.find(({value}) => value == item)
              return (
                <Select.Option id={`${id}-select-option-${value}`} value={value} key={`${value}-${title}`}>{title}</Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      )}

      <Form.Item colon={false} className="picker" {...(!useSetter ? { label: labelProp || label } : {})}>
        <RangePicker
          id={`${id}-rangepicker`}
          onChange={onRangeChange}
          format={[formatDisplay, formatParser]}
          value={[fromValue ? moment(fromValue) : null, toValue ? moment(toValue) : null]}
          placeholder={['С', 'До']}
          {...pickerProps}
        />
      </Form.Item>

      {getFieldDecorator(fieldNameFrom, {
        initialValue: fromValue,
      })(<Input type="hidden" />)}

      {getFieldDecorator(fieldNameTo, {
        initialValue: toValue,
      })(<Input type="hidden" />)}
    </FilterWrapper>
  );
}

FilterDateRange.propTypes = {
  name: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.arrayOf(PropTypes.string),
  form: PropTypes.object,
  config: PropTypes.shape({
    label: PropTypes.string,
    useSetter: PropTypes.bool,
  }),
};

export default FilterDateRange;
