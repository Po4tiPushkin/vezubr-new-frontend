import { BARGAIN_SELECTED_STRATEGY } from '@vezubr/bargain';
import moment from 'moment';
import {
  MONITOR_ORDER_STATES_EXECUTION,
  MONITOR_ORDER_STATES_PAPER_CHECK,
  MONITOR_ORDER_STATES_SELECTION,
  MONITOR_ORDER_STATES_SELECTION_END,
  MONITOR_ORDER_STATES_SELECTION_START,
} from '../constants';

export const filterOrderEmpty = (order) => true;
export const filterOrderBargain = (order) =>
  MONITOR_ORDER_STATES_SELECTION.includes(order.uiState?.state) && (order.strategyType === 'bargain' || order.republishStrategyType === 'bargain');

export const filterOrderSelectionEnding = (order) =>
  MONITOR_ORDER_STATES_SELECTION_END.includes(order.uiState?.state) && filterOrderRateOrTariff(order);
export const filterOrderSelectionStart = (order) =>
  MONITOR_ORDER_STATES_SELECTION_START.includes(order.uiState?.state) && filterOrderRateOrTariff(order);

export const filterOrderSelection = (order) =>
  MONITOR_ORDER_STATES_SELECTION.includes(order.uiState?.state) && filterOrderRateOrTariff(order);

const filterOrderRateOrTariff = (order) =>
  (["rate", "tariff"].includes(order.strategyType) || ["rate", "tariff"].includes(order.republishStrategyType))

export const filterOrderExecution = (order) => MONITOR_ORDER_STATES_EXECUTION.includes(order.uiState?.state);

export const filterOrderPaperCheck = (order) => MONITOR_ORDER_STATES_PAPER_CHECK.includes(order.uiState?.state);

export const filterVehicleFree = (vehicle) => vehicle.lastGpsLatitude && vehicle.lastGpsLongitude;

export const filterDates = () => {
  return {
    "toStartAtDateFrom": 
    localStorage.getItem('toStartAtDateFromMonitor')
    ? 
      localStorage.getItem('toStartAtDateFromMonitor') === 'null' 
      ?
        null
      :
        moment(localStorage.getItem('toStartAtDateFromMonitor')).format('YYYY-MM-DD') + ' 00:00:00' 
    : 
    moment().startOf('day').format("YYYY-MM-DD") + ' 00:00:00',

    "toStartAtDateTill":  
    localStorage.getItem('toStartAtDateTillMonitor') 
    ?
      localStorage.getItem('toStartAtDateTillMonitor') === 'null'
      ?
        null
      :
        moment(localStorage.getItem('toStartAtDateTillMonitor')).format('YYYY-MM-DD') + ' 23:59:59'
    :
    moment().add(1, 'day').endOf('day').format("YYYY-MM-DD") + ' 23:59:59'
  }
}