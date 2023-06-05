const clientHost = window.API_CONFIGS['client'].url;

const API_PATHS = {
  common: {
    dictionaries: 'api/dictionaries',
    uploadFile: 'api/upload-file',
    favoriteAddresses: 'api/contractor-point/list-info',
    favoriteAddressesUpdate: 'api/contractor-point/update',
    favoriteAddressesDelete: (id) => `api/contractor-point/${id}/delete`,
    counterPartiesList: (role) => `api/contractor/${role}/list`,
    counterSettings: 'api/contour/configuration/sharing',
    bargainSettings: 'api/contractor/configuration/bargain',
    sharingListProducer: (id) => `api/order/${id}/sharing-list-producer`,
    deleteContractorSharing: (id) => `api/order/${id}/delete-contractor-sharing`,
    createManualSharingForEdit: (id) => `api/order/${id}/create-manual-sharing`,
  },
  contractor: {
    counterPartiesList: (role) => `api/contractor/${role}/list`,
    clientList: 'api/contractor/client/list',
    approve: 'api/contractor/contour-approve',
    delegatedList: (id) => `api/contractor/${id}/employees/list-delegated`,
    delegatedUpdate: (id) => `api/contractor/${id}/employees/update-delegated`,
    producerList: 'api/contractor/producer/list',
    producerForOrderList: 'api/contractor/producer/list-for-order',
    byEmployees: 'api/contractor/list/by-employees',
  },
  register: {
    requestCode: 'api/contractor/registration/phone/request-code',
    confirmCode: 'api/contractor/registration/phone/confirm',
    completeRegistration: 'api/contractor/registration',
    checkInn: 'api/contractor/check-inn',
  },
  user: {
    login: 'api/user/login',
    joinContour: (code) => `api/contour/join/${code}`,
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
    contractorConfiguration: 'api/contractor/configuration',
    contractorChangePassword: 'api/contractor/employees/change-password',
    getDelegationSettings: 'api/contractor/delegation-driver/get',
    setDelegation: 'api/contractor/delegation-driver/set',
    switchToDelegated: 'api/user/switch-contractor',
    edit:(id)=> `api/contractor/profile/${id}`,
    getBankInformation: (bik) => `api/bank/${bik}/info`
  },
  agent: {
    contractor: 'api/contractor/profile',
    contractorConfiguration: 'api/contractor/configuration',
  },
  orders: {
    monitoringBargains: 'api/monitoring/bargains',
    monitoringDocuments: 'api/monitoring/documents-check',
    monitoringExecuting: 'api/monitoring/executing',
    monitoringSelecting: 'api/monitoring/selecting',
    filteredList: 'api/order/list',
    calculate: 'api/order/transport-request/calculate',
    previewCalculate: (id) => `api/order/${id}/preview-calculate-list`,
    createAndPublish: 'api/order/transport-request/create-and-publish',
    createDeferre: 'api/order/transport-request/create-deferred',
    editTransportOrderActive: (orderId) => `api/order/${orderId}/active/update`,
    orderDetails: (orderId) => `api/order/${orderId}/details`,
    rejectOrderCalculation: (orderId, calculationId) => `api/order/${orderId}/calculation/${calculationId}/reject`,
    approveOrderCalculation: (orderId, calculationId) => `api/order/${orderId}/calculation/${calculationId}/accept`,
    cancelRequest: 'api/order/requests/cancel',
    updatePointsPositions: (orderId) => `api/order/${orderId}/update-point-positions`,
    skipAddress: (id, pointNumber) => `api/order/${id}/skip/point/${pointNumber}`,
    csvReport: (id) => `api/order/${id}/csv-report`,
    executionStart: (id) => `api/order/${id}/execution/start`,
    executionEnd: (id) => `api/order/${id}/execution/finish`,
    finalize: 'api/order/finalize',
    finalizeWithoutCalculation: 'api/order/finalize-without-calculation',
    acceptOrderDocuments: (orderId) => `api/order/${orderId}/accept`,
    rejectOrderDocuments: (orderId) => `api/order/${orderId}/reject`,
    parkingPointsList: (orderId) => `/api/parking-point/list/${orderId}`,
    appoint: (id) => `api/order/${id}/transport/appoint`,
    createManualSharing: (orderId) => `/api/order/${orderId}/create-manual-sharing`,
    requestReplacement: (id) => `api/order/${id}/transport/request-replacement`,
    cancelDeferredList: 'api/order/requests/cancel-many-deferred',
    publishDeferred: 'api/order/requests/publish',
    executionCancel: (orderId) => `api/order/${orderId}/cancel`,
    calculateLoaders: 'api/order/loaders-request/calculate',
    getDefferedList: 'api/order/requests/deferred/list',
    pointStatusUpdate: (id) => `api/order/${id}/point/status/update`,
    getTransportOrderEditingData: 'api/order/transport-request/edit',
    take: (id) => `api/order/${id}/take`,
    editLoadersOrder: 'loaders-request/update', // перенести
    loadersCreate: 'api/order/loaders-request/create-and-publish', // перенести
    editTransportOrder: 'api/order/transport-request/update',
    removeOrder: (orderId) => `orders/${orderId}`, // перенести
    loaderOrderDetails: 'loaders-order/details', // перенести
    cancelOrder: (orderId) => `order/${orderId}/executor-not-found/cancel-order`, // перенести
    cancelRequestAccept: (orderId) => `api/order/${orderId}/cancel/accept`,
    // cancelDeferred: 'requests/cancel-deferred', // перенести
    // extendSelecting: (orderId) => `order/${orderId}/executor-not-found/extend-selecting`,
    acceptExecutorChange: (orderId) => `api/order/${orderId}/change-executor/accept`,
    // rejectExecutorChange: (orderId) => `order/${orderId}/change-executor/reject`,
    // ordersPaymentCreate: 'orders/payment/create',
    // ordersPaymentResult: 'orders/payment/result',
    // cancelRequestCancel: (orderId) => `order/${orderId}/producer-cancel-request/cancel-request`,
    // cancelRequestChangeExecutor: (orderId) => `order/${orderId}/producer-cancel-request/change-executor`,
    // transportOrderDetails: 'transport-order/details',
    // loadersCreatedDeferred: 'loaders-request/create-deferred',
    // transportCreateDeferred: 'transport-request/create-deferred',
    // loadersCreatedDeferred: 'loaders-request/create-deferred',
    // transportCreateDeferred: 'transport-request/create-deferred',
    // getLoaderOrderEditingData: 'loaders-request/edit',
    // monitoring: 'monitoring/orders',
    regularOrderList: 'api/order/regular/list',
    createRegularOrder: 'api/order/regular/create',
    regularOrderDetails: (id) => `api/order/regular/${id}`,
    deleteRegularOrder: (id) => `api/order/regular/${id}/delete`,
    editRegularOrder: (id) => `api/order/regular/${id}/update`,
    togglePauseRegularOrder: (id) => `api/order/regular/${id}/update/paused`,
    preliminaryRate: (id) => `/api/order/${id}/preliminary-rate`,
    arriveAt: 'api/order/regular/arrive-at',
    exportOrderList: '/api/order/list/export',
    responsibleEmployees: (id) => `/api/order/${id}/responsible-employees`,
    executionFinish: (id) => `api/order/${id}/execution/finish`,
    history: (id) => `api/order/${id}/history`,
  },
  // producers: {
  //   list: 'producer/filtered-list',
  //   approve: 'producer/contour-approve',
  // },
  tractor: {
    create: (id) => `api/tractor/add/${id}`,
    info: (id) => `api/tractor/info/${id}`,
    update: (id) => `api/tractor/update/${id}`,
    // setLinkedDrivers: 'tractor/set-linked-drivers',
    setMaintenance: (id) => `api/tractor/${id}/set-maintenance-state`,
    list: `api/tractor/list`,
  },
  trailer: {
    add: `api/trailer/create`,
    info: (id) => `api/trailer/${id}/info`,
    update: (id) => `api/trailer/${id}/update`,
    // setLinkedDrivers: 'trailer/set-linked-drivers',
    setMaintenance: (id) => `api/trailer/${id}/set-maintenance-state`,
    list: `api/trailer/list`,
  },
  drivers: {
    list: 'api/driver/list',
    info: (id) => `api/driver/${id}/info`,
    setSickState: id => `api/driver/${id}/set-sick-state`,
    create: `api/driver/create`,
    canWorkAsLoader: (id) => `api/driver/${id}/set-can-work-as-loader`,
    setLinkedVehicles: (id) => `api/driver/${id}/set-linked-vehicles`,
    neverDelegate: (id) => `api/driver/${id}/set-never-delegate`,
    update: (id) => `api/driver/${id}/update`,
    shortList: 'api/driver/shot-list',
    logout: (id) => `api/driver/${id}/logout`,
    remove:(id) => `api/driver/${id}/remove`,
  },
  tariff: {
    list: 'api/tariffs/list',
    listForContractor: (contractorId) => `api/tariffs/appoint/list/${contractorId}`,
    contractorsForAppoints: (tariffId) => `api/tariffs/${tariffId}/contractors-for-appoints`,
    hourlyAdd: 'api/tariffs/create/hourly',
    fixedAdd: 'api/tariffs/create/fixed',
    details: (id) => `api/tariffs/${id}`,
    appoint: 'api/tariff/appoint',
    appointList: 'api/tariff/appoint/list',
    remove: (id) => `api/tariffs/${id}/remove`,
    createAppoints: (id) => `api/tariffs/${id}/create/appoints`,
  },
  settings: {
    interfaceSettings: 'api/user/interface-settings',
    getNotificationSettings: 'api/notifications/get',
    saveNotificationSettings: 'api/notifications/save',
  },
  registries: {
    getRegistries: 'api/registries',
    getRegistriesDetails:(id)=> `api/registries/${id}`,
    attachFiles:(id)=> `api/registries/${id}/attach-files`,
    reform: (id)=>`api/registries/${id}/remove-orders`,
    appointNumber:(id)=> `api/registries/${id}/appoint-number`,
    createRegistries:'api/registries/create',
    getOrdersList:'api/order/get-list-for-add-registry',
    addOrders:(id)=> `api/registries/${id}/add-orders`,
    removeOrders:(id)=>`api/registries/${id}/remove-orders`,
  },
  invoices: {
    invoiceDetail: 'api/invoice/details',
    accept: (id) => `api/invoices/${id}/accept`,
    filteredList: 'api/invoices',
    info: (id) => `api/invoices/${id}`,
  },
  contracts: {
    assignTariff: 'api/contour/contracts/assign-tariff',
    getContract: (id) => `api/contour/contracts/${id}`,
    createAgreement: 'api/contour/contracts/agreement/create',
    createContract: 'api/contour/contracts/create',
    contourList: 'api/contour/contracts',
    agreementsWithoutContractList: 'api/contour/contracts/agreements-without-contract',
    assignAgreementToContract: (id) => `api/contour/contracts/agreement/${id}/assign-contract`,
    getItem: 'api/platform-document/get-item',
    getProfile: (id) => `api/contractor/profile/${id}`,
    list: 'api/platform-document/get-list',
    save: 'api/platform-document/save',
    updateContract: (id) => `api/contour/contracts/${id}`,
    deleteAgreement: (id) => `api/contour/contracts/agreement/${id}`,
    configuration: 'api/contractor/configuration',
    saveConfigConst: (contractId) => `api/contour/contracts/save-config/${contractId}`,
    tariffsForAssign: (id) => `api/contour/contracts/${id}/list-tariff-for-assign`,
    margin: (id) => `api/contour/contracts/${id}/margin`,
    endContract: (id) => `api/contour/contracts/${id}/end`
  },
  documents: {
    orderDetails: (orderId, type) => `api/order-documents/${orderId}/info/${type}`,
    orderDetailsInType: (orderId, type) => `api/order-documents/${orderId}/info/${type}`,
    accept: 'api/order-document/accept',
    orderInfo: (id) => `api/order-document/${id}`,
    list: 'api/order-document/list',
    addComment: (id) => `api/order-document/${id}/add-comment`,
    comments: (id) => `api/order-document/${id}/comments`
  },
  bargains: {
    list: (id) => `api/order/${id}/offers`,
    accept: (id) => `api/order/${id}/offer/accept`,
    delete: (id,offerId)=>`api/order/${id}/offer/${offerId}/delete`,
    add: (id)=>`api/order/${id}/offer/add`,
    self:(id)=>`api/order/${id}/self-offer`,
    updateBasicOffers: (orderId) => `api/order/${orderId}/offers/update-basic`,
    orderList: 'api/order/bargain-list',
  },
  organization: {
    getOrganization: 'api/organization/get',
  },
  vehicle: {
    list: 'api/vehicle/list',
    types: 'api/vehicle-types',
    create: 'api/vehicle/create',
    info:(id)=>`api/vehicle/${id}/info`,
    update: (id) => `api/vehicle/${id}/update`,
    setLinkedDrivers: (id) => `api/vehicle/${id}/set-linked-drivers`,
    listCompatibleForTransportOrder: (id) => `api/vehicle/compatible-for-order/${id}`,
    updateTrailer: (id) => `api/vehicle/${id}/add-trailer`,
    import: `api/vehicle/import/file`,
    listCompatibleForOrderVehicle: (id) => `api/vehicle/compatible-for-order/${id}`,
    listCompatibleForOrderTrailer: (id) => `api/vehicle/compatible-trailer-for-order/${id}`,
    setMaintenance: (id) => `api/vehicle/${id}/set-maintenance-state`, 
    scanDocument: 'vehicle/scan-document', // перенести
    activeOrders: 'transport-order/list-unfinished-for-vehicle', // перенести
    listForDashboard: 'api/vehicle/list-for-dashboard',
    // unformPoly: 'vehicle/poly-unform',
    remove: (id) => `/api/vehicle/${id}`,
    // wagonInfo: 'vehicle/poly-info',
    // trailerList: 'vehicle/trailer/list',
    // tractorList: 'vehicle/tractor/list',
    // createWagon: 'vehicle/form-poly-vehicle',
    // monoInfo: 'vehicle/mono-info',
  }
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

  static get tariff() {
    return API_PATHS.tariff;
  }

  static get settings() {
    return API_PATHS.settings;
  }

  static get contracts() {
    return API_PATHS.contracts;
  }

  static get producers() {
    return API_PATHS.producers;
  }

  static get contractor() {
    return API_PATHS.contractor;
  }

  static get documents() {
    return API_PATHS.documents;
  }

  static get bargains() {
    return API_PATHS.bargains;
  }

  static get organization() {
    return API_PATHS.organization;
  }

  static get tractor() {
    return API_PATHS.tractor;
  }

  static get trailer() {
    return API_PATHS.trailer;
  } 

  static get vehicle() {
    return API_PATHS.vehicle;
  }
  
  static get drivers() {
    return API_PATHS.drivers;
  }

  static get registries() {
    return API_PATHS.registries;
  }

  static get invoices() {
    return API_PATHS.invoices;
  }
}

export { ApiConstants };
