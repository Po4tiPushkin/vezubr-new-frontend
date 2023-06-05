import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements'
import * as Order from '../../../../';

function OrderContourTreeSelect(props) {
  const { groupTitle, isTariff = false, producers, ...otherProps } = props;

  const { store } = React.useContext(Order.Context.OrderContext);

  const { contourTreeData, calculation, contourTree } = store.data;
  const flattenData =  Order.Utils.getFlattenData(contourTreeData, contourTree, isTariff)

  const getPopupContainer = React.useCallback((parentNode) => {
    return parentNode.closest('.ant-modal-content') || document.body;
  }, []);

  if (producers) {
    flattenData[0].children.forEach(el => {
      const contourStatus = producers.find(item => el.id === item.id)?.contours[0]?.status;
      if (contourStatus === 1) {
        el.disabled = true;
      }
       
    })
  }
  const availableProducers = useMemo(() => {
    const producers = {
      total: 0,
      available: 0
    }
    if (Array.isArray(flattenData[0]?.children)) {
      producers.total = flattenData[0]?.children.length;
      producers.available = flattenData[0]?.children.filter(el => !el.disabled).length;
    }
    return producers;
  }, [flattenData])
  return (
    <Order.FormFields.TreeSelect
      label={`Подрядчики (для публикации доступно: ${availableProducers.available} из ${availableProducers.total})`}
      name={'contourTree'}
      className={`order-contour-tree-select`}
      dropdownStyle={{ maxHeight: 300 }}
      dropdownClassName={`order-contour-tree-select__dropdown`}
      treeDefaultExpandedKeys={[flattenData[0]?.key]}
      allowClear={true}
      multiple={true}
      treeIcon={false}
      treeCheckable={true}
      treeNodeFilterProp={'title'}
      autoClearSearchValue={false}
      searchPlaceholder={'Выберите подрядчиков'}
      {...otherProps}
      showSearch
      getPopupContainer={getPopupContainer}
      treeData={flattenData}
    />
  );
}

OrderContourTreeSelect.propTypes = {};

export default observer(OrderContourTreeSelect);
