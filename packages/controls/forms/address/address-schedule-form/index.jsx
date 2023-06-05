import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Ant, ButtonDeprecated, VzForm } from '@vezubr/elements';
import { TIME_MASK, TIME_PLACEHOLDER } from '../constants';
import InputMask from 'react-input-mask';

const FIELDS = {
  day: 'day',
  workTime: 'workTime',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '9': '9',
  '10': '10',
  '11': '11',
  '12': '12',
};

export const validators = {};
// ^([0-9]|0[0-9]|1[0-9]|2[0-3])(| ):(| )[0-5][0-9](| )-(| )([0-9]|0[0-9]|1[0-9]|2[0-3])(| ):(| )[0-5][0-9]$

const AddressScheduleForm = (props) => {
  const {
    delegated = false,
    setAverageOperationTime,
    onSave,
    onCancel,
    form,
    values = {},
    averageOperationTime = {},
    disabled,
    mode,
    onEdit
  } = props
  const { getFieldError, getFieldDecorator } = form;
  const [valuesState, setValuesState] = useState(values);
  const rules = VzForm.useCreateAsyncRules(validators);

  const handleSave = React.useCallback(
    (e) => {
      e.preventDefault();
      if (onSave) {
        onSave(form);
      }
    },
    [form, onSave],
  );

  const handleCancel = React.useCallback(
    (e) => {
      e.preventDefault();
      if (onCancel) {
        onCancel(form);
      }
    },
    [form, onCancel],
  );

  const addNewInput = (item, index) => {
    const newWorkTime = [...item[FIELDS.workTime]];
    newWorkTime.push('');

    setValuesState(prev => prev.map((el, mapInd) => {
      if (mapInd === index) {
        return { ...el, [FIELDS.workTime]: newWorkTime };
      }
      return el;
    }));
  };

  return (
    <Ant.Form className="rate-form" layout="vertical" onSubmit={handleSave}>
      <VzForm.Group>
        {Array.isArray(valuesState) &&
          valuesState.map((item, index) => (
            <VzForm.Row key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <VzForm.Col style={{ width: 125 }} span={8}>{valuesState[index][FIELDS.day]}</VzForm.Col>

              {Array.isArray(item[FIELDS.workTime]) &&
                valuesState[index][FIELDS.workTime].map((el, ind) => (
                  <VzForm.Col style={{ width: 140 }} key={ind} span={8}>
                    <VzForm.Item disabled={disabled} label={`Окно доставки ${ind + 1}`} error={getFieldError(FIELDS.day)}>
                      {getFieldDecorator(`${FIELDS.workTime + index.toString()}/${ind}`, {
                        rules: rules[FIELDS.workTime]('d'),
                        initialValue: el,
                      })(
                        <InputMask mask={TIME_MASK} disabled={disabled}>
                          <Ant.Input placeholder={TIME_PLACEHOLDER} allowClear={true} />
                        </InputMask>,
                      )}
                    </VzForm.Item>
                  </VzForm.Col>
                ))}

              <ButtonDeprecated
                icon={'plusOrange'}
                onClick={() => addNewInput(item, index)}
                style={{ display: 'flex', alignItems: 'center' }}
                className={'rounded box-shadow margin-right-20'}
              >
                Добавить новое окно
              </ButtonDeprecated>
            </VzForm.Row>
          ))}
        <hr />
        <h3 className={'content-title'}>Норматив времени работы ТС на адресе, мин.</h3>
        <VzForm.Row>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'до 0.5т'} error={getFieldError(FIELDS[9])}>
              {getFieldDecorator(FIELDS[9], {
                rules: rules[FIELDS[9]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[9])],
              })(<Ant.InputNumber placeholder={'В минутах'} disabled={disabled} allowClear={true} min={0} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'1т / 7м3 / 3пал.'} error={getFieldError(FIELDS[10])}>
              {getFieldDecorator(FIELDS[10], {
                rules: rules[FIELDS[10]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[10])],
              })(<Ant.InputNumber placeholder={'В минутах'} disabled={disabled} allowClear={true} min={0} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'1.5т / 9м3 / 4пал.'} error={getFieldError(FIELDS[1])}>
              {getFieldDecorator(FIELDS[1], {
                rules: rules[FIELDS[1]](''),
                initialValue: averageOperationTime?.[Number(FIELDS[1])],
              })(<Ant.InputNumber placeholder={'В минутах'} disabled={disabled} allowClear={true} min={0} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'1.5т / 14м3 / 6пал.'} error={getFieldError(FIELDS[2])}>
              {getFieldDecorator(FIELDS[2], {
                rules: rules[FIELDS[2]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[2])],
              })(<Ant.InputNumber placeholder={'В минутах'} disabled={disabled} allowClear={true} min={0} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'3т / 16м3 / 6пал.'} error={getFieldError(FIELDS[3])}>
              {getFieldDecorator(FIELDS[3], {
                rules: rules[FIELDS[3]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[3])],
              })(<Ant.InputNumber placeholder={'В минутах'} disabled={disabled} allowClear={true} min={0} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'5т / 25м3 / 8пал.'} error={getFieldError(FIELDS[4])}>
              {getFieldDecorator(FIELDS[4], {
                rules: rules[FIELDS[4]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[4])],
              })(<Ant.InputNumber placeholder={'В минутах'} disabled={disabled} allowClear={true} min={0} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'5т / 36м3 / 15пал.'} error={getFieldError(FIELDS[5])}>
              {getFieldDecorator(FIELDS[5], {
                rules: rules[FIELDS[5]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[5])],
              })(<Ant.InputNumber placeholder={'В минутах'} disabled={disabled} allowClear={true} min={0} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'10т / 36м3 / 15пал.'} error={getFieldError(FIELDS[6])}>
              {getFieldDecorator(FIELDS[6], {
                rules: rules[FIELDS[6]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[6])],
              })(<Ant.InputNumber placeholder={'В минутах'} disabled={disabled} allowClear={true} min={0} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'20т / 82м3 / 33пал.'} error={getFieldError(FIELDS[7])}>
              {getFieldDecorator(FIELDS[7], {
                rules: rules[FIELDS[7]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[7])],
              })(<Ant.InputNumber placeholder={'В минутах'} disabled={disabled} allowClear={true} min={0} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'25т/120м3/-пал'} error={getFieldError(FIELDS[11])}>
              {getFieldDecorator(FIELDS[11], {
                rules: rules[FIELDS[11]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[11])],
              })(<Ant.InputNumber placeholder={'В минутах'} disabled={disabled} allowClear={true} min={0} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'25т/150м3/-пал'} error={getFieldError(FIELDS[12])}>
              {getFieldDecorator(FIELDS[12], {
                rules: rules[FIELDS[12]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[12])],
              })(<Ant.InputNumber placeholder={'В минутах'} disabled={disabled} allowClear={true} min={0} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>
      <VzForm.Actions>
        {mode === 'view' ? (
          <ButtonDeprecated
            disabled={APP === 'dispatcher' ? !delegated : false}
            onClick={onEdit}
            className={'semi-wide margin-left-16'}
            theme={'primary'}
          >
            Редактировать
          </ButtonDeprecated>
        ) : (
          <>
            <ButtonDeprecated onClick={handleCancel} className={'semi-wide margin-left-16'} theme={'primary'}>
              Отмена
            </ButtonDeprecated>
            <ButtonDeprecated onClick={handleSave} className={'semi-wide margin-left-16'} theme={'primary'}>
              Сохранить
            </ButtonDeprecated>
          </>
        )}
      </VzForm.Actions>
    </Ant.Form >
  );
};

AddressScheduleForm.propTypes = {
  averageOperationTime: PropTypes.object,
  setAverageOperationTime: PropTypes.func,
  values: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onEdit: PropTypes.func,
  mode: PropTypes.string,
  form: PropTypes.object,
  disabled: PropTypes.bool,
};

export default Ant.Form.create({ name: 'address_schedule_form' })(AddressScheduleForm);
