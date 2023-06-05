import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import * as Order from '../../../..';
import PropTypes from "prop-types"
import { Ant } from '@vezubr/elements';
import { Utils } from '@vezubr/common/common';
function OrderContourTreeSelect(props) {
  const { groupTitle, user, inn, republishing, isTariff = false, producers, ...otherProps } = props;

  const { store } = React.useContext(Order.Context.OrderContext);

  const { contourTreeData, calculation, contourTree, regular } = store.data;
  let newCityTreeData;
  if (!republishing && inn && !isTariff) {
    newCityTreeData = contourTreeData?.filter(item => item.contourId === (user?.contours?.find(item => item.priority === 0)?.id))?.map(el => { el.children = []; return el })
  }
  else
    if (!republishing && inn && isTariff) {
      newCityTreeData = contourTreeData?.filter(item => item.contourId === (user?.contours?.find(item => item.priority === 0)?.id))?.map(item => {
        item.disabled = true;
        item.children = calculation?.value?.map((el, index) => {
          let costFinal = el.cost;
          if (user?.costWithVat && el.costVatRate) {
            costFinal = costFinal + (costFinal * (el.costVatRate / 100))
          }
          return {
            id: user?.id,
            key: `${user?.id}:${index}`,
            value: `${user?.id}:${el.tariff.id}:${el.appoints[0].contractId}`,
            inn: inn,
            disabled: !!contourTree.find(item => +item.split(':')[0] === user?.id && item !== `${user?.id}:${el.tariff.id}:${el.appoints[0].contractId}`),
            title: item.title + ": " + Utils.moneyFormat(costFinal),
            cost: costFinal,
            tariff: el.tariff.id,
          }
        })
        return item;
      });
    };

  const flattenData = Order.Utils.getFlattenData(contourTreeData, contourTree, isTariff);

  if (republishing && producers) {
    flattenData[0].children.forEach(el => {
      const contourStatus = producers.find(item => el.id === item.id)?.contours[0]?.status;
      if (contourStatus === 1) {
        el.disabled = true;
      }
    })
  }


  React.useEffect(() => {
    if (!republishing) {
      if (isTariff) {
        if (newCityTreeData[0]?.children[0]?.value) {
          store.setDataItem('contourTree', [newCityTreeData[0]?.children[0]?.value])
        }
      } else {
        store.setDataItem('contourTree', [`contour:${user?.contours?.find(item => item.priority == 0)?.id}`])
      }
    }
  }, [isTariff])

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
      label={
        `Подрядчики${regular ? ' ГВ' : ''} 
        ${availableProducers?.total && republishing ?
          ` (для публикации доступно: ${availableProducers.available} из ${availableProducers.total})`
          : ''}`
      }
      name={'contourTree'}
      className={`order-contour-tree-select`}
      dropdownStyle={{ maxHeight: 300 }}
      dropdownClassName={`order-contour-tree-select__dropdown`}
      treeDefaultExpandAll={!republishing}
      treeDefaultExpandedKeys={republishing ? [flattenData[0]?.key] : null}
      allowClear={true}
      treeNodeFilterProp={'title'}
      searchPlaceholder={'Выберите подрядчиков'}
      treeCheckable={true}
      autoClearSearchValue={false}
      {...otherProps}
      showSearch
      getPopupContainer={getPopupContainer}
      treeData={republishing ? flattenData : newCityTreeData ? newCityTreeData : contourTreeData}
    />
  );
}

OrderContourTreeSelect.propTypes = {
  republishing: PropTypes.bool
};

export default observer(OrderContourTreeSelect);
