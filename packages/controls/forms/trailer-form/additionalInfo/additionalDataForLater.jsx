import React, { useMemo } from 'react';
import { VzForm, Ant } from '@vezubr/elements';
import _range from 'lodash/range';


const ADDITIONAL_FIELDS = {
  hasHydrolift: 'hasHydrolift',
  hasPalletsJack: 'hasPalletsJack',
  hasConics: 'hasConics',
  hasStrap: 'hasStrap',
  hasChain: 'hasChain',
  hasTarpaulin: 'hasTarpaulin',
  hasNet: 'hasNet',
  hasWheelChock: 'hasWheelChock',
  hasCornerPillar: 'hasCornerPillar',
  hasDoppelstock: 'hasDoppelstock',
  hasWoodenFloor: 'hasWoodenFloor',
}

const OPTIONS_DATA = [
  {
    id: 0,
    value: true,
    title: 'Да'
  },
  {
    id: 1,
    value: false,
    title: 'Нет'
  },
]

const AdditionalData = (props) => {
  const { form, disabled, values = {}, rules } = props;
  const { getFieldError, getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue, setFields } = form;
  const options = useMemo(() => {
    return OPTIONS_DATA.map(el => {
      return (
        <Ant.Select.Option key={el.id} value={el.value}>
          {el.title}
        </Ant.Select.Option>
      )
    })
  }, [])
  return (
    <>
      <VzForm.Group title={'Дополнительные параметры'}>
        <VzForm.Row>
          <VzForm.Col span={6}>
            <VzForm.Item
              label={'Гидробот'}
              required={false}
              disabled={disabled}
              error={getFieldError(ADDITIONAL_FIELDS.hasHydrolift)}
            >
              {getFieldDecorator(ADDITIONAL_FIELDS.hasHydrolift, {
                initialValue: typeof values?.[ADDITIONAL_FIELDS.hasHydrolift] === 'boolean' ?
                  values?.[ADDITIONAL_FIELDS.hasHydrolift] :
                  undefined,
                rules: rules[ADDITIONAL_FIELDS.hasHydrolift](getFieldsValue()),
              })(
                <Ant.Select disabled={disabled} placeholder={'Не указано'}>
                  {options}
                </Ant.Select>
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item
              label={'Наличие рохлы'}
              required={false}
              disabled={disabled}
              error={getFieldError(ADDITIONAL_FIELDS.hasPalletsJack)}
            >
              {getFieldDecorator(ADDITIONAL_FIELDS.hasPalletsJack, {
                initialValue: typeof values?.[ADDITIONAL_FIELDS.hasPalletsJack] === 'boolean' ?
                  values?.[ADDITIONAL_FIELDS.hasPalletsJack] :
                  undefined,
                rules: rules[ADDITIONAL_FIELDS.hasPalletsJack](getFieldsValue()),
              })(
                <Ant.Select disabled={disabled} placeholder={'Не указано'}>
                  {options}
                </Ant.Select>
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item
              label={'Наличие коников'}
              required={false}
              disabled={disabled}
              error={getFieldError(ADDITIONAL_FIELDS.hasConics)}
            >
              {getFieldDecorator(ADDITIONAL_FIELDS.hasConics, {
                initialValue: typeof values?.[ADDITIONAL_FIELDS.hasConics] === 'boolean' ?
                  values?.[ADDITIONAL_FIELDS.hasConics] :
                  undefined,
                rules: rules[ADDITIONAL_FIELDS.hasConics](getFieldsValue()),
              })(
                <Ant.Select disabled={disabled} placeholder={'Не указано'}>
                  {options}
                </Ant.Select>
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item
              label={'Наличие ремней'}
              required={false}
              disabled={disabled}
              error={getFieldError(ADDITIONAL_FIELDS.hasStrap)}
            >
              {getFieldDecorator(ADDITIONAL_FIELDS.hasStrap, {
                initialValue: typeof values?.[ADDITIONAL_FIELDS.hasStrap] === 'boolean' ?
                  values?.[ADDITIONAL_FIELDS.hasStrap] :
                  undefined,
                rules: rules[ADDITIONAL_FIELDS.hasStrap](getFieldsValue()),
              })(
                <Ant.Select disabled={disabled} placeholder={'Не указано'}>
                  {options}
                </Ant.Select>
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item
              label={'Наличие цепи'}
              required={false}
              disabled={disabled}
              error={getFieldError(ADDITIONAL_FIELDS.hasChain)}
            >
              {getFieldDecorator(ADDITIONAL_FIELDS.hasChain, {
                initialValue: typeof values?.[ADDITIONAL_FIELDS.hasChain] === 'boolean' ?
                  values?.[ADDITIONAL_FIELDS.hasChain] :
                  undefined,
                rules: rules[ADDITIONAL_FIELDS.hasChain](getFieldsValue()),
              })(
                <Ant.Select disabled={disabled} placeholder={'Не указано'}>
                  {options}
                </Ant.Select>
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item
              label={'Наличие брезента'}
              required={false}
              disabled={disabled}
              error={getFieldError(ADDITIONAL_FIELDS.hasTarpaulin)}
            >
              {getFieldDecorator(ADDITIONAL_FIELDS.hasTarpaulin, {
                initialValue: typeof values?.[ADDITIONAL_FIELDS.hasTarpaulin] === 'boolean' ?
                  values?.[ADDITIONAL_FIELDS.hasTarpaulin] :
                  undefined,
                rules: rules[ADDITIONAL_FIELDS.hasTarpaulin](getFieldsValue()),
              })(
                <Ant.Select disabled={disabled} placeholder={'Не указано'}>
                  {options}
                </Ant.Select>
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item
              label={'Наличие сети'}
              required={false}
              disabled={disabled}
              error={getFieldError(ADDITIONAL_FIELDS.hasNet)}
            >
              {getFieldDecorator(ADDITIONAL_FIELDS.hasNet, {
                initialValue: typeof values?.[ADDITIONAL_FIELDS.hasNet] === 'boolean' ?
                  values?.[ADDITIONAL_FIELDS.hasNet] :
                  undefined,
                rules: rules[ADDITIONAL_FIELDS.hasNet](getFieldsValue()),
              })(
                <Ant.Select disabled={disabled} placeholder={'Не указано'}>
                  {options}
                </Ant.Select>
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item
              label={'Наличие башмаков'}
              required={false}
              disabled={disabled}
              error={getFieldError(ADDITIONAL_FIELDS.hasWheelChock)}
            >
              {getFieldDecorator(ADDITIONAL_FIELDS.hasWheelChock, {
                initialValue: typeof values?.[ADDITIONAL_FIELDS.hasWheelChock] === 'boolean' ?
                  values?.[ADDITIONAL_FIELDS.hasWheelChock] :
                  undefined,
                rules: rules[ADDITIONAL_FIELDS.hasWheelChock](getFieldsValue()),
              })(
                <Ant.Select disabled={disabled} placeholder={'Не указано'}>
                  {options}
                </Ant.Select>
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item
              label={'Наличие угловых стоек'}
              required={false}
              disabled={disabled}
              error={getFieldError(ADDITIONAL_FIELDS.hasCornerPillar)}
            >
              {getFieldDecorator(ADDITIONAL_FIELDS.hasCornerPillar, {
                initialValue: typeof values?.[ADDITIONAL_FIELDS.hasCornerPillar] === 'boolean' ?
                  values?.[ADDITIONAL_FIELDS.hasCornerPillar] :
                  undefined,
                rules: rules[ADDITIONAL_FIELDS.hasCornerPillar](getFieldsValue()),
              })(
                <Ant.Select disabled={disabled} placeholder={'Не указано'}>
                  {options}
                </Ant.Select>
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item
              label={'Наличие допельштока'}
              required={false}
              disabled={disabled}
              error={getFieldError(ADDITIONAL_FIELDS.hasDoppelstock)}
            >
              {getFieldDecorator(ADDITIONAL_FIELDS.hasDoppelstock, {
                initialValue: typeof values?.[ADDITIONAL_FIELDS.hasDoppelstock] === 'boolean' ?
                  values?.[ADDITIONAL_FIELDS.hasDoppelstock] :
                  undefined,
                rules: rules[ADDITIONAL_FIELDS.hasDoppelstock](getFieldsValue()),
              })(
                <Ant.Select disabled={disabled} placeholder={'Не указано'}>
                  {options}
                </Ant.Select>
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item
              label={'Наличие деревянного пола'}
              required={false}
              disabled={disabled}
              error={getFieldError(ADDITIONAL_FIELDS.hasWoodenFloor)}
            >
              {getFieldDecorator(ADDITIONAL_FIELDS.hasWoodenFloor, {
                initialValue: typeof values?.[ADDITIONAL_FIELDS.hasWoodenFloor] === 'boolean' ?
                  values?.[ADDITIONAL_FIELDS.hasWoodenFloor] :
                  undefined,
                rules: rules[ADDITIONAL_FIELDS.hasWoodenFloor](getFieldsValue()),
              })(
                <Ant.Select disabled={disabled} placeholder={'Не указано'}>
                  {options}
                </Ant.Select>
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>
    </>
  )
}

export default AdditionalData