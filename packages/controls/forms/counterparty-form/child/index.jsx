import React, { useCallback, useState, useEffect } from 'react';
import { Ant, VzForm } from '@vezubr/elements';
import Validators from '@vezubr/common/common/validators';
import { Organization as OrganizationService } from '@vezubr/services';
const ROLES_VALUES = [
  {
    id: 1,
    title: 'Подрядчик'
  },
  {
    id: 4,
    title: 'Экспедитор'
  }
]

const FIELDS = {
  inn: 'inn',
  kpp: 'kpp',
  role: 'role'
}
const CounterpartyChildForm = (props) => {
  const { onSave, form, disabled } = props;
  const [organization, setOrganization] = useState('');
  const { getFieldError, getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue } = form;
  const rules = VzForm.useCreateAsyncRules(Validators.createChildCounterparty);

  const onSubmit = useCallback(() => {
    if (onSave) {
      onSave(form)
    }
  }, [form])

  const getOrganization = useCallback(async (inn, kpp) => {
    const payload = { inn: inn }
    if (kpp) {
      payload.kpp = kpp
    }
    try {
      const response = await OrganizationService.getOrganizationFull(payload);
      if (response?.[0]?.shortName) {
        console.log(response)
        setOrganization(response?.[0]?.shortName);
      }
      else {
        setOrganization('');
      }
    } catch (e) {
    }
  }, [])

  useEffect(() => {
    if (!getFieldError(FIELDS.inn) && !getFieldError(FIELDS.kpp)) {
      getOrganization(getFieldValue(FIELDS.inn), getFieldValue(FIELDS.kpp))
    }
  }, [getFieldValue(FIELDS.inn), getFieldValue(FIELDS.kpp)])

  return (
    <VzForm.Group>
      <VzForm.Row>
        <VzForm.Col span={12}>
          <VzForm.Item
            label={"ИНН"}
            required={true}
            disabled={disabled}
            error={getFieldError(FIELDS.inn)}
          >
            {getFieldDecorator(FIELDS.inn, {
              rules: rules[FIELDS.inn](getFieldsValue())
            })(<Ant.Input disabled={disabled} />)
            }
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={12}>
          <VzForm.Item
            label={"КПП"}
            disabled={disabled}
            error={getFieldError(FIELDS.kpp)}
          >
            {getFieldDecorator(FIELDS.kpp, {
              rules: rules[FIELDS.kpp](getFieldsValue())
            })(<Ant.Input disabled={disabled} />)
            }
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={12}>
          <VzForm.Item
            label={"Роль"}
            required={true}
            disabled={disabled}
            error={getFieldError(FIELDS.role)}
          >
            {getFieldDecorator(FIELDS.role, {
              rules: rules[FIELDS.role](getFieldsValue())
            })(
              <Ant.Select>
                {ROLES_VALUES.map(el => (<Ant.Select.Option value={el.id} key={el.id}>{el.title}</Ant.Select.Option>))}
              </Ant.Select>
            )
            }
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={12}>
          <VzForm.Item
            label={"Название"}
            disabled={true}
          >
            <Ant.Input disabled={true} value={organization} />
          </VzForm.Item>
        </VzForm.Col>
      </VzForm.Row>
      <div className='flexbox' style={{ 'justifyContent': "end" }}>
        <Ant.Button type={"primary"} onClick={onSubmit}>Создать</Ant.Button>
      </div>
    </VzForm.Group>
  )
}

export default Ant.Form.create({})(CounterpartyChildForm);