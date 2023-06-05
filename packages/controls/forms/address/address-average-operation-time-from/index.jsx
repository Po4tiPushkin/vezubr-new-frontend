import React from 'react';
import { Form } from '@vezubr/elements/antd';
import { Ant, VzForm } from '@vezubr/elements';

const FIELDS = {
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

const AverageOperationTimeForm = (props) => {
  const { form, disabled, averageOperationTime } = props;
  const { getFieldError, getFieldDecorator } = form;

  const rules = VzForm.useCreateAsyncRules(validators);

  return (
    <Ant.Form layout="vertical">
      <hr />
      <h3 className={'content-title'}>Норматив времени работы ТС на адресе, мин.</h3>
      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'до 0.5т'} error={getFieldError(FIELDS[9])}>
              {getFieldDecorator(FIELDS[9], {
                rules: rules[FIELDS[9]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[9])],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'1т / 7м3 / 3пал.'} error={getFieldError(FIELDS[10])}>
              {getFieldDecorator(FIELDS[10], {
                rules: rules[FIELDS[10]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[10])],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'1.5т / 9м3 / 4пал.'} error={getFieldError(FIELDS[1])}>
              {getFieldDecorator(FIELDS[1], {
                rules: rules[FIELDS[1]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[1])],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'1.5т / 14м3 / 6пал.'} error={getFieldError(FIELDS[2])}>
              {getFieldDecorator(FIELDS[2], {
                rules: rules[FIELDS[2]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[2])],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'3т / 16м3 / 6пал.'} error={getFieldError(FIELDS[3])}>
              {getFieldDecorator(FIELDS[3], {
                rules: rules[FIELDS[3]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[3])],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'5т / 25м3 / 8пал.'} error={getFieldError(FIELDS[4])}>
              {getFieldDecorator(FIELDS[4], {
                rules: rules[FIELDS[4]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[4])],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'5т / 36м3 / 15пал.'} error={getFieldError(FIELDS[5])}>
              {getFieldDecorator(FIELDS[5], {
                rules: rules[FIELDS[5]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[5])],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'10т / 36м3 / 15пал.'} error={getFieldError(FIELDS[6])}>
              {getFieldDecorator(FIELDS[6], {
                rules: rules[FIELDS[6]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[6])],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'20т / 82м3 / 33пал.'} error={getFieldError(FIELDS[7])}>
              {getFieldDecorator(FIELDS[7], {
                rules: rules[FIELDS[7]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[7])],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'25т/120м3/-пал'} error={getFieldError(FIELDS[11])}>
              {getFieldDecorator(FIELDS[11], {
                rules: rules[FIELDS[11]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[11])],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col>
            <VzForm.Item disabled={disabled} label={'25т/150м3/-пал'} error={getFieldError(FIELDS[12])}>
              {getFieldDecorator(FIELDS[12], {
                rules: rules[FIELDS[12]]('d'),
                initialValue: averageOperationTime?.[Number(FIELDS[12])],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>
    </Ant.Form>
  )
}

export default Form.create({ name: 'AverageOperationTime_form' })(AverageOperationTimeForm);
