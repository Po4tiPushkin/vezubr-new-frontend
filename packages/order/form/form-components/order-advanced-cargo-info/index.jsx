import React from 'react';
import { VzForm } from '@vezubr/elements';
import OrderFieldSelect from '../../form-fields/order-field-select';
import OrderFieldCurrency from '../../form-fields/order-field-currency';
import OrderFieldSwitch from '../../form-fields/order-field-switch';
import { useSelector } from 'react-redux';
import { prohibitedGoods } from '../../short-info';
import t from '@vezubr/common/localization';

function OrderAdvancedCargoInfo(props) {
  const { insured, insuranceAmount, republish, isInsuranceRequired, isClientInsurance } = props;
  const { cargoTypes } = useSelector((state) => state.dictionaries)

  return (
    <VzForm.Group title={'Страхование (не включена в стоимость перевозки)'}>
      <VzForm.Row>
        <VzForm.Col span={12}>
          {
            !isClientInsurance && republish
              ?
              <OrderFieldSwitch
                label={'Требование Подрядчику застраховать груз'}
                name={'isInsuranceRequired'}
                checkedTitle={'Да'}
                unCheckedTitle={'Нет'}
                id={'order-insurance'}
              />
              :
              <OrderFieldSwitch
                label={'Требуется страхование'}
                name={'insurance'}
                checkedTitle={'Да'}
                unCheckedTitle={'Нет'}
                disabled={republish}
                id={'order-insurance'}
              />
          }
        </VzForm.Col>
      </VzForm.Row>
      {(insured || isInsuranceRequired) && (
        <VzForm.Row>
          <VzForm.Col span={12}>
            <OrderFieldCurrency
              label={t.order('assessedCargoValue')}
              placeholder={'Ввести стоимость'}
              min={0}
              step={500}
              name={'assessedCargoValue'}
              disabled={republish ? isClientInsurance && insured : insured && isInsuranceRequired}
              id={'order-assessedcargovalue'}
            />
          </VzForm.Col>

          <VzForm.Col span={12}>
            <OrderFieldSelect
              name={'cargoCategoryId'}
              shortInfo={prohibitedGoods}
              list={{
                array: cargoTypes,
                labelKey: 'title',
                valueKey: 'id'
              }}
              label={'Категория груза'}
              searchPlaceholder={'Введите категорию груза для поиска'}
              placeholder={'Выберите категорию груза'}
              disabled={republish ? isClientInsurance && insured : insured && isInsuranceRequired}
              id={'order-cargocategoryids'}
              optionId={'order-cargocategoryid'}
            />
          </VzForm.Col>
          {
            insuranceAmount && (
              <VzForm.Col span={12}>
                <OrderFieldCurrency
                  label={'Страховая премия, руб'}
                  placeholder={'Ввести стоимость'}
                  min={0}
                  step={500}
                  name={'insuranceAmount'}
                  disabled={true}
                  id={'order-insuranceamount'}
                />
              </VzForm.Col>
            )
          }
        </VzForm.Row>
      )}
    </VzForm.Group>
  );
}

export default OrderAdvancedCargoInfo;
