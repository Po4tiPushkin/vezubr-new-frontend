import React, { useState, useMemo, useCallback, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { TariffContext } from '../../context';
import { compareArray } from '../../utils';
const getFixedNumber = (value) => {
  const dotPos = String(value).indexOf('.');
  let newValue = value;
  if (dotPos > -1) {
    const substr = String(value).substring(dotPos);
    if (substr.length > 2) {
      newValue = +newValue.toFixed(2);
    }
  }
  return newValue;
};

function costFieldOperation(value, operation) {
  if (typeof value == 'number') {
    return operation(value);
  }

  return value;
}

const TariffCost = (props) => {
  const { costField, vehicle, client, placeholders } = props;
  const { store } = useContext(TariffContext);
  const { editable, type: tariffType } = store;
  const [editing, setEditing] = useState(false);
  const node = useRef(null);
  const costFieldValue = costFieldOperation(costField.cost, (value) => value / 100);
  const onChange = useCallback((value) => {
    costField.setCost(costFieldOperation(value, (value) => value * 100));
    if (tariffType === 2) {
      store.clearLoaderErrors();
    }
  }, [costField]);

  const toggleEdit = useCallback(() => {
    if (!editable) {
      return;
    }

    setEditing(prev => !prev);
  }, [editing, editable]);

  const placeholder = useMemo(() => {
    let temp = '';
    if (placeholders) {
      const { type } = placeholders;
      if (type === 'baseWorks' && placeholders.baseWorkCosts) {
        if (tariffType === 4) {
          temp = placeholders?.baseWorkCosts.find(el =>
            el.vehicleTypeId === vehicle.vehicleTypeId &&
            el.mileage === vehicle.mileage &&
            el.workMinutes === vehicle.workMinutes) &&
            compareArray(el.bodyTypes, vehicle.bodyTypes)
        }
        else {
          temp = placeholders?.baseWorkCosts?.find(
            (el) =>
              el.vehicleTypeId === vehicle.vehicleTypeId &&
              el.hoursWork === costField.hoursWork &&
              el.hoursInnings === costField.hoursInnings &&
              compareArray(el.bodyTypes, vehicle.bodyTypes),
          );
        }
      }
      if (type === 'services' && placeholders.serviceCosts) {
        temp = placeholders.serviceCosts?.find(
          (el) =>
            el.vehicleTypeId === vehicle.vehicleTypeId &&
            el.article === costField.article &&
            compareArray(el.bodyTypes, vehicle.bodyTypes),
        );
        if (temp) temp.cost = temp.costPerService;
      }
    }
    return temp;
  }, [placeholders]);

  useEffect(() => {
    if (editing) {
      const input = node?.current?.inputNumberRef?.input;
      if (input) {
        input.focus();
      }
    }
  }, [editing]);

  useEffect(() => {
    if (editable) {
      if (client) {
        costField.setCost(null);
      } else {
        if (placeholder) {
          costField.setCost(placeholder?.cost);
        }
      }
    }
  }, [client])

  const renderInput = useMemo(() => (
    <Ant.InputNumber
      value={costFieldValue}
      defaultValue={costFieldValue}
      style={{ width: '100%' }}
      size="small"
      min={0}
      decimalSeparator={','}
      step={50}
      ref={node}
      onPressEnter={toggleEdit}
      onBlur={toggleEdit}
      onChange={onChange}
      placeholder={placeholder ? getFixedNumber(placeholder.cost / 100) : ''}
    />
  ), [costFieldValue, placeholder]);

  return (
    <div
      title={placeholder ? `Изначальная стоимость: ${getFixedNumber(placeholder.cost / 100)}` : ''}
      className={cn({ 'has-error': editable && costField.error })}
    >
      {editing ? renderInput :
        <div
          className={cn('tariff-cost-wrap', {
            'tariff-cost-wrap--editable': editable,
          })}
          title={placeholder ? `Изначальная стоимость: ${getFixedNumber(placeholder.cost / 100)}` : ''}
          onClick={toggleEdit}
        >
          {costFieldValue || costFieldValue === 0 ? (
            getFixedNumber(costFieldValue)
          ) : editable && placeholder ? (
            <div
              title={`Изначальная стоимость: ${placeholder.cost / 100}`}
              className={'tariff-cost-wrap tariff-cost-wrap--placeholder'}
            >
              {getFixedNumber(placeholder.cost / 100)}{' '}
            </div>
          ) : (
            ''
          )}
        </div>
      }
    </div>
  )
}

export default observer(TariffCost);