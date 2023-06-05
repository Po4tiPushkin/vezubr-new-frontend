import React, { useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import moment from 'moment';
import * as Ant from '../../../antd';

const startTime = moment('00:00', 'HH:mm');
const endTime = moment('23:59', 'HH:mm');

export const MODE_ALL_DAY = 'allDay';
export const MODE_SELECT = 'select';

const CLS = 'form-field-range-time';

function prepareToValues(toValue, fromValue, minDistance) {
  const dayHourTo = moment(toValue, 'HH:mm');
  const dayHourFrom = moment(fromValue, 'HH:mm');

  let to = toValue;

  if (dayHourTo.isValid() && dayHourFrom.isValid()) {
    const diffMinutes = dayHourTo.diff(dayHourFrom, 'minute');
    if (diffMinutes < minDistance) {
      to = dayHourTo.clone().add(minDistance - diffMinutes, 'minute');
    }
  }

  return to;
}

function prepareFromValues(fromValue, toValue, minDistance) {
  const dayHourTo = moment(toValue, 'HH:mm');
  const dayHourFrom = moment(fromValue, 'HH:mm');

  let from = fromValue;

  if (dayHourTo.isValid() && dayHourFrom.isValid()) {
    const diffMinutes = dayHourTo.diff(dayHourFrom, 'minute');

    if (diffMinutes < minDistance) {
      from = dayHourFrom.clone().subtract(minDistance - diffMinutes, 'minute');
    }
  }

  return from;
}

function FormFieldRangeTimeHour(props) {
  const { disabled, value, format, minDistance, onChange, ...otherProps } = props;

  const [fromValueInput, toValueInput] = value;

  const valueFrom = useMemo(() => moment(fromValueInput, format), [fromValueInput, format]);
  const valueTo = useMemo(() => moment(toValueInput, format), [toValueInput, format]);

  const updateFrom = useCallback(
    (value) => {
      const to = prepareToValues(valueTo, value, minDistance);
      onChange([moment.isMoment(value) ? value.format(format) : value, moment.isMoment(to) ? to.format(format) : to]);
    },
    [valueTo, minDistance, format, onChange],
  );

  const updateTo = useCallback(
    (value) => {
      const from = prepareFromValues(valueFrom, value, minDistance);
      onChange([
        moment.isMoment(from) ? from.format(format) : from,
        moment.isMoment(value) ? value.format(format) : value,
      ]);
    },
    [valueFrom, minDistance, format, onChange],
  );

  const isFullDayInFact =
    valueFrom.isValid() &&
    valueFrom.isSame(startTime, 'hour') &&
    valueFrom.isSame(startTime, 'minute') &&
    valueTo.isValid() &&
    valueTo.isSame(endTime, 'hour') &&
    valueTo.isSame(endTime, 'minute');

  const [mode, setMode] = React.useState(isFullDayInFact ? MODE_ALL_DAY : MODE_SELECT);

  useEffect(() => {
    if (isFullDayInFact) {
      setMode(MODE_ALL_DAY);
    }
  }, [isFullDayInFact]);

  const setAllDay = useCallback(() => {
    onChange([startTime.format(format), endTime.format(format)]);
    setMode(MODE_ALL_DAY);
  }, [onChange, format]);

  const setSelect = useCallback(() => {
    setMode(MODE_SELECT);
  }, []);

  //TODO рассчитать в зависимости от minDistance
  const disabledStartHours = useCallback(() => [23], []);
  const disabledEndHours = useCallback(() => [0], []);

  return (
    <div className={`${CLS}`}>
      <>
        {mode === MODE_ALL_DAY && (
          <div className={`${CLS}__all-day`}>
            <Ant.Input value={'Весь день'} readOnly={true} />

            {!disabled && (
              <Ant.Button className={`${CLS}__action`} size={'small'} onClick={setSelect}>
                Выбрать
              </Ant.Button>
            )}
          </div>
        )}
        {mode === MODE_SELECT && (
          <div className={`${CLS}__picker`}>
            <Ant.TimePicker
              key={'from'}
              placeholder={'от'}
              allowClear={false}
              {...otherProps}
              className={`${CLS}__picker__item`}
              disabled={disabled}
              value={valueFrom.isValid() ? valueFrom : null}
              onChange={updateFrom}
              suffixIcon={'close'}
              format={format}
              disabledHours={disabledStartHours}
            />
            <span className={`${CLS}__picker__split`}>~</span>
            <Ant.TimePicker
              key={'to'}
              placeholder={'до'}
              allowClear={false}
              {...otherProps}
              className={`${CLS}__picker__item`}
              disabled={disabled}
              value={valueTo.isValid() ? valueTo : null}
              onChange={updateTo}
              format={format}
              disabledHours={disabledEndHours}
            />

            {!disabled && (
              <Ant.Button onClick={setAllDay} className={`${CLS}__action`} size={'small'}>
                Весь день
              </Ant.Button>
            )}
          </div>
        )}
      </>
    </div>
  );
}

FormFieldRangeTimeHour.defaultProps = {
  minDistance: 60,
};

FormFieldRangeTimeHour.propTypes = {
  format: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  minDistance: PropTypes.number,
};

export default observer(FormFieldRangeTimeHour);
