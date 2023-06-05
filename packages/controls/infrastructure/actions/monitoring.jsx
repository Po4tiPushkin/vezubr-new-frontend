import { Orders as OrdersService } from '@vezubr/services';

const getMonitorings = () => {
  return async (dispatch) => {
    let payload;
    payload = await OrdersService.monitoring();
    return dispatch({ type: 'GET_MONITORING_SUCCESS', payload });
  };
};

const getProducerMonitoring = (userType) => {
  return async (dispatch) => {
    let payload;
    payload = await OrdersService.getMonitorings();
    return dispatch({ type: 'GET_PRODUCER_MONITORING_SUCCESS', payload, userType });
  };
};

const getOperatorMonitoring = (userType) => {
  return async (dispatch) => {
    let payload;
    payload = await OrdersService.getMonitorings();
    return dispatch({ type: 'GET_OPERATOR_MONITORING_SUCCESS', payload, userType });
  };
};

const getOperatorMonitoringMyProblems = (userType) => {
  return async (dispatch) => {
    let payload;
    payload = await OrdersService.getMonitoringMyProblems();
    return dispatch({ type: 'GET_OPERATOR_MONITORING_SUCCESS', payload, userType });
  };
};

const getOperatorMonitoringOperatorProblems = (userType) => {
  return async (dispatch) => {
    let payload;
    payload = await OrdersService.getMonitoringOperatorProblems();
    return dispatch({ type: 'GET_OPERATOR_MONITORING_SUCCESS', payload, userType });
  };
};

const getOperatorMonitoringUserProblems = (userType) => {
  return async (dispatch) => {
    let payload;
    payload = await OrdersService.getMonitoringUserProblems();
    return dispatch({ type: 'GET_OPERATOR_MONITORING_SUCCESS', payload, userType });
  };
};

export {
  getMonitorings,
  getProducerMonitoring,
  getOperatorMonitoring,
  getOperatorMonitoringMyProblems,
  getOperatorMonitoringOperatorProblems,
  getOperatorMonitoringUserProblems,
};
