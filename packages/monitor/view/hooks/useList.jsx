import React from 'react';
import { useObserver } from 'mobx-react';
import * as Monitor from '../..';
import { sortOrdersBargain, sortOrdersExecution, sortOrdersPaperCheck, sortOrdersSelection } from '../utils';

export default function useList() {
  const { store } = React.useContext(Monitor.Context);

  return useObserver(() => {
    const orderSelectionList = store.getItemsFiltered('order', Monitor.Utils.filterOrderSelection, sortOrdersSelection);
    const orderExecutionList = store.getItemsFiltered('order', Monitor.Utils.filterOrderExecution, sortOrdersExecution);
    const orderPaperCheckList = store.getItemsFiltered(
      'order',
      Monitor.Utils.filterOrderPaperCheck,
      sortOrdersPaperCheck,
    );
    const orderBargainList = store.getItemsFiltered('order', Monitor.Utils.filterOrderBargain, sortOrdersBargain);

    const orderSelectionListPositions = orderSelectionList.filter(({ position }) => position);
    const orderExecutionListPositions = orderExecutionList.filter(({ position }) => position);
    const orderPaperCheckListPositions = orderPaperCheckList.filter(({ position }) => position);
    const orderBargainListPositions = orderBargainList.filter(({ position }) => position);

    return {
      orderBargainList,
      orderSelectionList,
      orderExecutionList,
      orderPaperCheckList,
      orderSelectionListPositions,
      orderExecutionListPositions,
      orderPaperCheckListPositions,
      orderBargainListPositions,
    };
  });
}
