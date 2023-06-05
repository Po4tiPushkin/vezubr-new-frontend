const API_PATHS = {
  user: {
    login: 'api/user/login',
    forgotPassword: 'api/user/forgot-password/request',
    recoverPassword: 'api/user/forgot-password/change',
    joinContour: (code) => `api/contour/join/${code}`,
  },
  register: {
    requestCode: 'api/contractor/registration/phone/request-code',
    confirmCode: 'api/contractor/registration/phone/confirm',
    completeRegistration: 'api/contractor/registration',
    checkInn: 'api/contractor/check-inn',
  },

  contractor: {
    counterPartiesList: (role) => `api/contractor/${role}/list`,
    clientList: 'api/contractor/client/list',
    approve: 'api/contractor/contour-approve',
    producerList: 'api/contractor/producer/list',
    producerForOrderList: 'api/contractor/producer/list-for-order',
    byEmployees: 'api/contractor/list/by-employees',
  },
  offers: {
    list: (id) => `api/order/${id}/offers`,
    accept: (id) => `api/order/${id}/offer/accept`,
  },
  orders: {
    monitoringBargains: 'api/monitoring/bargains',
    monitoringDocuments: 'api/monitoring/documents-check',
    monitoringExecuting: 'api/monitoring/executing',
    monitoringSelecting: 'api/monitoring/selecting',
    calculate: 'api/order/transport-request/calculate',
    createAndPublish: 'api/order/transport-request/create-and-publish',
    editTransportOrderActive: (orderId) => `api/order/${orderId}/active/update`,
    rejectOrderCalculation: (orderId, calculationId) => `api/order/${orderId}/calculation/${calculationId}/reject`,
    approveOrderCalculation: (orderId, calculationId) => `api/order/${orderId}/calculation/${calculationId}/accept`,
    approveOrderDocuments: (orderId) => `api/order/${orderId}/accept`,
    rejectOrderDocuments: (orderId) => `api/order/${orderId}/reject`,
    cancelRequest: 'api/order/requests/cancel',
    updatePointsPositions: (orderId) => `api/order/${orderId}/update-point-positions`,
    skipAddress: (id, pointNumber) => `api/order/${id}/skip/point/${pointNumber}`,
    csvReport: (id) => `api/order/${id}/csv-report`,
    parkingPointsList: (orderId) => `/api/parking-point/list/${orderId}`,
    orderDetails: (orderId) => `api/order/${orderId}/details`,
    cancelRequestAccept: (orderId) => `api/order/${orderId}/cancel/accept`,
    bargainsList: 'api/order/bargain-list',
    cancelOrder: (orderId) => `order/${orderId}/executor-not-found/cancel-order`,
    filteredList: 'api/order/list',
    editTransportOrder: 'api/order/transport-request/update',
    getDefferedList: 'api/order/requests/deferred/list', 
    cancelDeferredList: 'api/order/requests/cancel-many-deferred',
    publishDeferred: 'api/order/requests/publish',
    getTransportOrderEditingData: 'api/order/transport-request/edit',
    extendSelecting: (orderId) => `api/order/${orderId}/executor-not-found/extend-selecting`,
    acceptExecutorChange: (orderId) => `api/order/${orderId}/change-executor/accept`,
    rejectExecutorChange: (orderId) => `api/order/${orderId}/change-executor/reject`,
    regularOrderList: 'api/order/regular/list',
    createRegularOrder: 'api/order/regular/create',
    regularOrderDetails: (id) => `api/order/regular/${id}`,
    deleteRegularOrder: (id) => `api/order/regular/${id}/delete`,
    editRegularOrder: (id) => `api/order/regular/${id}/update`,
    togglePauseRegularOrder: (id) => `api/order/regular/${id}/update/paused`,
    arriveAt: 'api/order/regular/arrive-at',
    exportOrderList: '/api/order/list/export',
    responsibleEmployees: (id) => `/api/order/${id}/responsible-employees`,
    executionFinish: (id) => `api/order/${id}/execution/finish`,
    history: (id) => `api/order/${id}/history`,
  },

  documents: {
    orderDetails: (orderId, type) => `api/order-documents/${orderId}/info/${type}`,
  },

  profile: {
    contractor: 'api/contractor/profile',
    saveMain: 'api/contractor/profile-main',
    contractorUsers: 'api/contractor/employees',
    contractorUserAdd: 'api/contractor/employees',
    contractorUserUpdate: (id) => `api/contractor/employees/${id}`,
    contractorUserDelete: 'api/contractor/employees/delete',
    changePassword: 'api/contractor/employees/change-password',
    contractorUser: (id) => `api/contractor/employees/${id}`,
    contractorConfiguration: 'api/contractor/configuration',
    edit:(id)=> `api/contractor/profile/${id}`,
    switchToDelegated: 'api/user/switch-contractor',
    saveAdditional: 'api/contractor/profile-additional', 
    getBankInformation: (bik) => `api/bank/${bik}/info`,
    contractorUser: (id) => `api/contractor/employees/${id}`,
  },
  common: {
    dictionaries: 'api/dictionaries',
    uploadFile: 'api/upload-file',
    counterSettings: 'api/contour/configuration/sharing',
    favoriteAddresses: 'api/contractor-point/list-info',
    favoriteAddressesUpdate: `api/contractor-point/update`,
    favoriteAddressesDelete: (id) => `api/contractor-point/${id}/delete`,
  },

  tariff: {
    list: 'api/tariffs/list',
    listForContractor: (contractorId) => `api/tariffs/appoint/list/${contractorId}`,
    hourlyAdd: 'api/tariffs/create/hourly',
    fixedAdd: 'api/tariffs/create/fixed',
    createAppoints: (id) => `api/tariffs/${id}/create/appoints`,
    details: (id) => `api/tariffs/${id}`,
    remove: (id) => `api/tariffs/${id}/remove`,
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

  geoCoding: {
    geocoder: 'geocoder/geocode',
    reverseGeocoder: 'geocoder/reverse',
    routes: 'router/viaroute',
    ringRoad: 'ring-road/point-in-polygon',

    googleTimeZone: 'google/maps/api/timezone',

  },
  producers: {
    list: 'api/contractor/1/list',
  },
  drivers: {
    list: 'api/driver/list',
  },
  vehicle: {
    list: 'api/vehicle/list',
    types: 'api/vehicle-types',
  },
  contracts: {
    contourList: 'api/contour/contracts',
    agreementsWithoutContractList: 'api/contour/contracts/agreements-without-contract',
    assignAgreementToContract: (id) => `api/contour/contracts/agreement/${id}/assign-contract`,
    createContract: 'api/contour/contracts/create',
    updateContract: (id) => `api/contour/contracts/${id}`,
    getContract: (id) => `api/contour/contracts/${id}`,
    getProfile: (id) => `api/contractor/profile/${id}`,
    configuration: 'api/contractor/configuration',
    configDeligateForClient: (expeditorId) => `api/contour/contractor/config/${expeditorId}`,
    createAgreement: 'api/contour/contracts/agreement/create',
    deleteAgreement: (id) => `api/contour/contracts/agreement/${id}`,
    assignTariff: 'api/contour/contracts/assign-tariff',
    tariffsForAssign: (id) => `api/contour/contracts/${id}/list-tariff-for-assign`,
    endContract: (id) => `api/contour/contracts/${id}/end`
  },
  invoices: {
    invoiceDetail:(id)=> `api/invoices/${id}`,
    accept: (id)=> `api/invoices/${id}/accept`,
    filteredList: 'api/invoices',
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
  settings: {
    getNotificationSettings: 'api/notifications/get',
    interfaceSettings: 'api/user/interface-settings',
    saveNotificationSettings: 'api/notifications/save',
  },
  organization: {
    getOrganization: 'api/organization/get',
  },
  loaders: {
    createAndPublish: 'api/order/loaders-request/create-and-publish',
    calculate: 'api/order/loaders-request/calculate'
  }
};

Object.freeze(API_PATHS);

class ApiConstants {
  static get user() {
    return API_PATHS.user;
  }

  static get orders() {
    return API_PATHS.orders;
  }

  static get documents() {
    return API_PATHS.documents;
  }

  static get common() {
    return API_PATHS.common;
  }

  static get geoCoding() {
    return API_PATHS.geoCoding;
  }

  static get getDadata() {
    return API_PATHS.daData;
  }

  static get googlePlace() {
    return API_PATHS.googlePlace;
  }

  static get contracts() {
    return API_PATHS.contracts;
  }

  static get profile() {
    return API_PATHS.profile;
  }

  static get invoices() {
    return API_PATHS.invoices;
  }

  static get payment() {
    return API_PATHS.payment;
  }

  static get settings() {
    return API_PATHS.settings;
  }

  static get drivers() {
    return API_PATHS.drivers;
  }

  static get bargains() {
    return API_PATHS.bargains;
  }

  static get producers() {
    return API_PATHS.producers;
  }

  static get vehicle() {
    return API_PATHS.vehicle;
  }

  static get tariff() {
    return API_PATHS.tariff;
  }

  static get agent() {
    return API_PATHS.agent;
  }

  static get address() {
    return API_PATHS.address;
  }

  static get rate() {
    return API_PATHS.rate;
  }

  static get cargoPlace() {
    return API_PATHS.cargoPlace;
  }

  static get organization() {
    return API_PATHS.organization;
  }

  static get contractor() {
    return API_PATHS.contractor;
  }
  static get offers() {
    return API_PATHS.offers;
  }
  static get register() {
    return API_PATHS.register;
  }
  static get loaders() {
    return API_PATHS.loaders;
  }
}

export { ApiConstants };
