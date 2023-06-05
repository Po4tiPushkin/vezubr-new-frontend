import { VzForm, Ant } from '@vezubr/elements';
import React from 'react';
import OrderFieldSelect from '../../form-fields/order-field-select';
import OrderFieldTime from '../../form-fields/order-field-time';
import OrderFieldDate from '../../form-fields/order-field-date';
import OrderFieldNumber from '../../form-fields/order-field-number';
import moment from 'moment'
import { ORDER_REGULARITY_MONTH_DAYS, ORDER_REGULARITY_OFFSETS, ORDER_REGULARITY_UNITS, ORDER_REGULARITY_WEEK_DAYS } from '../../constants';
import { OrderContext } from '../../context';
import { useObserver } from "mobx-react";
import OrderFieldText from '../../form-fields/order-field-text';

function OrderRegularSettings(props) {
  const { disabledFields, arriveAt } = props

  const { store } = React.useContext(OrderContext)

  const unit = useObserver(() => store.getDataItem('unit'))
  const amountItem = useObserver(() => store.getDataItem('amount'));
  const startOfPeriod = useObserver(() => store.getDataItem('startOfPeriod'))
  const endOfPeriod = useObserver(() => store.getDataItem('endOfPeriod'))

  React.useEffect(() => {
    store.setDataItem('toStartAtDate', startOfPeriod)
  }, [startOfPeriod]);

  React.useEffect(() => {
    if (Array.isArray(amountItem)) {
      const newAmount = amountItem.filter(el => el);
      store.setDataItem('amount', newAmount);
    }
  }, [unit])

  const disabledEndOfPeriodDate = React.useCallback((date) => {
    return date.isBefore(moment().add(1, 'day'), 'date') || date.isBefore(moment(startOfPeriod).add(1, 'day'), 'date');
  }, [startOfPeriod]);

  const arriveAtDate = React.useMemo(() => {
    return arriveAt ? moment(arriveAt) : null
  }, [arriveAt])

  const disabledStartOfPeriodDate = React.useCallback((date) => {
    return date.isBefore(moment(), 'date') || (endOfPeriod ? date.isAfter(moment(endOfPeriod).subtract(1, 'day'), 'date') : false);
  }, [endOfPeriod]);

  const amount = React.useMemo(() => {
    switch (unit) {
      case 'days': {
        return (
          <OrderFieldNumber
            label={'Регулярность'}
            min={1}
            max={31}
            step={1}
            name={'amount'}
            disabled={disabledFields.includes('amount')}
            id={'regular-amount-number'}
          />
        )
      }
      case 'week': {
        return (
          <OrderFieldSelect
            name={'amount'}
            mode={'multiple'}
            optionLabelProp={'short'}
            list={{
              array: ORDER_REGULARITY_WEEK_DAYS,
              labelKey: 'label',
              valueKey: 'value'
            }}
            label={'Дни недели'}
            disabled={disabledFields.includes('amount')}
            id={'regular-amount-week'}
            opitonId={'regular-amount-week-item'}
          />
        )
      }
      case 'month': {
        return (
          <OrderFieldSelect
            name={'amount'}
            mode={'multiple'}
            list={{
              array: ORDER_REGULARITY_MONTH_DAYS,
              labelKey: 'label',
              valueKey: 'value'
            }}
            maxTagCount={8}
            label={'Числа месяца'}
            disabled={disabledFields.includes('amount')}
            idd={'regular-amount-month'}
            opitonId={'regular-amount-month'}
          />
        )
      }
      default: {
        return (
          <OrderFieldSelect
            name={'amount'}
            mode={'multiple'}
            optionLabelProp={'short'}
            list={{
              array: ORDER_REGULARITY_WEEK_DAYS,
              labelKey: 'label',
              valueKey: 'value'
            }}
            label={'Дни недели'}
            id={'regular-amount-weekdays'}
            opitonId={'regular-amount-weekdays-item'}
          />
        )
      }
    }
  }, [unit])

  return (
    <VzForm.Group title={'Настройка периодичности рейса'}>
      <VzForm.Row wrap={true}>
        <VzForm.Col span={6}>
          <OrderFieldText name={'title'} label={'Название шаблона'} disabled={disabledFields.includes('title')} />
        </VzForm.Col>
        <VzForm.Col span={6}>
          <OrderFieldDate name={'startOfPeriod'} label={'Начало периода'} disabledDate={disabledStartOfPeriodDate} disabled={disabledFields.includes('startOfPeriod')} />
        </VzForm.Col>
        <VzForm.Col span={6}>
          <OrderFieldDate name={'endOfPeriod'} label={'Конец периода'} disabledDate={disabledEndOfPeriodDate} disabled={disabledFields.includes('endOfPeriod')} />
        </VzForm.Col>
        <VzForm.Col span={6}>
          <OrderFieldTime name={'toStartAtTime'} label={'Время подачи'} disabled={disabledFields.includes('toStartAtTime')} />
        </VzForm.Col>
        <VzForm.Col span={6}>
          <OrderFieldSelect
            list={{
              array: ORDER_REGULARITY_OFFSETS,
              labelKey: 'label',
              valueKey: 'value'
            }}
            name={'offset'}
            label={'Создавать рейс в системе'}
            disabled={disabledFields.includes('offset')}
            id={'regular-offsets'}
            optionId={'regular-offset'}
          />
        </VzForm.Col>
        <VzForm.Col span={6}>
          <OrderFieldSelect
            name={'unit'}
            allowClear={false}
            list={{
              array: ORDER_REGULARITY_UNITS,
              labelKey: 'label',
              valueKey: 'value'
            }}
            label={'Период времени'}
            disabled={disabledFields.includes('unit')}
            id={'regular-units'}
            opitonId={'regular-unit'}
          />
        </VzForm.Col>
        <VzForm.Col span={12}>
          {amount}
        </VzForm.Col>
      </VzForm.Row>
      <VzForm.Row wrap={true}>
        {arriveAtDate &&
          <VzForm.Col span={6}>
            <VzForm.Item label={'Дата и время подачи следующего рейса'} >
              <Ant.DatePicker format={'DD.MM.YYYY HH:mm'} value={arriveAtDate} showTime={true} disabled={true} />
            </VzForm.Item>
          </VzForm.Col>
        }
      </VzForm.Row>
    </VzForm.Group>
  );
}

export default OrderRegularSettings;
