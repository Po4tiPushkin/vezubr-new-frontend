import {
  CargoPlace,
  Orders as OrderService,
  Orders as OrdersService,
  Profile as ProfileService,
  Bargains as BargainsService,
} from '@vezubr/services';
import { Utils as OrderUtils } from '@vezubr/order'
import moment from 'moment';
import Utils from '@vezubr/common/common/utils';
const completedStatuses = { min: 400, max: 700 }
const selectionStates = [102, 201];


const getGeneralOrderData = async (orderId, user, dictionaries) => {
  // Общая инфа для всех ЛК
  const response = await OrderService.orderDetails(orderId);
  const order = { ...response, ...response.transportOrder, ...response.loadersOrder }
  let responseCargoPlace = [];
  if (order.type !== 2) {
    responseCargoPlace = await CargoPlace.orderView(orderId);
  }
  const responceParkingList = await OrdersService.getParkingPointsList(orderId);
  const employees = await Utils.fetchAllEmployees();
  if (order.performers?.length) {
    if (order.performers.length > 1) {
      order.producer = order.performers.find(el => el.client?.id === user?.id)?.producer
      order.client = order.performers.find(el => el.producer?.id === user?.id)?.client
    } else {
      order.producer = order.performers[0]?.producer;
      order.client = order.performers[0]?.client;
    }
    order.performers = Utils.handleCalculationDetails(order.performers, user?.id, dictionaries?.orderServices)
  }
  order.calculationProducer = order.performers && order.performers.filter((item) => {
    if (user.id === item.client.id) {
      return item;
    }
  })[0];
  order.calculationClient = order.performers && order.performers.filter((item) => {
    if (user.id === item.producer.id) {
      return item;
    }
  })[0];
  order.preliminaryCostClient = order.calculationClient?.preliminaryCalculation?.cost;
  order.preliminaryCostProducer = order.calculationProducer?.preliminaryCalculation?.cost;
  order.orderCostClient = {
    withoutVat: order.calculationClient?.finalCalculation?.cost,
    withVat: order.calculationClient?.finalCalculation?.costWithVat || null
  };
  order.orderCostProducer = {
    withoutVat: order.calculationProducer?.finalCalculation?.cost,
    withVat: order.calculationProducer?.finalCalculation?.costWithVat || null
  };
  order.finalCostOrder =
    (order.orderUiState?.state >= completedStatuses.min && order.orderUiState?.state < completedStatuses.max)
  order.linkedOrders = order.parentRelatedOrders.filter(el => el?.relationType === 'linked');
  order.groupedOrders = order.parentRelatedOrders.filter(el => el?.relationType === 'grouped');
  order.ownLinkedOrders = order.ownRelatedOrders.filter(el => el?.relationType === 'linked')
  order.ownGroupedOrders = order.ownRelatedOrders.filter(el => el?.relationType === 'grouped');
  // Получаем специфическую информацию для каждого ЛК
  const orderFinal = await getLkOrderData(order);
  return [orderFinal, responseCargoPlace, responceParkingList, employees]
}

const getLkOrderData = async (order) => {
  let calculation = null;

  let insurancePremium = null;

  if (order?.performers?.[0]?.isInsuranceRequired && order?.orderUiState?.state < 301) {
    if (APP !== 'client' || (APP === 'client' && order?.orderUiState?.state === 102)) {
      insurancePremium = await OrderUtils.getInsuranceAmount(order.id)
    }
  }

  if (APP !== 'client') {
    if (order?.strategyType === 'bargain') {
      order.bargainOfferMy = await BargainsService.self(order.id);
    }
    order.points = order.points.map((item) => {
      return {
        ...item,
        ...{ addressString: item.addressString },
      }
    })
    order.isPendingOrder = Utils.checkPendingStatus(order?.orderUiState?.state)
    calculation =
      order.finalCostOrder ? order?.calculationClient?.finalCalculation : order?.calculationClient?.preliminaryCalculation;

  }
  if (APP !== 'producer') {
    order.problem = order.problems.find(el => el.type === 2 && el.status === 1) || order.problems.find(el => el.status === 1)
  }
  if (APP === 'client') {
    order.isPendingOrder = order?.orderUiState?.state < 400 && !order.points[order.points.length - 1]?.completedAt;
    calculation =
      order.finalCostOrder ? order?.calculationProducer?.finalCalculation : order?.calculationProducer?.preliminaryCalculation;
    order.calculationClient = order.calculationProducer;
  }
  if (APP === 'producer' && order?.orderUiState?.state < 301) {
    if (order?.calculationClient?.isInsuranceRequired) {
      order.calculationClient.orderInsurance = {
        ...order.calculationClient.orderInsurance,
        insurancePremium: insurancePremium
      }
    }

  }
  if (APP === 'dispatcher') {
    const costClient = order.finalCostOrder ? order.calculationClient?.finalCalculation?.cost : order.calculationClient?.preliminaryCalculation?.cost
    const costProducer = order.finalCostOrder ? order.calculationProducer?.finalCalculation?.cost : order.calculationProducer?.preliminaryCalculation?.cost


    if (costClient && costProducer) {
      order.marginInPercent = `${(((costClient - costProducer - (insurancePremium ? insurancePremium : 0)) / costClient) * 100).toFixed(2)}%`;
      order.marginInRouble = `${((costClient - costProducer - (insurancePremium ? insurancePremium : 0)) / 100).toFixed(2)} руб.`;
    }

    if (order?.performers?.[0]?.isInsuranceRequired && order?.orderUiState?.state < 301) {
      order.performers[0].orderInsurance = {
        ...order.performers[0].orderInsurance,
        insurancePremium: insurancePremium
      }
    }
    if (order?.type == 2 && order?.vehicle?.driver) {
      order.loaders = [order?.vehicle?.driver, order?.vehicle?.driver]
    }
  }
  order.orderCost = {
    withoutVat: calculation?.cost,
    withVat: calculation?.costWithVat || null,
  };
  order.orderVatRate = calculation?.costVatRate;
  return order;
}

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

const getMenuOptionsLK = (data = {}) => {
  const { order = {}, user, bargainOfferMy, dictionaries } = data;

  const { bargainStatus } = order;
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


    if (order?.orderUiState?.state >= 301 || order.bargainStatus || !order?.accessEditing || (order?.type == 2 && order?.orderUiState?.state >= 201)) {
      delete menuOptionsFiltered.editOrder;
    }
  }

  const isBargain = order?.strategyType === 'bargain';
  const isBargainMyAccepted = bargainOfferMy?.offer?.status === 'accepted';

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

export {
  getGeneralOrderData,
  getMenuOptionsLK
}