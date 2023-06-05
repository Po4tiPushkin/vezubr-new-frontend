import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { TreeSelect } from '@vezubr/elements/antd';
import { ORDER_CATEGORIES_GROUPPED } from '@vezubr/common/constants/constants';
function useFiltersActions({
  dictionaries,
}) {
  const treeStageData = useMemo(() => {
    const treeData = [];
    dictionaries.orderUiStage.filter(val => ![80, 99].includes(val.id)).forEach(el => {
      const currentStage = dictionaries.orderStageToStateMap[el.id];
      const children = currentStage.map(item => ({
        title: dictionaries.orderUiState.find(val => val.id === item)?.title ||
          (APP === 'client'
            ?
            dictionaries.performerUiStateForClient.find(val => val.id === item)?.title
            :
            APP === 'producer'
              ?
              dictionaries.performerUiStateForProducer.find(val => val.id === item)?.title
              :
              dictionaries.performerUiStateForProducer.find(val => val.id === item)?.title ||
              dictionaries.performerUiStateForClient.find(val => val.id === item)?.title)
        ,
        value: item,
        key: item,
      }))
      treeData.push({
        title: el.title,
        value: el.id,
        key: el.id,
        children: children.filter(child => child.title),
      })
    });
    if (APP === 'dispatcher') {
      const newData = [
        {
          title: 'Статус в паре (Заказчик)',
          value: 31,
          key: 31,
          children: dictionaries.performerUiStateForClient.map(el => ({
            title: el.title,
            value: `31-${el.id}`,
            key: `31-${el.id}`,
          }))
        },
        {
          title: 'Статус в паре (Подрядчик)',
          value: 32,
          key: 32,
          children: dictionaries.performerUiStateForProducer.map(el => ({
            title: el.title,
            value: `32-${el.id}`,
            key: `32-${el.id}`,
          }))
        },
      ]
      return treeData.map(el => {
        if (el.value === 30) {
          el.children = newData;
        };
        return el;
      })
    }
    return treeData;
  }, [dictionaries])

  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['toStartAtDateFrom', 'toStartAtDateTill'],
        type: 'dateRange',
        position: 'topLeft',
      },

      {
        key: 'orderNr',
        type: 'input',
        label: t.order('filters.orderId.placeholder'),
        config: {
          fieldProps: {
            placeholder: t.order('filters.orderId.placeholder'),
            style: {
              width: 140,
            },
          },
        },
      },

      {
        key: 'orderId',
        type: 'input',
        label: 'ID',
        config: {
          fieldProps: {
            placeholder: 'ID',
            style: {
              width: 140,
            },
          },
        },
      },

      {
        key: 'requestNr',
        type: 'input',
        label: 'Номер заявки',
        config: {
          fieldProps: {
            placeholder: 'Номер заявки',
            style: {
              width: 140,
            },
          },
        },
      },

      {
        key: 'orderUiStates',
        type: 'selectTree',
        label: 'Стадии рейса',
        config: {
          label: 'Стадии рейса',
          fieldProps: {
            placeholder: 'Стадии рейса',
            allowClear: true,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            maxTagCount: 0,
            showCheckedStrategy: TreeSelect.SHOW_CHILD,
            searchPlaceholder: 'Выберите статус',
            dropdownStyle: {
              maxHeight: 300,
            },
            style: {
              width: 100,
            },
          },
          data: treeStageData,
        },
      },
    ],
    [treeStageData, dictionaries?.vehicleBodies, dictionaries?.orderTypes],
  );
}

export default useFiltersActions;
