const api = window.API_CONFIGS.client.host + window.API_CONFIGS.client.apiVersion;
const API_PATHS = {
  user: {
    login: 'user/login',
    loginCounterparty: 'user/operator-login',
    registerCorporate: 'users/reg',
    registerIndividual: 'users/reg/individual',
    requestCode: 'registration/phone-request-code',
    register: 'registration/register',
    confirmPhone: 'registration/phone-confirm',
    companyProfile: 'registration/company-profile',
    forgotPassword: 'user/forgot-password/request',
    recoverPassword: 'user/forgot-password/change',
    verifyEmail: 'registration/email-confirm',
  },
  common: {
    dictionaries: 'settings/vocabulary',
    glossary: `${api}/api/dictionaries`,
    startupData: 'common/startup-data',
    uploadFile: 'file/upload',
    managers: 'manager/get-list',
  },
  profile: {
    companyInfo: 'company/profile-main-get',
    companySecondaryInfo: 'company/profile-extra-get',
    usersList: 'users/get-list',
    extraSave: 'company/profile-extra-save',
    mainSave: 'company/profile-main-save',
    userUpdate: 'users/update',
    userDelete: 'users/remove',
    userAdd: 'users/add',
  },
  drivers: {
    list: 'driver/list',
    add: 'driver/add',
    info: 'driver/info',
    update: 'driver/update',
    setLinkedVehicles: 'driver/set-linked-vehicles',
    setSickState: 'driver/set-sick-state',
    remove: 'driver/remove',
    getListForVehicles: 'driver/get-list-for-vehicle',
    check: 'driver/check-data',
    approve: 'driver/check',
    reject: 'driver/reject',
    ban: 'driver/ban',
    activeOrders: 'driver/active-orders',
  },
  loaders: {
    list: 'loader/get-list',
    add: 'loader/add',
    info: 'loader/get',
    update: 'loader/update',
  },
  vehicle: {
    list: 'vehicle/list',
    listForDashboard: 'vehicle/get-list-for-dashboard',
    createMono: 'vehicle/create-mono',
    monoInfo: 'vehicle/info',
    updateMono: 'vehicle/update-mono',
    createWagon: 'vehicle/form-poly-vehicle',
    setLinkedDrivers: 'vehicle/set-linked-drivers',
    listCompatibleForTransportOrder: 'order/get-compatible-vehicle-for-replace',
    wagonInfo: 'vehicle/poly-info',
    trailerList: 'vehicle/trailer/list',
    tractorList: 'vehicle/tractor/list',
    setMaintenance: 'vehicle/set-maintenance-state',
    resetMaintenance: 'vehicle/reset-maintenance',
    unformPoly: 'vehicle/poly-unform',
    removeMono: 'vehicle/remove-mono',
    check: 'vehicle/check',
    accept: 'vehicle/accept',
    ban: 'vehicle/ban',
    reject: 'vehicle/reject',
    activeOrders: 'vehicle/active-orders',
  },
  tractor: {
    add: 'tractor/add',
    info: 'tractor/get-info',
    update: 'tractor/update',
    setLinkedDrivers: 'tractor/set-linked-drivers',
    setMaintenance: 'tractor/set-maintenance',
    resetMaintenance: 'tractor/reset-maintenance',
    list: 'tractor/list',
  },

  trailer: {
    add: 'trailer/create',
    info: 'trailer/get-info',
    update: 'trailer/update',
    setMaintenance: 'tractor/set-maintenance',
    resetMaintenance: 'tractor/reset-maintenance',
    list: 'trailer/list',
  },

  orders: {
    loaderOrderDetails: 'loaders-order/get-info',
    info: 'order/get-info',
    monitorForOrders: 'order/get-list-actual-user-problems-for-dashboard',
    monitorForVehicles: 'vehicle/list-for-dashboard',
    ordersList: 'order/get-list',
    refuseWaiting: 'order/cancel',
    requestReplacement: 'order/executor-replace',
    setCustomIdentifier: 'order/set-custom-identifier',
    appoint: 'order/appoint',
    monitorMyProblems: 'order/get-list-operator-problems-for-dashboard',
    monitorOperatorProblems: 'order/get-list-actual-problems-for-dashboard',
    monitorUserProblems: 'order/get-list-actual-user-problems-for-dashboard',
    monitorTakeInAWork: 'order/take-in-work-by-operator-for-dashboard',
    sendNotification: 'order/send-notification',
    cancelSos: 'order/cancel-sos',
  },
  registries: {
    getRegistries: 'registries/get-list',
    getRegistriesDetails: 'registries/get-details',
    attachFiles: 'registry-files/attach',
    reform: 'registry/reform',
    appointNumber: '/registries/appoint-number',
  },
  changelog: {
    list: 'journal/get-list',
  },
  agent: {
    add: 'agent/add',
    update: 'agent/update',
    list: 'agent/list',
    details: 'agent/get-details',
  },
  documents: {
    list: 'order-document/get-list',
  },
  contracts: {
    getItem: 'platform-document/get-item',
    list: 'platform-document/get-list',
    save: 'platform-document/save',
  },
  tariff: {
    list: 'tariff/list',
    hourlyAdd: 'tariff/hourly/add',
    fixedAdd: 'tariff/fixed/add',
    details: 'tariff/item',
    appoint: 'tariff/appoint',
  },
  settings: {
    getInterfaceSettings: 'user/ui-settings-get',
    saveInterfaceSettings: 'user/ui-settings-save',
    getNotificationSettings: 'user/notifications-settings',
    saveNotificationSettings: 'user/save-notifications-settings',
  },
  contragents: {
    clients: 'client/list',
    clientScoring: 'client/request-scorinng',
    producers: 'producer/list',
    clientMainInfo: 'client/profile',
    clientBalance: 'client/balance-details',
    clientServiceInfo: 'client/service-info',
    producerServiceInfo: 'producer/service-info-get',
    clientChangeServiceInfo: 'client/change-service-info',
    producerChangeServiceInfo: 'producer/service-info-save',
    clientCheckData: 'client/check-data',
    clientApprove: 'client/check',
    clientReject: 'client/reject',
    clientBan: 'client/ban',
    usersList: 'user/get-list',
    holdings: 'holding/list',
    producerApprove: 'producer/check',
    producerReject: 'producer/reject',
    producerBan: 'producer/ban',
    producerMainInfo: 'producer/main-info-get',
    producerExtraInfo: 'producer/extra-info-get',
    producerGenericContract: 'producer/generate-contract-file',
    producerCheckData: 'producer/check-data',
    producerFinance: 'finance/planned-income',
    user: 'user/get-info',
    createHolding: 'holding/create',
    clientRestrictionChange: 'client/restriction-change',
    producerRestrictionChange: 'producer/restriction-change',
  },
  contour: {
    details: 'contour/get-details',
    add: 'contour/add',
    list: 'contour/list',
    update: 'contour/update',
  },
  register: {
    requestCode: 'api/contractor/registration/phone/request-code',
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

  static get contragents() {
    return API_PATHS.contragents;
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

  static get contracts() {
    return API_PATHS.contracts;
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

  static get trailer() {
    return API_PATHS.trailer;
  }

  static get registries() {
    return API_PATHS.registries;
  }

  static get documents() {
    return API_PATHS.documents;
  }

  static get changelog() {
    return API_PATHS.changelog;
  }

  static get tariff() {
    return API_PATHS.tariff;
  }

  static get agent() {
    return API_PATHS.agent;
  }

  static get contour() {
    return API_PATHS.contour;
  }

  static get register() {
    return API_PATHS.register;
  }

  //contour
}

export { ApiConstants };
