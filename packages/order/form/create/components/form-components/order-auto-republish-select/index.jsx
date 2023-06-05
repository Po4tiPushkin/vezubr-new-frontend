import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import * as Order from '../../../..';
import PropTypes from "prop-types"
import { Ant } from '@vezubr/elements';
import { Utils } from '@vezubr/common/common';
function OrderAutoRepublishSelect(props) {
  const { user, inn, isTariff = false, ...otherProps } = props;

  const { store } = React.useContext(Order.Context.OrderContext);

  const { autoRepublishContourTreeData, calculation, autoRepublishContourTree } = store.data;

  const flattenData = Order.Utils.getFlattenData(autoRepublishContourTreeData, autoRepublishContourTree, isTariff);

  const getPopupContainer = React.useCallback((parentNode) => {
    return parentNode.closest('.ant-modal-content') || document.body;
  }, []);

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
      name={'autoRepublishContourTree'}
      className={`order-contour-tree-select`}
      dropdownStyle={{ maxHeight: 300 }}
      dropdownClassName={`order-contour-tree-select__dropdown`}
      treeDefaultExpandAll={false}
      treeDefaultExpandedKeys={[flattenData[0]?.key]}
      allowClear={true}
      treeNodeFilterProp={'title'}
      searchPlaceholder={'Выберите подрядчиков'}
      treeCheckable={true}
      {...otherProps}
      showSearch
      getPopupContainer={getPopupContainer}
      treeData={flattenData || autoRepublishContourTreeData}
    />
  );
}

OrderAutoRepublishSelect.propTypes = {
  republishing: PropTypes.bool
};

export default observer(OrderAutoRepublishSelect);
