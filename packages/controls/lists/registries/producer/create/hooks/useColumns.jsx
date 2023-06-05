import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import { LinkWithBack } from '@vezubr/components';
import * as Order from '@vezubr/order/form';
import moment from 'moment';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function useColumns(dictionaries, user) {
  return useMemo(
    () => [
      {
        title: '№ рейса',
        width: 75,
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        sorter: true,
        renderToExport: false,
        render: (number, record, index) => (
          <LinkWithBack to={{ pathname: `/orders/${record.orderId}/documents-order` }}>{number}</LinkWithBack>
        ),
      },
      {
        title: 'Тип',
        width: 75,
        dataIndex: 'orderType',
        key: 'order_type',
        className: 'col-icon',
        fixed: 'left',
        sorter: true,
        renderToExport: (text, record) => record.orderType == 2 ? 'ПРР' : dictionaries?.vehicleTypeCategories?.find(el => el.id == record.vehicleTypeCategory)?.title,
        render: (text, record, index) => Order.Icons.renderBitmapIconTruck(record.orderType, record.vehicleTypeCategory, record.problem),
      },
      {
        title: 'Номер рейса',
        dataIndex: 'orderNr',
        width: 200,
        key: 'order_nr',
        renderToExport: (orderNr) => orderNr,
        sorter: true,
        render: (id, record) => (
          <LinkWithBack to={{ pathname: `/orders/${record.orderId}/documents-order` }}>
            {id}
          </LinkWithBack>
        ),
      },
      {
        title: 'Номер заявки',
        dataIndex: 'requestNr',
        width: 200,
        key: 'request_nr',
        renderToExport: (requestNr) => requestNr,
        sorter: true,
        render: (value) => (
          <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Дата подачи',
        dataIndex: 'toStartDate',
        key: 'to_start_at',
        width: 150,
        sorter: true,
        render: (toStartDate) => 
        <VzTable.Cell.Content>{toStartDate && moment(toStartDate).format('DD.MM.YYYY') || ''}</VzTable.Cell.Content>,
      },
      {
        title: 'Заказчик',
        dataIndex: 'clientCompany',
        key: 'client_company',
        className: 'col-text-narrow',
        sorter: true,
        width: 200,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Подрядчик',
        dataIndex: 'producerCompany',
        className: 'col-text-narrow',
        key: 'producer_company',
        sorter: true,
        width: 200,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Номер договора',
        dataIndex: 'contractNumber',
        className: 'col-text-narrow',
        key: 'contract_number',
        sorter: true,
        width: 200,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Идентификатор договора',
        dataIndex: 'contractId',
        className: 'col-text-narrow',
        key: 'contract_id',
        width: 200,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Исполнитель',
        dataIndex: 'producerEmployeeName',
        key: 'producer_employee_name',
        className: 'col-text-narrow',
        sorter: true,
        width: 200,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Тип ТС',
        dataIndex: 'vehicleTypeName',
        key: 'vehicle_type_name',
        width: 100,
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Сумма заказчика (Без НДС)',
        dataIndex: 'orderSum',
        width: 180,
        className: 'col-currency col-text-right',
        key: 'order_sum',
        sorter: true,
        render: (text, record, index) => {
          const sum = parseInt(text, 10);
          return currencyFormat.format(sum / 100);
        },
      },
      ...[
        user?.costWithVat ?
        {
          title: 'Сумма заказчика (С НДС)',
          width: 200,
          key: 'costVatRate1',
          className: 'col-currency col-text-left',
          render: (text, record, index) => {
            const sum = parseInt(record.orderSum, 10) || 0;
            const vatRate = parseInt(record.costVatRate, 10) || 0;
            if (vatRate) {
              return <VzTable.Cell.Content>{currencyFormat.format( ( sum + sum * (vatRate / 100) ) / 100 )}</VzTable.Cell.Content>
            }
            return <VzTable.Cell.Content>{currencyFormat.format(sum / 100)}</VzTable.Cell.Content>
          },
        }
        :
        []
      ],
      {
        title: 'Сумма подрядчика (Без НДС)',
        dataIndex: 'orderSumProducer',
        key: 'orderSumProducer',
        className: 'col-currency col-text-right',
        width: 170,
        render: (text, record, index) => {
          if (!text) {
            return '-'
          }
          const sum = parseInt(text, 10);
          return currencyFormat.format(sum / 100);
        },
      },
      ...[
        user?.costWithVat ?
        {
          title: 'Сумма подрядчика (С НДС)',
          width: 200,
          key: 'costVatRate2',
          className: 'col-currency col-text-left',
          render: (text, record, index) => {
            if (!record.orderSumProducer) {
              return '-'
            };
            const sum = parseInt(record.orderSumProducer, 10) || 0;
            const vatRate = parseInt(record.costVatRate, 10) || 0;
            if (vatRate) {
              return <VzTable.Cell.Content>{currencyFormat.format( ( sum + sum * (vatRate / 100) ) / 100 )}</VzTable.Cell.Content>
            }
            return <VzTable.Cell.Content>{currencyFormat.format(sum / 100)}</VzTable.Cell.Content>
          },
        }
        :
        []
      ],
      {
        title: 'Завершен',
        dataIndex: 'executionFinishedAtDate',
        key: 'execution_finished_at',
        width: 150,
        sorter: true,
        render: (value) => 
        <VzTable.Cell.Content>{value && moment(value).format('DD.MM.YYYY HH:mm:ss') || ''}</VzTable.Cell.Content>,
      },
      {
        title: 'Подтвержден',
        dataIndex: 'calculationAcceptedAtDate',
        key: 'calculation_accepted_at',
        sorter: true,
        width: 150,
        render: (value) => 
        <VzTable.Cell.Content>{value && moment(value).format('DD.MM.YYYY HH:mm:ss') || ''}</VzTable.Cell.Content>,
      },

      {
        title: 'Гос номер ТС',
        dataIndex: 'plateNumber',
        key: 'plate_number',
        sorter: true,
        width: 150,
      },
      {
        title: 'Адрес подачи',
        dataIndex: 'firstAddress',
        key: 'first_address',
        className: 'col-text-narrow',
        sorter: true,
        width: 200,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Адрес доставки',
        dataIndex: 'lastAddress',
        key: 'last_address',
        className: 'col-text-narrow',
        sorter: true,
        width: 200,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Тип договора',
        dataIndex: 'contractType',
        key: 'contract_type',
        sorter: true,
        render: (contractType, record, index) => {
          return dictionaries?.contourContractContractTypes[contractType];
        },
      },
    ],
    [dictionaries?.contourContractContractTypes, dictionaries?.vehicleTypeCategories, dictionaries?.vehicleTypesList, user],
  );
}

export default useColumns;
