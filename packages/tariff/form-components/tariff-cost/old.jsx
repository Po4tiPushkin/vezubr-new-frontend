import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { TariffContext } from '../../context';

function costFieldOperation(value, operation) {
  if (typeof value == 'number') {
    return operation(value);
  }

  return value;
}

function compareArray(arr1, arr2) {
  if (arr1.length != arr2.length) return false;

  for (var i = 0, l = arr1.length; i < l; i++) {
    if (arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
}

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

function TariffCost(props) {
  const { costField, vehicle, placeholders, client } = props;

  const { store } = React.useContext(TariffContext);
  const [editing, setEditing] = React.useState(false);
  const node = React.useRef(null);

  const placeholder = React.useMemo(() => {
    let temp = '';
    if (placeholders) {
      const { type } = placeholders;
      if (type === 'baseWorks' && placeholders.baseWorkCosts) {
        temp = placeholders?.baseWorkCosts?.find(
          (el) =>
            el.vehicleTypeId === vehicle.vehicleTypeId &&
            el.hoursWork === costField.hoursWork &&
            el.hoursInnings === costField.hoursInnings &&
            compareArray(el.bodyTypes, vehicle.bodyTypes),
        );
      }
      if (type === 'services') {
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

  const toggleEdit = React.useCallback(() => {
    if (!store.editable) {
      return;
    }
    const newStateEditing = !editing;

    setEditing(newStateEditing);
  }, [editing, store.editable]);

  const updated = React.useCallback(
    (value) => {
      costField.setCost(costFieldOperation(value, (value) => value * 100));
      if (store.type === 2) {
        store.clearLoaderErrors();
      }
    },
    [costField],
  );

  React.useEffect(() => {
    if (editing) {
      const input = node?.current?.inputNumberRef?.input;
      if (input) {
        input.focus();
      }
    }
  }, [editing]);

  React.useEffect(() => {
    if (store.editable) {
      if (client) {
        costField.setCost(null);
      } else {
        if (placeholder) {
          costField.setCost(placeholder?.cost);
        }
      }
    }
  }, [client]);

  const costFieldValue = costFieldOperation(costField.cost, (value) => value / 100);

  return (
    <div
      title={placeholder ? `Изначальная стоимость: ${getFixedNumber(placeholder.cost / 100)}` : ''}
      className={cn({ 'has-error': store.editable && costField.error })}
    >
      {editing ? (
        <Ant.InputNumber
          value={costFieldValue}
          defaultValue={costFieldValue}
          ref={node}
          style={{ width: '100%' }}
          size="small"
          min={0}
          decimalSeparator={','}
          step={50}
          onPressEnter={toggleEdit}
          onBlur={toggleEdit}
          onChange={updated}
          placeholder={placeholder ? getFixedNumber(placeholder.cost / 100) : ''}
        />
      ) : (
        <div
          className={cn('tariff-cost-wrap', {
            'tariff-cost-wrap--editable': store.editable,
          })}
          title={placeholder ? `Изначальная стоимость: ${getFixedNumber(placeholder.cost / 100)}` : ''}
          onClick={toggleEdit}
        >
          {costFieldValue || costFieldValue === 0 ? (
            getFixedNumber(costFieldValue)
          ) : store.editable && placeholder ? (
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
      )}
    </div>
  );
}

TariffCost.propTypes = {
  costField: PropTypes.object.isRequired,
  vehicle: PropTypes.object.isRequired,
};

export default observer(TariffCost);
