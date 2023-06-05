import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm } from '@vezubr/elements';
import cn from 'classnames';

function SettingsOperationTimeForm(props) {
  const { vehicleTypes, addressTypes, averageOperationTime, onSave } = props;

  const [operationTime, setOperationTime] = useState(averageOperationTime);

  React.useEffect(() => {
    setOperationTime(averageOperationTime);
  }, [averageOperationTime]);

  const [edit, setEdit] = useState(false);

  const formattedElements = (items) => {
    const result = {
      [0]: {
        [0]: 'Тип ТС/Тип Адреса',
      },
    };

    Object.keys(items).forEach((item) => {
      result[0] = {
        ...result[0],
        [item]: addressTypes.find((elem) => parseInt(item) === elem.id)?.title,
      };
    });

    Object.entries(items).forEach(([keyI, valueI]) => {
      Object.entries(valueI).forEach(([keyJ, valueJ]) => {
        result[keyJ] = {
          ...result[keyJ],
          [keyI]: valueJ,
          [0]: vehicleTypes.find((item) => parseInt(keyJ) === item.id)?.name,
        };
      });
    });

    const sortedRes = { 0: result['0'] };

    Object.values(vehicleTypes).forEach((el) => {
      sortedRes[el.orderPosition] = { ...result[el.id], id: el.id };
    });

    return sortedRes;
  };

  const changedInputValue = (value, i, j) => {
    const data = { ...operationTime };

    data[i][j] = value;
    setOperationTime(data);
  };

  const renderElements = useMemo(() => {
    if (!operationTime) {
      return null;
    }
    let result = [];

    Object.entries(formattedElements(operationTime)).forEach(([keyI, valueI]) => {
      Object.entries(valueI).forEach(([keyJ, valueJ]) => {
        if (keyJ !== 'id') {
          if (keyI === '0' || keyJ === '0') {
            result.push(
              <div key={`${keyI}-${keyJ}`} className={'form-operation-time__item'}>
                <div className="form-operation-time__table-name">{valueJ}</div>
              </div>,
            );
          } else {
            result.push(
              <div key={`${keyI}-${keyJ}`} className={'form-operation-time__item'}>
                <VzForm.Item disabled={!edit}>
                  <Ant.InputNumber
                    disabled={!edit}
                    allowClear={true}
                    min={0}
                    value={valueJ}
                    onChange={(e) => changedInputValue(e, keyJ, valueI.id)}
                    precision={0}
                  />
                </VzForm.Item>
              </div>,
            );
          }
        }
      });
    });

    return result;
  }, [operationTime, vehicleTypes, addressTypes, edit]);

  const handleChangeEditMode = () => {
    setEdit(!edit);
  };

  const handleSaveForm = async () => {
    await onSave(operationTime);
    handleChangeEditMode();
  };

  return (
    <div>
      <div className={'form-operation-time__items-wrp'}>{renderElements}</div>
      <VzForm.Actions align={'left'}>
        {!edit && (
          <Ant.Button type="primary" onClick={handleChangeEditMode} className={cn('semi-wide')}>
            Редактировать
          </Ant.Button>
        )}
        {edit && (
          <Ant.Button onClick={handleChangeEditMode} className={cn('semi-wide')} theme={'primary'}>
            Отменить
          </Ant.Button>
        )}
        <Ant.Button
          type="primary"
          onClick={handleSaveForm}
          className={cn('semi-wide margin-left-16', { disabled: !edit })}
        >
          Сохранить
        </Ant.Button>
      </VzForm.Actions>
    </div>
  );
}

SettingsOperationTimeForm.propTypes = {
  vehicleTypes: PropTypes.array,
  addressTypes: PropTypes.array,
  averageOperationTime: PropTypes.object,
  onSave: PropTypes.func,
};

export default SettingsOperationTimeForm;
