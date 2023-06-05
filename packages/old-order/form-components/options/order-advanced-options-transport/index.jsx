import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Ant, VzForm } from '@vezubr/elements';
import { prohibitedGoods } from '../../../short-info';
import { beautifyNumber } from '@vezubr/common/utils'
import OrderFieldSwitch from '../../../form-fields/order-field-switch';
import OrderFieldNumber from '../../../form-fields/order-field-number';
import OrderFieldText from '../../../form-fields/order-field-text';
import OrderFieldSelect from '../../../form-fields/order-field-select';
import OrderFieldCurrency from '../../../form-fields/order-field-currency';
import { useSelector } from 'react-redux'
import t from '@vezubr/common/localization';
import OrderCustomProperties from '../../../form-components/order-custom-properties';

function OrderAdvancedOptionsTransport(props) {
  const { disabled = false } = props

  const { cargoTypes, orderSettingPointChangeType } = useSelector((state) => state.dictionaries)

  return (
    <Ant.Collapse className={'order-advanced-options'}>
      <Ant.Collapse.Panel id={'order-advancedoptions'} header="Показать дополнительные параметры" key="1">
        <VzForm.Row>
          <VzForm.Col span={6}>
            <OrderFieldNumber
              label={'Общая масса груза, кг'}
              placeholder={'Ввести массу'}
              formatter={beautifyNumber}
              min={0}
              step={1000}
              max={30000}
              decimalSeparator={','}
              name={'cargoDeclaredWeight'}
              disabled={disabled}
              id={'order-cargodeclaredweight'}
            />
          </VzForm.Col>
          <VzForm.Col span={6}>
            <OrderFieldNumber
              label={'Общий объем груза, м\u00B3 (до 200)'}
              placeholder={'Ввести объем'}
              min={0}
              step={10}
              max={200}
              decimalSeparator={','}
              name={'cargoDeclaredVolume'}
              disabled={disabled}
              id={'order-cargodeclaredvolume'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldNumber
              label={'Количество мест, пал'}
              placeholder={'Ввести количество мест'}
              min={0}
              step={1}
              name={'cargoDeclaredPlacesCount'}
              disabled={disabled}
              id={'order-cargodeclaredplacescount'}
            />
          </VzForm.Col>
          <VzForm.Col span={6}>
            <OrderFieldText
              label={'Тип упаковки'}
              name={'cargoPackagingType'}
              placeholder={'Введите тип упаковки'}
              disabled={disabled}
              id={'order-cargopackagingtype'}
            />
          </VzForm.Col>

        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col span={6}>
            <OrderFieldCurrency
              label={t.order('assessedCargoValue')}
              placeholder={'Ввести стоимость'}
              min={0}
              step={500}
              name={'assessedCargoValue'}
              disabled={disabled}
              id={'order-assessedcargovalue'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
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
              disabled={disabled}
              id={'order-cargocategoryids'}
              optionId={'order-cargocategoryid'}
            />
          </VzForm.Col>
          <VzForm.Col span={6}>
            <OrderFieldText id={'order-'} label={'Идентификатор рейса'} name={'clientNumber'} disabled={disabled} />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSelect
              label={'Изменение маршрута водителем'}
              name={'pointChangeType'}
              list={{
                array: orderSettingPointChangeType,
                labelKey: 'title',
                valueKey: 'id'
              }}
              disabled={disabled}
              allowClear={false}
              opitonId={'order-pointchangetype'}
              id={'order-pointchangetypes'}
            />
          </VzForm.Col>

        </VzForm.Row>

        {/* <VzForm.Row>
          <VzForm.Col span={12}>
            <OrderFieldNumber
              label={'Высота тс от земли'}
              min={101}
              step={100}
              name={'maxHeightFromGroundInCm'}
              disabled={true}
            />
          </VzForm.Col>
        </VzForm.Row> */}
      </Ant.Collapse.Panel>
    </Ant.Collapse>
  );
}
export default observer(OrderAdvancedOptionsTransport);
