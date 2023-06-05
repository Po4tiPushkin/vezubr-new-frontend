import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Ant, VzForm, ButtonDeprecated, GeoZonesElement, IconDeprecated, showConfirm } from '@vezubr/elements';
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

const AdditionalData = (props) => {
  const { form, dictionaries, disabled, values, rules } = props;
  const { getFieldError, getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue, setFields } = form;

  return (
    <VzForm.Group title={'Дополнительные параметры'}>
      <VzForm.Row>
        <VzForm.Col span={8}>
          <VzForm.Item disabled={disabled} error={getFieldError(ADDITIONAL_FIELDS.hasHydrolift)}>
            {getFieldDecorator(ADDITIONAL_FIELDS.hasHydrolift, {
              initialValue: values?.[ADDITIONAL_FIELDS.hasHydrolift] || false,
              rules: rules[ADDITIONAL_FIELDS.hasHydrolift](getFieldsValue()),
            })(
              <VzForm.FieldSwitch
                disabled={disabled}
                checkedTitle={'Наличие гидроборта'}
                unCheckedTitle={'Наличие гидроборта'}
                colorChecked={false}
                checked={getFieldValue(ADDITIONAL_FIELDS.hasHydrolift) || false}
              />,
            )}
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={8}>
          <VzForm.Item disabled={disabled} error={getFieldError(ADDITIONAL_FIELDS.hasPalletsJack)}>
            {getFieldDecorator(ADDITIONAL_FIELDS.hasPalletsJack, {
              initialValue: values?.[ADDITIONAL_FIELDS.hasPalletsJack] || false,
              rules: rules[ADDITIONAL_FIELDS.hasPalletsJack](getFieldsValue()),
            })(
              <VzForm.FieldSwitch
                disabled={disabled}
                checkedTitle={'Наличие рохлы'}
                unCheckedTitle={'Наличие рохлы'}
                colorChecked={false}
                checked={getFieldValue(ADDITIONAL_FIELDS.hasPalletsJack) || false}
              />,
            )}
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={8}>
          <VzForm.Item disabled={disabled} error={getFieldError(ADDITIONAL_FIELDS.hasConics)}>
            {getFieldDecorator(ADDITIONAL_FIELDS.hasConics, {
              initialValue: values?.[ADDITIONAL_FIELDS.hasConics] || false,
              rules: rules[ADDITIONAL_FIELDS.hasConics](getFieldsValue()),
            })(
              <VzForm.FieldSwitch
                disabled={disabled}
                checkedTitle={'Наличие коников'}
                unCheckedTitle={'Наличие коников'}
                colorChecked={false}
                checked={getFieldValue(ADDITIONAL_FIELDS.hasConics) || false}
              />,
            )}
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={8}>
          <VzForm.Item disabled={disabled} error={getFieldError(ADDITIONAL_FIELDS.hasStrap)}>
            {getFieldDecorator(ADDITIONAL_FIELDS.hasStrap, {
              initialValue: values?.[ADDITIONAL_FIELDS.hasStrap] || false,
              rules: rules[ADDITIONAL_FIELDS.hasStrap](getFieldsValue()),
            })(
              <VzForm.FieldSwitch
                disabled={disabled}
                checkedTitle={'Наличие ремней'}
                unCheckedTitle={'Наличие ремней'}
                colorChecked={false}
                checked={getFieldValue(ADDITIONAL_FIELDS.hasStrap) || false}
              />,
            )}
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={8}>
          <VzForm.Item disabled={disabled} error={getFieldError(ADDITIONAL_FIELDS.hasChain)}>
            {getFieldDecorator(ADDITIONAL_FIELDS.hasChain, {
              initialValue: values?.[ADDITIONAL_FIELDS.hasChain] || false,
              rules: rules[ADDITIONAL_FIELDS.hasChain](getFieldsValue()),
            })(
              <VzForm.FieldSwitch
                disabled={disabled}
                checkedTitle={'Наличие цепи'}
                unCheckedTitle={'Наличие цепи'}
                colorChecked={false}
                checked={getFieldValue(ADDITIONAL_FIELDS.hasChain) || false}
              />,
            )}
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={8}>
          <VzForm.Item disabled={disabled} error={getFieldError(ADDITIONAL_FIELDS.hasTarpaulin)}>
            {getFieldDecorator(ADDITIONAL_FIELDS.hasTarpaulin, {
              initialValue: values?.[ADDITIONAL_FIELDS.hasTarpaulin] || false,
              rules: rules[ADDITIONAL_FIELDS.hasTarpaulin](getFieldsValue()),
            })(
              <VzForm.FieldSwitch
                disabled={disabled}
                checkedTitle={'Наличие брезента'}
                unCheckedTitle={'Наличие брезента'}
                colorChecked={false}
                checked={getFieldValue(ADDITIONAL_FIELDS.hasTarpaulin) || false}
              />,
            )}
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={8}>
          <VzForm.Item disabled={disabled} error={getFieldError(ADDITIONAL_FIELDS.hasNet)}>
            {getFieldDecorator(ADDITIONAL_FIELDS.hasNet, {
              initialValue: values?.[ADDITIONAL_FIELDS.hasNet] || false,
              rules: rules[ADDITIONAL_FIELDS.hasNet](getFieldsValue()),
            })(
              <VzForm.FieldSwitch
                disabled={disabled}
                checkedTitle={'Наличие сети'}
                unCheckedTitle={'Наличие сети'}
                colorChecked={false}
                checked={getFieldValue(ADDITIONAL_FIELDS.hasNet) || false}
              />,
            )}
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={8}>
          <VzForm.Item disabled={disabled} error={getFieldError(ADDITIONAL_FIELDS.hasWheelChock)}>
            {getFieldDecorator(ADDITIONAL_FIELDS.hasWheelChock, {
              initialValue: values?.[ADDITIONAL_FIELDS.hasWheelChock] || false,
              rules: rules[ADDITIONAL_FIELDS.hasWheelChock](getFieldsValue()),
            })(
              <VzForm.FieldSwitch
                disabled={disabled}
                checkedTitle={'Наличие башмаков'}
                unCheckedTitle={'Наличие башмаков'}
                colorChecked={false}
                checked={getFieldValue(ADDITIONAL_FIELDS.hasWheelChock) || false}
              />,
            )}
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={8}>
          <VzForm.Item disabled={disabled} error={getFieldError(ADDITIONAL_FIELDS.hasCornerPillar)}>
            {getFieldDecorator(ADDITIONAL_FIELDS.hasCornerPillar, {
              initialValue: values?.[ADDITIONAL_FIELDS.hasCornerPillar] || false,
              rules: rules[ADDITIONAL_FIELDS.hasCornerPillar](getFieldsValue()),
            })(
              <VzForm.FieldSwitch
                disabled={disabled}
                checkedTitle={'Наличие угловых стоек'}
                unCheckedTitle={'Наличие угловых стоек'}
                colorChecked={false}
                checked={getFieldValue(ADDITIONAL_FIELDS.hasCornerPillar) || false}
              />,
            )}
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={8}>
          <VzForm.Item disabled={disabled} error={getFieldError(ADDITIONAL_FIELDS.hasDoppelstock)}>
            {getFieldDecorator(ADDITIONAL_FIELDS.hasDoppelstock, {
              initialValue: values?.[ADDITIONAL_FIELDS.hasDoppelstock] || false,
              rules: rules[ADDITIONAL_FIELDS.hasDoppelstock](getFieldsValue()),
            })(
              <VzForm.FieldSwitch
                disabled={disabled}
                checkedTitle={'Наличие допельштока'}
                unCheckedTitle={'Наличие допельштока'}
                colorChecked={false}
                checked={getFieldValue(ADDITIONAL_FIELDS.hasDoppelstock) || false}
              />,
            )}
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={8}>
          <VzForm.Item disabled={disabled} error={getFieldError(ADDITIONAL_FIELDS.hasWoodenFloor)}>
            {getFieldDecorator(ADDITIONAL_FIELDS.hasWoodenFloor, {
              initialValue: values?.[ADDITIONAL_FIELDS.hasWoodenFloor] || false,
              rules: rules[ADDITIONAL_FIELDS.hasWoodenFloor](getFieldsValue()),
            })(
              <VzForm.FieldSwitch
                disabled={disabled}
                checkedTitle={'Наличие деревянного пола'}
                unCheckedTitle={'Наличие деревянного пола'}
                colorChecked={false}
                checked={getFieldValue(ADDITIONAL_FIELDS.hasWoodenFloor) || false}
              />,
            )}
          </VzForm.Item>
        </VzForm.Col>
      </VzForm.Row>
    </VzForm.Group>
  )
}

export default AdditionalData
