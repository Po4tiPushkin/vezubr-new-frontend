const clientHost = window.API_CONFIGS['client'].host;

const API_PATHS = {
  common: {
    dictionaries: `${clientHost}v1/dictionaries`,
    glossary: 'api/dictionaries',
    startupData: 'common/startup-data',
    uploadFile: 'file/upload',
    managers: 'manager/get-list',
    counterPartiesList: (role) => `/api/contractor/${role}/list`,
  },
  register: {
    requestCode: 'api/contractor/registration/phone/request-code',
    confirmCode: 'api/contractor/registration/phone/confirm',
    completeRegistration: 'api/contractor/registration',
    checkInn: 'api/contractor/check-inn',
  },
  user: {
    login: 'api/user/login',
    forgotPasswordRequest: 'api/user/forgot-password/request',
    forgotPasswordChange: 'api/user/forgot-password/change',
    getByCode: (code) => `api/contour/get-by-code/${code}`,
  },
  address: {
    list: 'api/contractor-point/list-info',
    info: (id) => `api/contractor-point/${id}/info`,
    contacts: (id) => `api/contractor-point/${id}/contacts`,
    openingHours: (id) => `api/contractor-point/${id}/opening-hours`,
    update: 'api/contractor-point/update',
    delete: (id) => `api/contractor-point/${id}/delete`,
    regionsList: `api/contractor-point/region-list`,
    journalList: `api/contractor-point/journal-list`,
  },
  cargoPlace: {
    list: 'api/cargo-place/list',
    listForOrder: 'api/cargo-place/list-for-create-order',
    orderView: (id) => `api/cargo-place/transport-order/${id}/list`,
    info: (id) => `api/cargo-place/${id}/info`,
    cargoIncluded: (id) => `api/cargo-place/${id}/included`,
    cargoDispatch: (id) => `api/cargo-place/${id}/dispatch-list`,
    update: `api/cargo-place/update`,
    deleteCargoCard: (id) => `api/cargo-place/${id}/delete`,
    groupUpdate: `api/cargo-place/group-update`,
    journalList: `api/cargo-place/journal-list`,
    planning: 'api/cargo-place/order/planning',
  },
  profile: {
    contractor: 'api/contractor/profile',
    contractorUser: (id) => `api/contractor/employees/${id}`,
    contractorDeleteUser: 'api/contractor/employees/delete',
    contractorUsers: 'api/contractor/employees',
    saveMain: 'api/contractor/profile-main',
    saveAdditional: 'api/contractor/profile-additional',
  },
  agent: {
    list: 'https://client.vezubr.dev/v1/agent/list',
    contractor: 'api/contractor/profile',
  },
  orders: {
    monitoring: 'monitoring/orders',
    monitoringBargains: 'api/monitoring/bargains',
    monitoringDocuments: 'api/monitoring/documents-check',
    monitoringExecuting: 'api/monitoring/executing',
    monitoringSelecting: 'api/monitoring/selecting',
    filteredList: 'api/order/list',
    calculate: 'transport-request/calculate',
    calculateLoaders: 'loaders-request/calculate',
    createAndPublish: 'transport-request/create-and-publish',
    createDeferre: 'transport-request/create-deferred',
    getTransportOrderEditingData: 'transport-request/edit',
    getLoaderOrderEditingData: 'loaders-request/edit',
    editTransportOrder: 'transport-request/update',
    editTransportOrderActive: (orderId) => `api/order/${orderId}/active/update`,
    editLoadersOrder: 'loaders-request/update',
    loadersCreate: 'loaders-request/create-and-publish',
    loadersCreatedDeferred: 'loaders-request/create-deferred',
    transportCreateDeferred: 'transport-request/create-deferred',
    orderDetails: (orderId) => `orders/${orderId}/details`,
    removeOrder: (orderId) => `orders/${orderId}`,
    rejectOrderCalculation: (orderId, calculationId) => `order/${orderId}/calculation/${calculationId}/reject`,
    approveOrderCalculation: (orderId, calculationId) => `order/${orderId}/calculation/${calculationId}/accept`,
    transportOrderDetails: 'transport-order/details',
    loaderOrderDetails: 'loaders-order/details',
    cancelOrder: (orderId) => `order/${orderId}/executor-not-found/cancel-order`,
    getDefferedList: 'requests/deferred-list',
    cancelRequest: 'requests/cancel',
    cancelRequestAccept: (orderId) => `order/${orderId}/producer-cancel-request/accept`,
    cancelRequestCancel: (orderId) => `order/${orderId}/producer-cancel-request/cancel-request`,
    cancelRequestChangeExecutor: (orderId) => `order/${orderId}/producer-cancel-request/change-executor`,
    cancelDeferred: 'requests/cancel-deferred',
    cancelDeferredList: 'requests/cancel-many-deferred',
    publishDeferred: 'requests/publish',
    extendSelecting: (orderId) => `order/${orderId}/executor-not-found/extend-selecting`,
    acceptExecutorChange: (orderId) => `order/${orderId}/change-executor/accept`,
    rejectExecutorChange: (orderId) => `order/${orderId}/change-executor/reject`,
    ordersPaymentCreate: 'orders/payment/create',
    ordersPaymentResult: 'orders/payment/result',
    updatePointsPositions: (orderId) => `api/order/${orderId}/update-point-positions`,
    skipAddress: (id, pointNumber) => `api/order/${id}/skip/point/${pointNumber}`,
    csvReport: (id) => `api/order/${id}/csv-report`,
  },
  organization: {
    getOrganization: 'api/organization/get',
  },
};

Object.freeze(API_PATHS);

class ApiConstants {

  static get user() {
    return API_PATHS.user;
  }

  static get common() {
    return API_PATHS.common;
  }

  static get register() {
    return API_PATHS.register;
  }

  static get profile() {
    return API_PATHS.profile;
  }

  static get cargoPlace() {
    return API_PATHS.cargoPlace;
  }

  static get address() {
    return API_PATHS.address;
  }

  static get orders() {
    return API_PATHS.orders;
  }

  static get agent() {
    return API_PATHS.agent;
  }

  static get organization() {
    return API_PATHS.organization;
  }
}

export { ApiConstants };
