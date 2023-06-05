const API_PATHS = {
  common: {
    dictionaries: 'api/dictionaries',
    uploadFile: 'api/upload-file',
    favoriteAddresses: 'api/contractor-point/list-info',
    favoriteAddressesUpdate: 'api/contractor-point/update',
    favoriteAddressesDelete: (id) => `api/contractor-point/${id}/delete`,
    counterPartiesList: (role) => `api/contractor/${role}/list`,
    sharingSettings: 'api/contour/configuration/sharing',
    bargainSettings: 'api/contractor/configuration/bargain',
    contourSettings: 'api/contour/configuration/settings',
    sharingListProducer: (id) => `api/order/${id}/sharing-list-producer`,
    deleteContractorSharing: (id) => `api/order/${id}/delete-contractor-sharing`,
    createManualSharingForEdit: (id) => `api/order/${id}/create-manual-sharing`,
    cities: 'api/cities/list',
    countries: 'api/country/list',
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
    notificationsList: 'api/sent-message/notice-list',
    notificationsCount: 'api/sent-message/unnoticed-count',
    switchStatus: (id) => `api/contour/contractor/${id}/status`,
    getCustomProperty: (id) => `api/contour/contractor/custom-property/${id}/get`,
    setCustomProperty: (id) => `api/contour/contractor/custom-property/${id}/set`,
    export: 'api/contractor/list/export',
    frontSettings: 'api/employee/front-settings',
    listByResponsibleEmployee: 'api/contractor/list-by-responsible-employee',
    assignResponsible: `api/contractor/employees/assign-internal-responsible`,
    removeResponsible: `api/contractor/employees/remove-internal-responsible`,
    createChild: 'api/contractor/child-create',
  },
  register: {
    requestCode: 'api/contractor/registration/phone/request-code',
    confirmCode: 'api/contractor/registration/phone/confirm',
    completeRegistration: 'api/contractor/registration',
    checkInn: 'api/contractor/check-inn',
  },
  user: {
    login: 'api/user/login',
    forgotPassword: 'api/user/forgot-password/request',
    recoverPassword: 'api/user/forgot-password/change',
    joinContour: (code) => `api/contour/join/${code}`,
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
    groupUpdate: 'api/contractor-point/group-update',
    exportList: 'api/contractor-point/list/export',
    listByCoordinates: `api/contractor-point/list-by-coordinates`,
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
    groupUpdate: (id) => `api/cargo-place/group-update/${id}`,
    updateGroup: `api/cargo-place/group-update`,
    journalList: `api/cargo-place/journal-list`,
    planning: 'api/cargo-place/order/planning',
  },
  profile: {
    contractor: 'api/contractor/profile',
    contractorUser: (id) => `api/contractor/employees/${id}`,
    contractorDeleteUser: 'api/contractor/employees/delete',
    contractorUsers: 'api/contractor/employees',
    contractorGroups: 'api/request-group/list',
    contractorGroup: (id) => `api/request-group/${id}`,
    contractorGroupAdd: `api/request-group/create`,
    saveMain: 'api/contractor/profile-main',
    saveAdditional: 'api/contractor/profile-additional',
    contractorConfiguration: 'api/contractor/configuration',
    contractorChangePassword: 'api/contractor/employees/change-password',
    getDelegationSettings: 'api/contractor/delegation-driver/get',
    setDelegation: 'api/contractor/delegation-driver/set',
    switchToDelegated: 'api/user/switch-contractor',
    edit: (id) => `api/contractor/profile/${id}`,
    getBankInformation: (bik) => `api/bank/${bik}/info`,
    numerator: 'api/contractor/configuration/numerator/template',
    customPropsList: 'api/custom-property/list',
    customPropsCreate: 'api/custom-property/create',
    customPropsEdit: (id) => `api/custom-property/update/${id}`,
    customPropsDelete: (id) => `api/custom-property/delete/${id}`,
    customPropsInfo: (id) => `api/custom-property/info/${id}`,
    orderReportOptions: 'api/contractor/order-report-options',
    refreshOrganization: 'api/contractor/refresh-organization',
    addGroupsToEmployee: 'api/request-group/add-employee-in-groups',
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
    getLoadersOrderEditingData: 'api/order/loaders-request/edit',
    take: (id) => `api/order/${id}/take`,
    loadersCreate: 'api/order/loaders-request/create-and-publish',
    editTransportOrder: 'api/order/transport-request/update',
    editLoadersOrder: 'api/order/loaders-request/update',
    cancelRequestAccept: (orderId) => `api/order/${orderId}/cancel/accept`,
    acceptExecutorChange: (orderId) => `api/order/${orderId}/change-executor/accept`,
    rejectExecutorChange: (orderId) => `api/order/${orderId}/change-executor/reject`,
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
    appointLoaders: (id) => `api/order/${id}/loaders/appoint`,
    replaceLoaders: (id) => `api/order/${id}/loaders/request-replacement`,
    addComment: (id) => `api/order/${id}/add-comment`,
    getContractReport: (id) => `/api/order/${id}/contract-report`,
    addRelatedOrders: (id) => `api/order/${id}/add-related-order`,
    insuranceAmount: (id) => `api/order/${id}/insurance-amount`,
    detailsShort: (id) => `api/order/${id}/details-short`,
    deleteOrderDocument: (id) => `api/order-document/${id}/delete`,
    extendSelecting: (id) => `api/order/${id}/executor-not-found/extend-selecting`
  },
  requests: {
    requestList: 'api/requests',
    requestAuctionList: 'api/requests/active-bargain',
    requestActiveList: 'api/requests/active',
    takeRequest: `api/order/implementer-employee`,
    setSharingCustomProperties: (id) => `api/orders/${id}/sharing-custom-properties`,
    exportList: '/api/requests/export',
    exportListActive: '/api/requests/active/export',
  },
  producers: {
    list: 'api/contractor/1/list',
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
    remove: (id) => `api/driver/${id}/remove`,
    calendar: `api/employment-calendar/drivers`,
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
    mileageAdd: 'api/tariffs/create/mileage-point-downtime'
  },
  settings: {
    interfaceSettings: 'api/user/interface-settings',
    getNotificationSettings: 'api/notifications/get',
    saveNotificationSettings: 'api/notifications/save',
    сontractorConfiguration: 'api/contractor/configuration',
  },
  registries: {
    getRegistries: 'api/registries',
    getRegistriesDetails: (id) => `api/registries/${id}`,
    attachFiles: (id) => `api/registries/${id}/attach-files`,
    reform: (id) => `api/registries/${id}/remove-orders`,
    appointNumber: (id) => `api/registries/${id}/appoint-number`,
    createRegistries: 'api/registries/create',
    getOrdersList: 'api/order/get-list-for-add-registry',
    addOrders: (id) => `api/registries/${id}/add-orders`,
    removeOrders: (id) => `api/registries/${id}/remove-orders`,
  },
  invoices: {
    invoiceDetail: (id) => `api/invoices/${id}`,
    accept: (id) => `api/invoices/${id}/accept`,
    filteredList: 'api/invoices',
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
    agreement: (id) => `api/contour/contracts/agreement/${id}`,
    configuration: 'api/contractor/configuration',
    saveConfigConst: (contractId) => `api/contour/contracts/save-config/${contractId}`,
    tariffsForAssign: (id) => `api/contour/contracts/${id}/list-tariff-for-assign`,
    margin: (id) => `api/contour/contracts/${id}/margin`,
    endContract: (id) => `api/contour/contracts/${id}/end`,
    configDeligate: (id) => `api/contour/contractor/config/${id}`,
  },
  documents: {
    orderDetails: (orderId, type) => `api/order-documents/${orderId}/info/${type}`,
    orderDetailsInType: (orderId, type) => `api/order-documents/${orderId}/info/${type}`,
    accept: 'api/order-document/accept',
    orderInfo: (id) => `api/order-document/${id}`,
    list: 'api/order-document/list',
    addComment: (id) => `api/order-document/${id}/add-comment`,
    comments: (id) => `api/order-document/${id}/comments`,
    deleteDocument: (id) => `api/order-document/${id}/delete`,
    replaceDocument: (id) => `api/order-document/${id}/replace`,
    uploadDocument: 'api/order-document/upload',
    flowList: 'api/document/list',
    sign: (id) => `api/document/${id}/sign`
  },
  bargains: {
    list: (id) => `api/order/${id}/offers`,
    accept: (id) => `api/order/${id}/offer/accept`,
    delete: (id, offerId) => `api/order/${id}/offer/${offerId}/delete`,
    add: (id) => `api/order/${id}/offer/add`,
    self: (id) => `api/order/${id}/self-offer`,
    updateBasicOffers: (orderId) => `api/order/${orderId}/offers/update-basic`,
    orderList: 'api/order/bargain-list',
  },
  organization: {
    getOrganization: 'api/organization/get',
  },
  cartulary: {
    getCartulary: 'api/order/get-list-for-add-registry',
  },
  loaders: {
    create: `api/loader/create`,
    info: (id) => `api/loader/${id}/info`,
    list: 'api/loader/list',
    remove: (id) => `api/loader/${id}/remove`,
    setSickState: id => `api/loader/${id}/set-sick-state`,
    update: (id) => `api/loader/${id}/update`,
    calculate: 'api/order/loaders-request/calculate',
    createAndPublish: 'api/order/loaders-request/create-and-publish',
  },
  offers: {
    list: (id) => `api/order/${id}/offers`,
    accept: (id) => `api/order/${id}/offer/accept`,
  },
  vehicle: {
    list: 'api/vehicle/list',
    systemTypes: 'api/vehicle-types',
    contourTypes: 'api/contour/vehicle-types',
    counterpartyTypes: (id) => `api/contour/vehicle-types/${id}`,
    setContourTypes: 'api/contour/vehicle-types/set ',
    create: 'api/vehicle/create',
    info: (id) => `api/vehicle/${id}/info`,
    update: (id) => `api/vehicle/${id}/update`,
    setLinkedDrivers: (id) => `api/vehicle/${id}/set-linked-drivers`,
    listCompatibleForTransportOrder: (id) => `api/vehicle/compatible-for-order/${id}`,
    updateTrailer: (id) => `api/vehicle/${id}/add-trailer`,
    import: `api/vehicle/import/file`,
    listCompatibleForOrderVehicle: (id) => `api/vehicle/compatible-for-order/${id}`,
    listCompatibleForOrderTrailer: (id) => `api/vehicle/compatible-trailer-for-order/${id}`,
    listCompatibleForOrderTractor: (id) => `api/vehicle/compatible-tractor-for-order/${id}`,
    setMaintenance: (id) => `api/vehicle/${id}/set-maintenance-state`,
    listForDashboard: 'api/vehicle/list-for-dashboard',
    remove: (id) => `/api/vehicle/${id}`,
    calendar: `api/employment-calendar/vehicles`,
  },
  geoCoding: {
    geocoder: 'geocoder/geocode',
    addressAutocomplete: 'geocoder/address/autocomplete',
    reverseGeocoder: 'geocoder/reverse',
    routes: 'router/viaroute',
    ringRoad: 'ring-road/point-in-polygon',

    googleTimeZone: 'google/maps/api/timezone',

  },
  unit: {
    create: 'api/unit/create',
    delete: (id) => `api/unit/${id}/delete`,
    list: 'api/unit/list',
    update: (id) => `api/unit/update/${id}`,
  },
  cancellationReason: {
    create: 'api/cancellation-reason/create',
    detail: (id) => `api/cancellation-reason/${id}`,
    list: 'api/cancellation-reason/list',
  },
  insurers: {
    info: (id) => `api/insurer/${id}/info`,
    list: `api/insurers/list`,
    contractCreate: 'api/insurer/contract/create',
    contractDelete: (id) => `api/insurer/contract/${id}/deactivate`,
    contracts: (id) => `api/insurer/${id}/contracts`,
    contract: (id) => `api/insurer/contract/${id}`,
    deactivateContract: (id) => `api/insurer/contract/${id}/deactivate`,
    insuredOrders: (id) => `api/insurers/${id}/order-list`,
    insuredOrdersExport: `api/insurers/order-list/export`
  },
  employees: {
    exportEmployees: 'api/employee/list/export'
  }

};

