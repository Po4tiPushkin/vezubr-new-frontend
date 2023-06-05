import React from 'react';
import { filterNameValidator } from './validate';
import { Ant, VzForm } from '@vezubr/elements';


const FIELDS = {
  filterName: 'documentNumber',
  saveColumns: 'saveColumns'
}

export const validators = {
  [FIELDS.filterName]: (filterName) => filterNameValidator(filterName, true),
};

function FilterSaveEditor({ onSave, form, values = {}, tableKey }) {
  const { getFieldDecorator, getFieldError, getFieldValue } = form;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSave) {
      onSave(form);
    }
  }

  const rules = VzForm.useCreateAsyncRules(validators);

  return (
    <Ant.Form onSubmit={handleSubmit} >
      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <VzForm.Item label={'НАЗВАНИЕ ФИЛЬТРА'} error={getFieldError(FIELDS.filterName)}>
              {getFieldDecorator(FIELDS.filterName, {
                rules: rules[FIELDS.filterName]('d'),
              })(
                <Ant.Input allowClear={true} />
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
        {tableKey && (
          <VzForm.Row>
            <VzForm.Col span={24}>
              <VzForm.Item>
                {getFieldDecorator(FIELDS.saveColumns, {})(
                  <VzForm.FieldSwitch
                    checkedTitle={'Сохранить конфигурацию столбцов списка'}
                    unCheckedTitle={'Сохранить конфигурацию столбцов списка'}
                    colorChecked={false}
                    checked={getFieldValue(FIELDS.saveColumns) || false}
                  />
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        )}
      </VzForm.Group>
      <VzForm.Actions>
        <Ant.Button type={'primary'} htmlType="submit" >
          Сохранить
        </Ant.Button>
      </VzForm.Actions>
    </Ant.Form>
  )
}

export default Ant.Form.create({ name: 'table_filtered' })(FilterSaveEditor);