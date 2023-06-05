import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
const useFields = ({ tableName, dictionaries, other }) => {
  const fields = useMemo(() => {
    switch (tableName) {
      case 'addresses':
        return [
          {
            value: 'status',
            title: 'Статус',
            type: 'select',
            id: 0,
            values: [
              {
                value: 0,
                listValue: false,
                id: 0,
                title: 'Неактивный'
              },
              {
                value: 1,
                listValue: true,
                id: 1,
                title: 'Активный'
              },
            ]
          },
          {
            value: 'statusFlowType',
            title: 'Настройка Статусов адреса в МП',
            type: 'select',
            id: 1,
            values: dictionaries?.contractorPointFlowTypes.map((el, index) => {
              return {
                value: el.id,
                listValue: el.id,
                id: index,
                title: el.title
              }
            })
            // values: [
            //   {
            //     value: 'fullFlow',
            //     id: 0,
            //     title: 'fullFlow'
            //   },
            //   {
            //     value: 'shortFlow',
            //     id: 1,
            //     title: 'shortFlow'
            //   },
            // ]
          },
        ]
      case 'cargoPlaces': 
      if (!other?.addresses?.addressList) {
        return []
      }
      return [
        {
          value: 'status',
          title: 'Статус',
          type: 'select',
          id: 0,
          values: dictionaries.cargoPlaceStatuses.map((el, index) => {
            return {
              value: el.id,
              listValue: el.id,
              id: index,
              title: t.order(`cargoPlaceStatuses.${el.id}`)
            }
          })
        },       
        {
          title: 'Адрес к статусу',
          value: 'statusPointId',
          id: 1,
          type: 'select',
          values: other.addresses.addressList.map((el, index) => {
            return {
              title: (el?.addressString && `${el.id} / ${el?.addressString}`) || el.id,
              value: el.id,
              id: index,
              listValue: el.id,
            }
          })
        },
        {
          title: 'Адрес отправления',
          value: 'departurePointId',
          id: 2,
          type: 'select',
          values: other.addresses.addressList.map((el, index) => {
            return {
              title: (el?.addressString && `${el.id} / ${el?.addressString}`) || el.id,
              value: el.id,
              id: index,
              listValue: el.id,
            }
          })
        },
        {
          title: 'Адрес доставки',
          value: 'deliveryPointId',
          id: 3,
          type: 'select',
          values: other.addresses.addressList.map((el, index) => {
            return {
              title: (el?.addressString && `${el.id} / ${el?.addressString}`) || el.id,
              value: el.id,
              id: index,
              listValue: el.id,
            }
          })
        },
        {
          title: 'Баркод родительского ГМ',
          value: 'parentBarCode',
          id: 4,
          type: 'input',
        },
      ]
      default:
        return []
    }
  }, [tableName, dictionaries, other])
  return fields
}

export default useFields;