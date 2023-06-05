
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
  common: {
    dictionaries: 'api/dictionaries',
    uploadFile: 'api/upload-file',
    counterPartiesList: (role) => `api/contractor/${role}/list`,
    counterSettings: 'api/contour/configuration/sharing',
  },
  profile: {
    contractor: 'api/contractor/profile',
    contractorUsers: 'api/contractor/employees',
    extraSave: 'api/contractor/profile-additional',
    mainSave: 'api/contractor/profile-main',
    userUpdate: (id) => `api/contractor/employees/${id}`,
    userDelete: 'api/contractor/employees/delete',
    userAdd: 'api/contractor/employees',
    contractorUser: (id) => `api/contractor/employees/${id}`,
    passwordChange: 'api/contractor/employees/change-password',
    getDelegationSettings: 'api/contractor/delegation-driver/get',
    setDelegation: 'api/contractor/delegation-driver/set',
    contractorUsers: 'api/contractor/employees',
    switchToDelegated: 'api/user/switch-contractor',
    edit:(id)=> `api/contractor/profile/${id}`,
    getBankInformation: (bik) => `api/bank/${bik}/info`
  },
  drivers: {
    setSickState: id => `api/driver/${id}/set-sick-state`,
    remove:(id) => `api/driver/${id}/remove`,
    list: 'api/driver/list',
    info: (id) => `api/driver/${id}/info`,
    create: `api/driver/create`,
    canWorkAsLoader: (id) => `api/driver/${id}/set-can-work-as-loader`,
    setLinkedVehicles: (id) => `api/driver/${id}/set-linked-vehicles`,
    neverDelegate: (id) => `api/driver/${id}/set-never-delegate`,
    update: (id) => `api/driver/${id}/update`,
    shortList: 'api/driver/shot-list',
    logout: (id) => `api/driver/${id}/logout`,
  },
  loaders: {
    create: `api/loader/create`,
    info: (id) => `api/loader/${id}/info`,
    list: 'api/loader/list',
    remove:(id) => `api/loader/${id}/remove`,
    setSickState: id => `api/loader/${id}/set-sick-state`,
    update: (id) => `api/loader/${id}/update`,
  },
  address: {
    list: 'api/contractor-point/list-info',
    info: (id) => `api/contractor-point/${id}/info`,
    contacts: (id) => `api/contractor-point/${id}/contacts`,
    openingHours: (id) => `api/contractor-point/${id}/opening-hours`,
    update: 'api/contractor-point/update',
  },
  vehicle: {
    list: 'api/vehicle/list',
    create: 'api/vehicle/create',
    info:(id)=>`api/vehicle/${id}/info`,
    update: (id) => `api/vehicle/${id}/update`,
    setLinkedDrivers: (id) => `api/vehicle/${id}/set-linked-drivers`,
    listCompatibleForTransportOrder: (id) => `api/vehicle/compatible-for-order/${id}`,
    updateTrailer: (id) => `api/vehicle/${id}/add-trailer`,
    listCompatibleForOrderVehicle: (id) => `api/vehicle/compatible-for-order/${id}`,
    listCompatibleForOrderTrailer: (id) => `api/vehicle/compatible-trailer-for-order/${id}`,
    listForDashboard: `api/vehicle/list-for-dashboard`,
    setMaintenance: (id) => `api/vehicle/${id}/set-maintenance-state`,
    remove: (id) => `api/vehicle/${id}`,
    types: 'api/vehicle-types',
  },
  tractor: {
    create: (id) => `api/tractor/add/${id}`,
    info: (id) => `api/tractor/info/${id}`,
    update: (id) => `api/tractor/update/${id}`,
    setMaintenance: (id) => `api/tractor/${id}/set-maintenance-state`,
    list: `api/tractor/list`,
  },
  trailer: {
    add: `api/trailer/create`,
    info: (id) => `api/trailer/${id}/info`,
    update: (id) => `api/trailer/${id}/update`,
    list: `api/trailer/list`,
    setMaintenance: (id) => `api/trailer/${id}/set-maintenance-state`,
  },

  tariff: {
    list: 'api/tariffs/list',
    listForContractor: (contractorId) => `api/tariffs/appoint/list/${contractorId}`,
    hourlyAdd: 'api/tariffs/create/hourly',
    fixedAdd: 'api/tariffs/create/fixed',
    details: (id) => `api/tariffs/${id}`,
    createAppoints: (id) => `api/tariffs/${id}/create/appoints`,
    appointList: (id) => `api/tariffs/appoint/list/${id}`,
    appoint: 'api/tariff/appoint', 
    remove: (id) => `api/tariffs/${id}/remove`,
  },

  cargoPlace: {
    list: 'api/cargo-place/list',
    orderView: (id) => `/api/cargo-place/transport-order/${id}/list`,
    info: (id) => `api/cargo-place/${id}/info`,
    cargoIncluded: (id) => `api/cargo-place/${id}/included`,
    cargoDispatch: (id) => `api/cargo-place/${id}/dispatch-list`,
    update: 'api/cargo-place/update',
    deleteCargoCard: (id) => `api/cargo-place/${id}/delete`,
    groupUpdate: (id) => `api/cargo-place/group-update/${id}`,
  },

  bargains: {
    list: 'api/order/bargain-list',
    delete: (id, offerId) => `api/order/${id}/offer/${offerId}/delete`,
    add: (id) => `api/order/${id}/offer/add`,
    update:(id, offerId) => `api/order/${id}/offer/${offerId}/update-basic`,
    self:(id) => `api/order/${id}/self-offer`,
  },

  orders: {
    monitoringBargains: 'api/monitoring/bargains',
    monitoringDocuments: 'api/monitoring/documents-check',
    monitoringExecuting: 'api/monitoring/executing',
    monitoringSelecting: 'api/monitoring/selecting',
    finalize: 'api/order/finalize',
    finalizeWithoutCalculation: 'api/order/finalize-without-calculation',
    executionStart: (id) => `api/order/${id}/execution/start`,
    executionEnd: (id) => `api/order/${id}/execution/finish`,
    csvReport: (id) => `api/order/${id}/csv-report`,
    parkingPointsList: (orderId) => `/api/parking-point/list/${orderId}`,
    updatePointsPositions: (orderId) => `api/order/${orderId}/update-point-positions`,
    appoint: (id) => `api/order/${id}/transport/appoint`,
    orderDetails: (orderId) => `api/order/${orderId}/details`,
    ordersList: 'api/order/list',
    take: (id) => `api/order/${id}/take`,
    refuseWaiting: (id) => `api/order/${id}/cancel`,
    requestReplacement: (id) => `api/order/${id}/transport/request-replacement`,
    pointStatusUpdate: (id) => `api/order/${id}/point/status/update`,
    exportOrderList: '/api/order/list/export',
    responsibleEmployees: (id) => `/api/order/${id}/responsible-employees`,
    executionFinish: (id) => `api/order/${id}/execution/finish`,
    history: (id) => `api/order/${id}/history`,
    appointLoaders: (id) => `api/order/${id}/loaders/appoint`,
  },

  registries: {
    getRegistries: 'api/registries',
    getRegistriesDetails:(id)=> `api/registries/${id}`,
    attachFiles:(id)=> `api/registries/${id}/attach-files`,
    reform: (id)=>`api/registries/${id}/remove-orders`,
    appointNumber:(id)=> `api/registries/${id}/appoint-number`,
    addOrders:(id)=> `api/registries/${id}/add-orders`,
    removeOrders:(id)=>`api/registries/${id}/remove-orders`,
    create:'api/registries/create',
  },
  contracts: {
    addContract: 'api/contour/contracts/create',
    createAgreement: 'api/contour/contracts/agreement/create',
    contourList: 'api/contour/contracts',
    agreementsWithoutContractList: 'api/contour/contracts/agreements-without-contract',
    assignAgreementToContract: (id) => `api/contour/contracts/agreement/${id}/assign-contract`,
    getContract: (id) => `api/contour/contracts/${id}`,
    updateContract: (id) => `api/contour/contracts/${id}`,
    deleteAgreement: (id) => `api/contour/contracts/agreement/${id}`,
    getProfile: (id) => `api/contractor/profile/${id}`,
    assignTariff: 'api/contour/contracts/assign-tariff',
    configDeligateForContractor: (expeditorId) => `api/contour/contractor/config/${expeditorId}`,
    tariffsForAssign: (id) => `api/contour/contracts/${id}/list-tariff-for-assign`,
    endContract: (id) => `api/contour/contracts/${id}/end`
  },
  documents: {
    orderDetailsInType: (orderId, type) => `api/order-documents/${orderId}/info/${type}`,
    list: 'api/order-document/list',
    getItem: (id) => `api/order-document/${id}`,
    addComment: (id) => `api/order-document/${id}/add-comment`,
    getCommentList: (id) => `api/order-document/${id}/comments`,
    accept: 'api/order-document/accept',
    deleteDocument: (id) => `api/order-document/${id}/delete`,
    replaceDocument: (id) => `api/order-document/${id}/replace`,
    uploadDocument: 'api/order-document/upload',
  },
  cartulary: {
    getCartulary: 'api/order/get-list-for-add-registry',
  },

  settings: {
    interfaceSettings: 'api/user/interface-settings',
    getNotificationSettings: 'api/notifications/get',
    saveNotificationSettings: 'api/notifications/save',
    сontractorConfiguration: 'api/contractor/configuration',
  },
  organization: {
    getOrganization: 'api/organization/get',
  },
  contractor: {
    counterPartiesList: (role) => `api/contractor/${role}/list`,
    clientList: 'api/contractor/client/list',
    approve: 'api/contractor/contour-approve',
    byEmployees: 'api/contractor/list/by-employees',
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

  static get common() {
    return API_PATHS.common;
  }

  static get geoCoding() {
    return API_PATHS.geoCoding;
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

  static get loaders() {
    return API_PATHS.loaders;
  }

  static get vehicle() {
    return API_PATHS.vehicle;
  }

  static get tractor() {
    return API_PATHS.tractor;
  }

  static get tariff() {
    return API_PATHS.tariff;
  }

  static get trailer() {
    return API_PATHS.trailer;
  }

  static get registries() {
    return API_PATHS.registries;
  }

  static get cartulary() {
    return API_PATHS.cartulary;
  }

  static get documents() {
    return API_PATHS.documents;
  }

  static get bargains() {
    return API_PATHS.bargains;
  }

  static get contracts() {
    return API_PATHS.contracts;
  }

  static get agent() {
    return API_PATHS.agent;
  }

  static get address() {
    return API_PATHS.address;
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

  static get register() {
    return API_PATHS.register;
  }
}

export { ApiConstants };
