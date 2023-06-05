import React, { useMemo } from 'react';

const filteredAddresses = (addressList, order, field) => {
  const points = Object.values(order.points);
  return addressList.filter((item) => {
    for (let i = 0; i < points.length; i++) {
      if (item.id === points[i].id && points[i][field] === true) {
        return item;
      }
    }
  });
}

function useFiltersActions(cargoPlaceData, addressList, order) {
  return useMemo(
    () => [
      {
        key: 'departureAddressId',
        type: 'select',
        label: 'Адрес отправления',
        config: {
          fieldProps: {
            placeholder: 'Адрес отправления',
            allowClear: true,
            showSearch: true,
            optionFilterProp: 'children',
            style: {
              width: 370,
            },
          },
          data: filteredAddresses(addressList, order, 'isLoadingWork').map(({id, addressString}) => {
            return {
              value: id,
              label: `${id} / ${addressString}`,
            }
          }),
        },
      },
      {
        key: 'deliveryAddressId',
        type: 'select',
        label: 'Адрес доставки',
        config: {
          fieldProps: {
            placeholder: 'Адрес доставки',
            allowClear: true,
            showSearch: true,
            optionFilterProp: 'children',
            style: {
              width: 370,
            },
          },
          data: filteredAddresses(addressList, order, 'isUnloadingWork').map(({id, addressString}) => {
            return {
              value: id,
              label: `${id} / ${addressString}`,
            }
          }),
        },
      },
    ],
    [cargoPlaceData],
  );
}

export default useFiltersActions;