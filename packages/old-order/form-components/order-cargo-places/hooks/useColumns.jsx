import moment from 'moment';
import { useContext } from 'react';
import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import { OrderCargoPlacesContext } from '../../../context';
import SelectAddress from '../components/select-address';
import t from '@vezubr/common/localization';
import SelectAddressGroup from '../components/select-address-group';

const numberFormat = new Intl.NumberFormat('ru-RU', { style: 'decimal' });

function useColumns() {
  const { fieldNameStore, fieldNameAddressIn, fieldNameAddressOut, cargoPlacesAdd, addressesIn, addressesOut, cargoPlacesClear} = useContext(
    OrderCargoPlacesContext,
  );

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        width: 75,
        dataIndex: 'id',
        key: 'id',
      },

      {
        title: 'Дата создания',
        dataIndex: 'createdAt',
        width: 100,
        key: 'createdAt',
        render: (createdAt) => (createdAt && moment(createdAt).format('DD.MM.YYYY')) || '-',
      },

      {
        title: 'Номер накладной',
        dataIndex: 'invoiceNumber',
        width: 100,
        key: 'invoiceNumber',
      },

      {
        title: 'Bar Code',
        dataIndex: 'barCode',
        width: 200,
        key: 'barCode',
      },

      {
        title: 'Адрес доставки',
        dataIndex: 'deliveryAddress.addressString',
        width: 200,
        key: 'deliveryAddress',
      },

      {
        title: 'Адрес отправки',
        dataIndex: 'departureAddress.addressString',
        width: 200,
        key: 'departureAddress',
      },

      {
        title: 'Вес, т.',
        dataIndex: 'weight',
        width: 100,
        key: 'weight',
        render: (weight) => weight && numberFormat.format(weight / 1000),
      },

      {
        title: 'Объем, м3',
        dataIndex: 'volume',
        width: 100,
        key: 'volume',
        render: (volume) => volume && numberFormat.format(volume / 1000000),
      },

      {
        title: 'Статус',
        dataIndex: 'status',
        width: 100,
        key: 'status',
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{(text && t.order(`cargoPlaceStatuses.${text}`)) || ''}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Адрес к статусу',
        dataIndex: 'statusAddress.addressString',
        width: 200,
        key: 'statusAddress',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'ID адреса доставки Партнёра',
        dataIndex: 'deliveryAddress.externalId',
        width: 200,
        key: 'externalId',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'ID Адреса доставки',
        dataIndex: 'deliveryAddress.id',
        width: 200,
        key: 'deliveryAddressId',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: (
          <SelectAddressGroup
            title={'Погрузка'}
            addresses={addressesIn}
            onChoose={(position) => cargoPlacesAdd(fieldNameAddressIn, position)}
            onClear={() => cargoPlacesClear(fieldNameAddressIn)}
          />
          ),
        dataIndex: 'id',
        width: 300,
        key: 'addressesIn',
        fixed: 'right',
        render: (id) => (
          <SelectAddress
            style={{ width: 168 }}
            addresses={addressesIn}
            placeholder={'Адрес погрузки'}
            id={id}
            fieldNameStore={fieldNameStore}
            fieldParamName={fieldNameAddressIn}
          />
        ),
      },

      {
        title: (
          <SelectAddressGroup
            title={'Разгрузка'}
            addresses={addressesOut}
            onChoose={(position) => cargoPlacesAdd(fieldNameAddressOut, position)}
            onClear={() => cargoPlacesClear(fieldNameAddressOut)}
          />
          ),
        dataIndex: 'id',
        width: 300,
        fixed: 'right',
        key: 'addressesOut',
        render: (id) => (
          <SelectAddress
            style={{ width: 168 }}
            addresses={addressesOut}
            placeholder={'Адрес разгрузки'}
            id={id}
            fieldNameStore={fieldNameStore}
            fieldParamName={fieldNameAddressOut}
          />
        ),
      },
    ],
    [addressesIn, addressesOut, fieldNameAddressOut, fieldNameStore, fieldNameAddressIn, cargoPlacesAdd, cargoPlacesClear],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