Object.freeze(API_PATHS);

class ApiConstants {
  static get common() {
    return API_PATHS.common;
  };
  static get contractor() {
    return API_PATHS.contractor;
  };
  static get register() {
    return API_PATHS.register;
  };
  static get user() {
    return API_PATHS.user;
  };
  static get address() {
    return API_PATHS.address;
  };
  static get cargoPlace() {
    return API_PATHS.cargoPlace;
  };
  static get profile() {
    return API_PATHS.profile;
  };
  static get agent() {
    return API_PATHS.agent;
  };
  static get orders() {
    return API_PATHS.orders;
  };
  static get producers() {
    return API_PATHS.producers;
  };
  static get tractor() {
    return API_PATHS.tractor;
  };
  static get trailer() {
    return API_PATHS.trailer;
  };
  static get drivers() {
    return API_PATHS.drivers;
  };
  static get tariff() {
    return API_PATHS.tariff;
  };
  static get settings() {
    return API_PATHS.settings;
  };
  static get registries() {
    return API_PATHS.registries;
  };
  static get invoices() {
    return API_PATHS.invoices;
  };
  static get contracts() {
    return API_PATHS.contracts;
  };
  static get documents() {
    return API_PATHS.documents;
  };
  static get bargains() {
    return API_PATHS.bargains;
  };
  static get organization() {
    return API_PATHS.organization;
  };
  static get offers() {
    return API_PATHS.offers;
  };
  static get cartulary() {
    return API_PATHS.cartulary;
  };
  static get vehicle() {
    return API_PATHS.vehicle;
  };
  static get geoCoding() {
    return API_PATHS.geoCoding;
  };
  static get loaders() {
    return API_PATHS.loaders;
  };
  static get unit() {
    return API_PATHS.unit;
  };
  static get cancellationReason() {
    return API_PATHS.cancellationReason;
  };
  static get insurers() {
    return API_PATHS.insurers;
  };

  static get employees() {
    return API_PATHS.employees;
  }
  static get requests() {
    return API_PATHS.requests;
  }

};

export { ApiConstants };
