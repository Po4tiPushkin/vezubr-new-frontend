import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Form, DatePicker } from '@vezubr/elements/antd';
import moment from 'moment';
import t from '@vezubr/common/localization';
import { Select } from 'antd';
import { connect } from 'react-redux';
const { RangePicker } = DatePicker;

const formatParser = 'YYYY-MM-DD';

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
    value: 4,
    title: t.common('futureWeek'),
  },
  {
    value: 8,
    title: t.common('custom'),
  },
]

function FilterDateRange(props) {

  const { monitorDates, currentTab } = props;

  if (!currentTab || !monitorDates[currentTab]) {
    return (
      <>
      </>
    )
  }

  const getFieldValueByOptionValue = (optionValue) => {
    let newFromValue = monitorDates[currentTab].date["toStartAtDateFrom"];
    let newToValue = monitorDates[currentTab].date["toStartAtDateTill"];

    switch (optionValue) {
      case 0:
        newFromValue = null;
        newToValue = null;
        break;
      case 1:
        newFromValue = moment().startOf('day').format(formatParser);
        newToValue = moment().add(1, 'days').endOf('day').format(formatParser);
        break;
      case 4:
        newFromValue = moment().startOf('day').format(formatParser);
        newToValue = moment().endOf('day').add(7, 'days').format(formatParser);
        break;
      case 8:
        break
      default:
        throw new Error('Has no number type of range value');
    }
    return {
      fromValue: newFromValue,
      toValue: newToValue,
    };
  }

  const getOptionValueByFieldsValue = (values) => {
    const { fromValue, toValue } = values;
    return 8;
  };


  const onSelectChange = useCallback((optionValue) => {
    const { fromValue, toValue } = getFieldValueByOptionValue(optionValue);
    const newDates = { ...monitorDates, [`${currentTab}`]: { option: optionValue, date: { 'toStartAtDateFrom': fromValue, 'toStartAtDateTill': toValue } } }
    props.dispatch({ type: 'SET_MONITOR_DATES_STATE', payload: newDates });
    localStorage.setItem('toStartAtDateFromMonitor', fromValue)
    localStorage.setItem('toStartAtDateTillMonitor', toValue)
    localStorage.setItem('monitorDates',JSON.stringify(newDates))
  }, [monitorDates, currentTab]);

  const onRangeChange = useCallback((dates) => {
    const fromValue = dates?.[0] && dates[0].startOf('day').format(formatParser) || null;
    const toValue = dates?.[1] && dates[1].endOf('day').format(formatParser) || null;
    const optionValue = getOptionValueByFieldsValue({ fromValue, toValue })
    const newDates = { ...monitorDates, [`${currentTab}`]: { option: optionValue, date: { 'toStartAtDateFrom': fromValue, 'toStartAtDateTill': toValue } } }
    props.dispatch({ type: 'SET_MONITOR_DATES_STATE', payload: newDates })
    localStorage.setItem('toStartAtDateFromMonitor', fromValue)
    localStorage.setItem('toStartAtDateTillMonitor', toValue)
    localStorage.setItem('monitorDates',JSON.stringify(newDates))
  }, [monitorDates, currentTab]);

  return (
    <div className='flexbox'>
      <Form.Item className="setter margin-right-8">
        <Select
          onChange={onSelectChange}
          value={monitorDates[currentTab].option}
        >
          {allOptions.map((item) => {
            const { value, title } = item;
            return (
              <Select.Option value={value} key={`${value}-${title}`}>{title}</Select.Option>
            )
          })}
        </Select>
      </Form.Item>
      <Form.Item style={{ 'minWidth': '210px' }} className="picker margin-right-10">
        <RangePicker
          onChange={onRangeChange}
          format={['DD.MM.YYYY', 'YYYY-MM-DD']}
          value={[monitorDates[currentTab].date["toStartAtDateFrom"] ? moment(monitorDates[currentTab].date["toStartAtDateFrom"]) : null, monitorDates[currentTab].date["toStartAtDateTill"] ? moment(monitorDates[currentTab].date["toStartAtDateTill"]) : null]}
        />
      </Form.Item>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { monitorDates, currentTab } = state;
  return { monitorDates, currentTab };
};

export default connect(mapStateToProps)(FilterDateRange)
