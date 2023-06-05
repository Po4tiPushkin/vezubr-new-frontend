import React, { useMemo } from 'react';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import t from '@vezubr/common/localization';

function useColumns() {
  const columns = useMemo(
    () => [
      {
        title: t.common('indexNumber'),
        width: 100,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        renderToExport: false,
        render: (number, record, index) => <LinkWithBack to={{ pathname: `/addresses/${record.id}` }}>{number}</LinkWithBack>,
      },
      {
        title: 'Подтвержденный адрес',
        width: 300,
        dataIndex: 'addressString',
        key: 'addressString',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <LinkWithBack to={{ pathname: `/addresses/${record.id}` }}>{text}</LinkWithBack>,
      },
      {
        title: 'Название адреса',
        width: 200,
        dataIndex: 'title',
        key: 'title',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Отправитель/Получатель',
        width: 150,
        dataIndex: 'pointOwner',
        key: 'pointOwner',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text || record.pointOwnerInn}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Статус',
        width: 100,
        dataIndex: 'status',
        key: 'status',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>
            {text === true && 'Активный'}
            {text === false && 'Неактивный'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Тип адреса',
        width: 150,
        dataIndex: 'addressType',
        key: 'addressType',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{text && t.address(`addressTypes.${text}`)}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'ID адреса партнера',
        width: 150,
        dataIndex: 'externalId',
        key: 'externalId',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Адрес по API',
        width: 300,
        dataIndex: 'addressOriginal',
        key: 'addressOriginal',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Контактное лицо',
        width: 200,
        dataIndex: 'contacts',
        key: 'contacts',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{text && text.join(', ')}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Номер телефона',
        width: 150,
        dataIndex: 'phone',
        key: 'phone',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Рабочий номер телефона',
        width: 150,
        dataIndex: 'phone2',
        key: 'phone2',
        className: 'col-text-narrow',
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Добавочный номер',
        width: 150,
        dataIndex: 'extraPhone',
        key: 'extraPhone',
        className: 'col-text-narrow',
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Пропуск на въезд',
        width: 150,
        dataIndex: 'necessaryPass',
        key: 'necessaryPass',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>
            {text === true && 'Да'}
            {text === false && 'Нет'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Максимальная высота ТС, М',
        width: 200,
        dataIndex: 'maxHeightFromGroundInCm',
        key: 'maxHeightFromGroundInCm',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => {
          text = ~~text;
          if (text) {
            const result = (text / 100).toFixed(2);
            return (
              <VzTable.Cell.TextOverflow>
                {result}
              </VzTable.Cell.TextOverflow>
            )
          }
        },
      },
      {
        title: 'Подтвердил',
        width: 150,
        dataIndex: 'verifiedBy.fullName',
        key: 'verifiedBy',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Создал',
        width: 150,
        dataIndex: 'createdBy.fullName',
        key: 'createdBy',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: 'Дата создания',
        width: 150,
        dataIndex: 'createdAt',
        key: 'createdAt',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment(text).format('DD.MM.YYYY HH:mm')) || ''}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Максимальная грузоподъемность ТС, Кг',
        width: 200,
        dataIndex: 'liftingCapacityMax',
        key: 'liftingCapacityMax',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => {
          return (
            <VzTable.Cell.TextOverflow>
              {text}
            </VzTable.Cell.TextOverflow>
          )
        },
      },
    ],
    [],
  );

  return columns;
}

export default useColumns;
