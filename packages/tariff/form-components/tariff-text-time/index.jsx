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

function TariffTextTime(props) {
  const { costField, vehicle, placeholders, client } = props;

  const { store } = React.useContext(TariffContext);
  const [editing, setEditing] = React.useState(false);
  const node = React.useRef(null);

  const placeholder = React.useMemo(() => {
    let temp = '';
    if (placeholders) {
      const { type } = placeholders;
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
      costField.setCost(costFieldOperation(value, (value) => value));
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

  const costFieldValue = costFieldOperation(costField.cost, (value) => value);

  return (
    <div
      title={placeholder ? `Изначальное время: ${getFixedNumber(placeholder.cost)}` : ''}
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
          placeholder={placeholder ? getFixedNumber(placeholder.cost) : ''}
        />
      ) : (
        <div
          className={cn('tariff-cost-wrap', {
            'tariff-cost-wrap--editable': store.editable,
          })}
          title={placeholder ? `Изначальное время: ${getFixedNumber(placeholder.cost)}` : ''}
          onClick={toggleEdit}
        >
          {costFieldValue || costFieldValue === 0 ? (
            getFixedNumber(costFieldValue)
          ) : store.editable && placeholder ? (
            <div
              title={`Изначальное время: ${placeholder.cost}`}
              className={'tariff-cost-wrap tariff-cost-wrap--placeholder'}
            >
              {getFixedNumber(placeholder.cost)}{' '}
            </div>
          ) : (
            ''
          )}
        </div>
      )}
    </div>
  );
}
export default observer(TariffTextTime);
