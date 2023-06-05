import moment from 'moment';
const menuOptionsList = {
  startOrder: {
    disabled: false
  },
  cancelOrder: {
    disabled: false
  },
  getContractReport: {
    disabled: false
  },
  replaceTransportAndDriver: {
    disabled: false
  },
  executionCancel: {
    disabled: false
  },
  finishOrder: {
    disabled: false
  },
  editOrder: {
    disabled: false
  },
  cloneOrder: {
    disabled: false
  },
  groupOrder: {
    disabled: false
  },
  linkOrder: {
    disabled: false
  },
  createBindLoader: {
    disabled: false,
  }
}

const selectionStates = [102, 201];

export const getMenuOptionsLK = ({ order = {}, user, dictionaries }) => {
  const menuOptionsFiltered = _.cloneDeep(menuOptionsList);
  if (APP !== 'client') {
    if (order?.orderUiState?.state === 201) {
      menuOptionsFiltered.startOrder.disabled = false;
    } else {
      menuOptionsFiltered.startOrder.disabled = true;
    }
    if (order?.isPendingOrder) {
      delete menuOptionsFiltered.replaceTransportAndDriver
    }

    if (APP === 'dispatcher') {
      if (order?.orderUiState?.state !== 201 || !order?.producerDelegateManagement || (order?.producer?.id == user?.id)) {
        if (!(order?.performers?.length === 1 && order?.orderUiState?.state === 201)) {
          delete menuOptionsFiltered.executionCancel
        }
      }
    }
    else if (order?.orderUiState?.state !== 201) {
      delete menuOptionsFiltered.executionCancel
    }

    if (order?.orderUiState?.state !== 310) {
      delete menuOptionsFiltered.finishOrder
    }

    if (order?.problems?.some((problem) => problem.status === 1 && problem.type === 2)) {
      menuOptionsFiltered.replaceTransportAndDriver.disabled = true;
    }

    if (moment(order?.startAtLocal).isBefore(moment())) {
      delete menuOptionsFiltered.executionCancel;
    }

  }



  if (APP !== 'producer') {
    if ((selectionStates?.indexOf(order?.orderUiState?.state) < 0 || !order?.accessEditing)) {
      delete menuOptionsFiltered.cancelOrder;
    }


    if (order?.orderUiState?.state >= 301 ||
      order.bargainStatus ||
      !order?.accessEditing ||
      (order?.type == 2 && order?.orderUiState?.state >= 201) ||
      order?.strategyType === 'bargain'
    ) {
      delete menuOptionsFiltered.editOrder;
    }
  }

  if (
    [
      ...dictionaries.orderStageToStateMap[30],
      ...dictionaries.orderStageToStateMap[40],
      ...dictionaries.orderStageToStateMap[80],
      ...dictionaries.orderStageToStateMap[99],
    ].indexOf(order?.orderUiState?.state) > -1
  ) {
    Object.entries(menuOptionsFiltered).forEach(([key, value]) => (menuOptionsFiltered[`${key}`].disabled = true));
    menuOptionsFiltered.getContractReport.disabled = false;
    menuOptionsFiltered.cloneOrder.disabled = false;
    menuOptionsFiltered.groupOrder.disabled = false;
    menuOptionsFiltered.linkOrder.disabled = false;
  }

  if (order?.orderUiState?.state !== 102) {
    delete menuOptionsFiltered.getContractReport;
  }

  return menuOptionsFiltered;
}
