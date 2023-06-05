import React from 'react';
import { isNumber } from '@vezubr/common/utils';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { TariffContext } from '../../context';
import { Ant, VzForm } from '@vezubr/elements';
import cn from 'classnames';

const startTime = 0;
const endTime = 24;

export const MODE_ALL_DAT = 'allDay';
export const MODE_SELECT = 'select';

const CLS = 'tariff-field-hour-range';

function prepareToValues(toValue, fromValue, minDistance) {
  let to = toValue;

  if (isNumber(toValue) && isNumber(fromValue)) {
    const diffHour = toValue - fromValue;
    if (diffHour < minDistance) {
      to = fromValue + minDistance;
    }
  }

  return to;
}

function prepareFromValues(fromValue, toValue, minDistance) {
  let from = fromValue;

  if (isNumber(toValue) && isNumber(fromValue)) {
    const diffHour = toValue - fromValue;

    if (diffHour < minDistance) {
      from = toValue - minDistance;
    }
  }

  return from;
}

function TariffFieldHourRange(props) {
  const { label, fromSetterProp, fromPropField, toSetterProp, toPropField, minDistance, ...otherProps } = props;

  const { store } = React.useContext(TariffContext);

  const valueFrom = store[fromPropField];
  const valueTo = store[toPropField];

  const updateFrom = React.useCallback(
    (value) => {
      const toPrepare = prepareToValues(valueTo, value, minDistance);
      store[toSetterProp || toPropField](toPrepare);
      store[fromSetterProp || fromPropField](value);
    },
    [valueTo, minDistance, fromSetterProp, fromPropField, toSetterProp, toPropField],
  );
  const updateTo = React.useCallback(
    (value) => {
      const fromPrepare = prepareFromValues(valueFrom, value, minDistance);
      store[fromSetterProp || fromPropField](fromPrepare);
      store[toSetterProp || toPropField](value);
    },
    [valueFrom, minDistance, fromSetterProp, fromPropField, toSetterProp, toPropField],
  );

  const isFullDayInFact = valueFrom === startTime && valueTo === endTime;

  const [mode, setMode] = React.useState(isFullDayInFact ? MODE_ALL_DAT : MODE_SELECT);

  const setAllDay = React.useCallback(() => {
    updateFrom(startTime);
    updateTo(endTime);
    setMode(MODE_ALL_DAT);
  }, []);

  const setSelect = React.useCallback(() => {
    setMode(MODE_SELECT);
  }, []);

  const formatter = React.useCallback((value) => {
    const parsed = ~~value;
    return parsed < 10 ? `0${parsed}` : parsed;
  }, []);

  const parser = React.useCallback((value) => {
    return ~~value;
  }, []);

  return (
    <VzForm.Item
      type={'div'}
      className={CLS}
      label={label}
      error={store.getError(fromPropField) || store.getError(toPropField)}
    >
      <>
        {mode === MODE_ALL_DAT && (
          <div className={`${CLS}__all-day`}>
            <Ant.Input value={'Весь день: 00:00 ~ 23:59'} readOnly={true} />

            {store.editable && (
              <Ant.Button className={`${CLS}__action`} size={'small'} onClick={setSelect}>
                Выбрать
              </Ant.Button>
            )}
          </div>
        )}
        {mode === MODE_SELECT && (
          <div className={`${CLS}__picker`}>
            <Ant.InputNumber
              key={'from'}
              placeholder={'От'}
              autoFocus={false}
              min={0}
              max={23}
              size={'small'}
              {...otherProps}
              className={cn(`${CLS}__picker__item`, { 'has-error': !!store.getError(fromPropField) })}
              disabled={!store.editable}
              formatter={formatter}
              parser={parser}
              value={valueFrom}
              onChange={updateFrom}
              suffixIcon={'close'}
            />
            <span className={`${CLS}__picker__split`}>~</span>
            <Ant.InputNumber
              key={'to'}
              placeholder={'до'}
              autoFocus={false}
              min={1}
              max={24}
              size={'small'}
              {...otherProps}
              formatter={formatter}
              disabled={!store.editable}
              parser={parser}
              className={cn(`${CLS}__picker__item`, { 'has-error': !!store.getError(toPropField) })}
              value={valueTo}
              onChange={updateTo}
            />

            {store.editable && (
              <Ant.Button onClick={setAllDay} className={`${CLS}__action`} size={'small'}>
                Весь день
              </Ant.Button>
            )}
          </div>
        )}
      </>
    </VzForm.Item>
  );
}

TariffFieldHourRange.defaultProps = {
  minDistance: 1,
};

TariffFieldHourRange.propTypes = {
  label: PropTypes.string.isRequired,
  fromSetterProp: PropTypes.string,
  fromPropField: PropTypes.string.isRequired,
  toSetterProp: PropTypes.string,
  toPropField: PropTypes.string.isRequired,
  minDistance: PropTypes.number,
};

export default observer(TariffFieldHourRange);
