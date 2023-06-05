import { Ant, VzForm } from '@vezubr/elements';
import React, { useCallback } from 'react';
import Restrictions from './additionalValues/restrictions';

const FIELDS = {
  title: 'title',
};
const validators = {
  [FIELDS.title]: (title) => (title == '' ? 'Имя группы обязательное поле' : null),
};

function ProfileGroupForm(props) {
  const { onSave, dictionaries, form, disabled = false, values = {} } = props;
  const { getFieldError, getFieldDecorator, getFieldsValue } = form;
  const [groupRestrictions, setGroupRestrictions] = React.useState([]);
  const rules = VzForm.useCreateAsyncRules(validators);
  const { requestGroupTypes } = dictionaries;

  React.useEffect(() => {
    if (values?.config) { 
      setGroupRestrictions(Object.entries(values.config).filter(([key, value]) => value).map(([key, value]) => ({id: key, value})))
    }
  }, [values])

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      if (onSave) {
        onSave(form, {groupRestrictions});
      }
    },
    [form, onSave, groupRestrictions],
  );

  return (
    <div style={{ width: '100%' }}>
      <div className={'flexbox'}>
        <div className={'flexbox column size-1'}>
          <div className={'company-info'}>
            <VzForm.Group>
              <VzForm.Row>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Наименование группы'} error={getFieldError(FIELDS.title)}>
                    {getFieldDecorator(FIELDS.title, {
                      rules: rules[FIELDS.title](getFieldsValue()),
                      initialValue: values?.[FIELDS.title] || '',
                    })(<Ant.Input disabled={disabled} placeholder={'Наименование группы'} />)}
                  </VzForm.Item>
                </VzForm.Col>
              </VzForm.Row>
            </VzForm.Group>
            <VzForm.Group>
              <VzForm.Row>
                <Restrictions
                  requestGroupTypes={requestGroupTypes}
                  disabled={disabled}
                  values={groupRestrictions}
                  setValues={setGroupRestrictions}
                />
              </VzForm.Row>
            </VzForm.Group>
            <VzForm.Group>
              <VzForm.Actions>
                <Ant.Button
                  disabled={disabled || !onSave}
                  type="primary"
                  onClick={handleSave}
                  className={'semi-wide margin-left-16'}
                >
                  Сохранить
                </Ant.Button>
              </VzForm.Actions>
            </VzForm.Group>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ant.Form.create({})(ProfileGroupForm);
