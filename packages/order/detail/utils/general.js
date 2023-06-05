import {
  CargoPlace,
  Orders as OrderService,
  Orders as OrdersService,
  Profile as ProfileService,
  Bargains as BargainsService,
} from '@vezubr/services';
import { Utils as OrderUtils } from '../../form'
import Utils from '@vezubr/common/common/utils';
import { fileGetFileData } from "@vezubr/common/utils";

const completedStatuses = { min: 400, max: 700 }

export const getGeneralOrderData = async (orderId, user, dictionaries) => {
  // Общая инфа для всех ЛК
  const response = await OrderService.orderDetails(orderId);
  const order = { ...response, ...response.transportOrder, ...response.loadersOrder }
  let responseCargoPlace = [];
  if (order.type !== 2) {
    responseCargoPlace = await CargoPlace.orderView(orderId);
  }
  order.cargoPlaceData = responseCargoPlace;
  const responceParkingList = await OrdersService.getParkingPointsList(orderId);
  order.parkingPoints = responceParkingList;
  const employees = await ProfileService.contractorUsers();
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
  if (Array.isArray(order?.points) && order.points.find(el => Array.isArray(el?.attachedFiles) && el.attachedFiles.length)) {
    order.points.forEach(el => {
      el.attachedFiles = el.attachedFiles.map(item => fileGetFileData(item));
    })
  }
  // Получаем специфическую информацию для каждого ЛК
  const orderFinal = await getLkOrderData(order);
  return [orderFinal, employees?.items]
}

const getLkOrderData = async (order) => {
  let calculation = null;

  let insurancePremium = null;

  if (order?.performers?.[0]?.isInsuranceRequired && order?.orderUiState?.state < 301) {
    if (APP !== 'client') {
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


    if (order?.performers?.[0]?.isInsuranceRequired && order?.orderUiState?.state < 301) {
      order.performers[0].orderInsurance = {
        ...order.performers[0].orderInsurance,
        insurancePremium: insurancePremium
      }
    }
    if (order?.type == 2 && order?.vehicle?.driver) {
      order.loaders = [order?.vehicle?.driver, order?.vehicle?.driver]
    }
    if (costClient && costProducer) {
      order.marginInPercent = `${(((costClient - costProducer) / (costClient + (order.calculationClient?.orderInsurance?.insurancePremium ? order.calculationClient?.orderInsurance?.insurancePremium : 0))) * 100).toFixed(2)}%`;
      order.marginInRouble = `${((costClient - costProducer) / 100).toFixed(2)} руб.`;
    }

  }
  order.orderCost = {
    withoutVat: calculation?.cost,
    withVat: calculation?.costWithVat || null,
  };
  order.orderVatRate = calculation?.costVatRate;
  return order;
}

export const getActiveKey = (location) => {
  const activeKey = ['general', 'address', 'parameters'];
  if (location?.search && Utils.queryString(location?.search)?.goTo) {
    activeKey.push(location?.search && Utils.queryString(location?.search)?.goTo)
  }
  return activeKey
}