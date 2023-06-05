import React, { useMemo, useCallback } from 'react';
import { Ant, VzForm } from '@vezubr/elements';
import { useSelector } from 'react-redux';
import Validators from '@vezubr/common/common/validators';

const FIELDS = {
  title: 'title',
  type: 'type',
  contractorAutoJoin: 'contractorAutoJoin',
  allowDocAccept: 'allowDocAccept',
  allowRegistries: 'allowRegistries',
  allowActs: 'allowActs',
  comissionPayer: 'comissionPayer',
  status: 'status',
};

const ContourForm = (props) => {
  const {
    onSave,
    onCancel,
    form,
    values = {},
    disabled,
    loading
  } = props;

  const { getFieldError, getFieldDecorator, getFieldValue, getFieldsValue } = form;

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (onSave) {
        onSave(form);
      }
    },
    [form, onSave],
  );

  const { contourTypes, contourCommissionPayers, contourStatuses } = useSelector(state => state.dictionaries);
  const rules = VzForm.useCreateAsyncRules(Validators.createEditContour);

  const contourTypeOptions = useMemo(() => {
    return contourTypes.map(el => (
      <Ant.Select.Option value={el.id} key={el.id}>
        {el.title}
      </Ant.Select.Option>
    ))
  }, []);

  const contourCommisionPayerOptions = useMemo(() => {
    return contourCommissionPayers.map(el => (
      <Ant.Select.Option value={el.id} key={el.id}>
        {el.title}
      </Ant.Select.Option>
    ))
  }, []);

  const contourStatusesOptions = useMemo(() => {
    return contourStatuses.map(el => (
      <Ant.Select.Option value={el.id} key={el.id}>
        {el.title}
      </Ant.Select.Option>
    ))
  }, [])

  return (
    <div className={'contour-form'}>
      <VzForm.Group>

        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item required={true} disabled={disabled} label={'Наименование контура'} error={getFieldError(FIELDS.title)}>
              {getFieldDecorator(FIELDS.title, {
                rules: rules[FIELDS.title](getFieldsValue()),
                initialValue: values?.[FIELDS.title],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item
              disabled={disabled}
              required={true}
              label={'Тип контура'}
              error={getFieldError(FIELDS.type)}
            >
              {getFieldDecorator(FIELDS.type, {
                rules: rules[FIELDS.type](getFieldsValue()),
                initialValue: values?.[FIELDS.type],
              })(
                <Ant.Select disabled={disabled}>
                  {contourTypeOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item
              label={'Автоматическое присоединение'}
              disabled={disabled}
              error={getFieldError(FIELDS.contractorAutoJoin)}
            >
              {getFieldDecorator(FIELDS.contractorAutoJoin, {
                rules: rules[FIELDS.contractorAutoJoin](getFieldsValue()),
                initialValue: values?.[FIELDS.contractorAutoJoin] || false
              })(
                <VzForm.FieldSwitch
                  disabled={disabled}
                  checkedTitle={'Да'}
                  unCheckedTitle={'Нет'}
                  colorChecked={false}
                  checked={getFieldValue(FIELDS.contractorAutoJoin) || false}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Включена проверка документов'} disabled={disabled} error={getFieldError(FIELDS.allowDocAccept)}>
              {getFieldDecorator(FIELDS.allowDocAccept, {
                rules: rules[FIELDS.allowDocAccept](getFieldsValue()),
                initialValue: values?.[FIELDS.allowDocAccept] || false
              })(
                <VzForm.FieldSwitch
                  disabled={disabled}
                  checkedTitle={'Да'}
                  unCheckedTitle={'Нет'}
                  colorChecked={false}
                  checked={getFieldValue(FIELDS.allowDocAccept) || false}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Включены реестры'} disabled={disabled} error={getFieldError(FIELDS.allowRegistries)}>
              {getFieldDecorator(FIELDS.allowRegistries, {
                rules: rules[FIELDS.allowRegistries](getFieldsValue()),
                initialValue: values?.[FIELDS.allowRegistries] || false
              })(
                <VzForm.FieldSwitch
                  disabled={disabled}
                  checkedTitle={'Да'}
                  unCheckedTitle={'Нет'}
                  colorChecked={false}
                  checked={getFieldValue(FIELDS.allowRegistries) || false}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Включены акты'} disabled={disabled} error={getFieldError(FIELDS.allowActs)}>
              {getFieldDecorator(FIELDS.allowActs, {
                rules: rules[FIELDS.allowActs](getFieldsValue()),
                initialValue: values?.[FIELDS.allowActs] || false
              })(
                <VzForm.FieldSwitch
                  disabled={disabled}
                  checkedTitle={'Да'}
                  unCheckedTitle={'Нет'}
                  colorChecked={false}
                  checked={getFieldValue(FIELDS.allowActs) || false}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item
              disabled={disabled}
              required={true}
              label={'Кто платит комиссию'}
              error={getFieldError(FIELDS.comissionPayer)}
            >
              {getFieldDecorator(FIELDS.comissionPayer, {
                rules: rules[FIELDS.comissionPayer](getFieldsValue()),
                initialValue: values?.[FIELDS.comissionPayer],
              })(
                <Ant.Select disabled={disabled}>
                  {contourCommisionPayerOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item
              disabled={disabled}
              required={true}
              label={'Статус'}
              error={getFieldError(FIELDS.status)}
            >
              {getFieldDecorator(FIELDS.status, {
                rules: rules[FIELDS.status](getFieldsValue()),
                initialValue: values?.[FIELDS.status],
              })(
                <Ant.Select disabled={disabled}>
                  {contourStatusesOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>
      <VzForm.Actions>
        {onCancel && (
          <Ant.Button
            onClick={onCancel}
            loading={loading}
            className={'semi-wide margin-left-16'}
            type={'secondary'}
          >
            Отмена
          </Ant.Button>
        )}

        {onSave && (
          <Ant.Button
            loading={loading}
            onClick={handleSubmit}
            className={'semi-wide margin-left-16'}
            type={'primary'}
          >
            Сохранить
          </Ant.Button>
        )}
      </VzForm.Actions>
    </div>
  );
};

export default Ant.Form.create({ name: 'contour-form' })(ContourForm);
