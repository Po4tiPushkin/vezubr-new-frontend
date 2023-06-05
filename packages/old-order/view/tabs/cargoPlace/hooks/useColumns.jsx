import LinkWithBack from '@vezubr/components/link/linkWithBack';
import React, { useMemo } from 'react';
import { Ant, VzTable } from '@vezubr/elements';
import FieldUpdater from '../FieldUpdater';
import SelectTemplate from '../SelectTemplate';
import { getOptionsForSelect } from '../utils';

function formattedNumber(number) {
  return new Intl.NumberFormat('ru-RU').format(number);
}

export default function useColumns(dataCargoPlace) {
  const columns = useMemo(() => [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      renderToExport: (id, record, index) => id,
      render: (id, record, index) => {
        if (APP !== 'producer') {
          return <LinkWithBack to={{ pathname: `/cargoPlaces/${id}` }}>{id}</LinkWithBack>
        } else {
          return <VzTable.Cell.TextOverflow>{id}</VzTable.Cell.TextOverflow>
        }
      }
    },
    {
      title: (text, record, index) => {
        return (
          <FieldUpdater>
            {
              ({updateAllFields}) =>
                <SelectTemplate>
                  {(optionsList) => {
                    return (
                      <Ant.Select
                        showSearch={true}
                        onChange={(e) => updateAllFields('status', e)}
                        defaultValue={'Статус'}
                        key={`status-${text || index}`}
                        style={{ width: '200px'}}
                        size={'small'}
                      >
                        {getOptionsForSelect(optionsList, 'status')}
                      </Ant.Select>
                    )
                  }}
                </SelectTemplate>
            }
          </FieldUpdater>
        )
      },
      dataIndex: 'status',
      key: 'status',
      width: 220,
      render: (text, record, index) => {
        return (
          <FieldUpdater>
            {
              ({fieldUpdate}) =>
                <SelectTemplate>
                  {(optionsList) => {
                    return (
                      <Ant.Select
                        showSearch={true}
                        onChange={(e) => fieldUpdate(record.id, 'status', e)}
                        value={text}
                        key={`status-${text || record.id}`}
                        style={{ width: '200px'}}
                        size={'small'}
                      >
                        {getOptionsForSelect(optionsList, 'status')}
                      </Ant.Select>
                    )
                  }}
                </SelectTemplate>
            }
          </FieldUpdater>
        )
      },
    },
    {
      title: (text, record, index) => {
        return (
          <FieldUpdater>
            {
              ({updateAllFields}) =>
                <SelectTemplate>
                  {(optionsList) => {
                    return (
                      <Ant.Select
                        showSearch={true}
                        onChange={(e, { props }) => updateAllFields('statusAddress', e, props['data-address-string'])}
                        defaultValue={'Адрес к статусу'}
                        key={`status-${text || index}`}
                        optionFilterProp={'children'}
                        style={{ width: '350px'}}
                        size={'small'}
                      >
                        {getOptionsForSelect(optionsList, 'statusAddress')}
                      </Ant.Select>
                    )
                  }}
                </SelectTemplate>
            }
          </FieldUpdater>
        )
      },
      width: 370,
      dataIndex: 'statusAddress',
      key: 'statusAddress',
      className: 'col-text-narrow',
      render: (text, record, index) => {
        return (
          <FieldUpdater>
            {
              ({fieldUpdate}) =>
                <SelectTemplate>
                  {(optionsList) => {
                    return (
                      <Ant.Select
                        showSearch={true}
                        onChange={(e, { props }) => fieldUpdate(record.id, 'statusAddress', e, props['data-address-string'])}
                        value={text?.id}
                        key={`status-${text || index}`}
                        style={{ width: '350px'}}
                        optionFilterProp={'children'}
                        size={'small'}
                      >
                        {getOptionsForSelect(optionsList, 'statusAddress')}
                      </Ant.Select>
                    )
                  }}
                </SelectTemplate>
            }
          </FieldUpdater>
        )
      },
    },
    {
      title: 'Bar code',
      dataIndex: 'barCode',
      key: 'barCode',
      width: 200,
    },
    {
      title: 'Номер пломбы',
      dataIndex: 'sealNumber',
      key: 'sealNumber',
      width: 150,
    },
    {
      title: 'Адрес отправления',
      dataIndex: 'departureAddress',
      key: 'departureAddress',
      width: 350,
    },
    {
      title: 'Адрес доставки',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 350,
    },
    {
      title: 'Вес, кг',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
      render: (weight, record, index) => {
        if (typeof weight === 'number') {
          return formattedNumber((weight / 1000).toFixed(2));
        }
        return weight;
      },
    },
    {
      title: 'Объем, м3',
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      render: (volume, record, index) => {
        if (typeof volume === 'number') {
          return formattedNumber((volume / 1000000).toFixed(2));
        }
        return volume;
      },
    },
  ], [dataCargoPlace]);

  return VzTable.useColumnsCalcWidth(columns);
}