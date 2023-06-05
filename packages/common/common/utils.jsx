import t from '../localization';
import moment from 'moment';
import _isObject from 'lodash/isObject';
import _omit from 'lodash/omit';
import _pick from 'lodash/pick';
import __pull from 'lodash/pull';
import _cloneDeep from 'lodash/cloneDeep';
import {
  User as UserService,
  Common as CommonService,
  Address as AddressService,
  Contractor as ContractorService,
  Profile as ProfileService,
  CancellationReason as CancellationReasonService
} from '../../services';
import Cookies from './cookies';
import { Ant, showAlert, showConfirm, showError } from '../../elements';

const FILE_SIZE_LIMIT_IN_BYTES = 10485760;

import tr1 from '../assets/img/trucks/1.jpg';
import tr2 from '../assets/img/trucks/2.jpg';
import tr3 from '../assets/img/trucks/3.jpg';
import tr4 from '../assets/img/trucks/4.jpg';
import tr5 from '../assets/img/trucks/5.jpg';
import tr6 from '../assets/img/trucks/6.jpg';
import tr7 from '../assets/img/trucks/7.jpg';
import tr8 from '../assets/img/trucks/8.jpg';
import tr9 from '../assets/img/trucks/9.jpg';

import jwtDecode from 'jwt-decode';
import platformName from './platformName';
import { CONTOUR_MAIN_ID } from '../constants/contour';
import { VEHICLE_BODY_GROUPS, VEHICLE_BODY_TYPES } from '../constants/constants';
import { snakeCaseToCamelCase } from '../utils';

const TRUCK_IMAGES = {
  'до 0.5т': tr1,
  '1т / 7м3 / 3пал.': tr2,
  '1.5т / 9м3 / 4пал.': tr3,
  '1.5т / 14м3 / 6пал.': tr4,
  '3т / 16м3 / 6пал.': tr5,
  '5т / 25м3 / 8пал.': tr6,
  '5т / 36м3 / 15пал.': tr7,
  '10т / 36м3 / 15пал.': tr8,
  '20т / 82м3 / 33пал.': tr9,
};

const TRUCK_IMAGES_BY_ID = {
  1: tr1,
  2: tr2,
  3: tr3,
  4: tr4,
  5: tr5,
  6: tr6,
  7: tr7,
  8: tr8,
  9: tr9,
};

const VEHICLE_CAPACITY_BY_ID = {
  2: {
    length: [1, 4],
    width: [1, 1.5],
    height: [1, 2],
  },
  3: {
    length: [2.5, 4],
    width: [1.5, 2.25],
    height: [1.4, 2.8],
  },
  4: {
    length: [2.6, 6],
    width: [1.75, 2.625],
    height: [1.4, 2.8],
  },
  5: {
    length: [3.8, 8],
    width: [1.9, 2.85],
    height: [1.75, 3.5],
  },
  6: {
    length: [3.8, 8],
    width: [1.9, 2.85],
    height: [1.9, 3.8],
  },
  7: {
    length: [4.6, 10],
    width: [2, 3],
    height: [2, 4],
  },
  8: {
    length: [5.5, 10],
    width: [2.2, 3.3],
    height: [2, 4],
  },
  9: {
    length: [6, 12],
    width: [2.4, 3.6],
    height: [2, 4],
  },
  10: {
    length: [10, 15],
    width: [2.42, 4.63],
    height: [2, 4],
  },
};

const CONTRACTS = {
  1: `Правила пользования платформой ${platformName}`,
  2: 'Договор перевозки',
  3: 'Договор ПРР',
  4: 'Политика конфиденциальности',
  5: 'Согласие на обработку ПД',
  6: 'Договор аренды ТС с экипажем',
  7: 'Согласие собственника ТС',
};

const PASSPORT_SCAN_PARAMS = {
  dob: 'dateOfBirth',
  issueAuthority: 'passportIssuedBy',
  issueAuthorityCode: 'passportUnitCode',
  issuedDate: 'passportIssuedAtDate',
  middleName: 'patronymic',
  number: 'passportId',
  lastName: 'surname',
  firstName: 'name',
};

const LICENCE_SCAN_PARAMS = {
  dob: 'driverLicenseDateOfBirth',
  issueAuthority: 'driverLicenseIssuedBy',
  issueAuthorityCode: 'passportUnitCode',
  issuedDate: 'driverLicenseIssuedAtDate',
  middleName: 'driverLicensePatronymic',
  number: 'driverLicenseId',
  placeOfBirth: 'driverLicensePlaceOfBirth',
  lastName: 'driverLicenseSurname',
  firstName: 'driverLicenseName',
  validUntil: 'driverLicenseExpiresAtDate',
};

const PASSPORT_DELETE_PARAMS = ['idDocType', 'id', 'country', 'uncertainFields'];

const calculatedDistances = {};

moment.locale(t.calendarLocale);

const requiredFieldsForCalculation = [
  'orderType',
  'toStartAtDate',
  'toStartAtTime',
  'addresses',
  'vehicleType',
  'bodyTypes',
  'assessedCargoValue',
  'requiredPassesDetectionMode',
];

const additionalFieldsForCalculation = [
  'sanitaryPassportRequired',
  'palletJackIsRequired',
  'conicsIsRequired',
  'hydroliftRequired',
  'fasteningIsRequired',
];

const integerParsers = ['driverLicenseNumber', 'driverLicenseSerial', 'passportNumber', 'passportSerial'];

const dateParsers = [
  'toStartAtDate',
  'sanitaryPassportExpiresAtDate',
  'driverLicenseDateOfBirth',
  'driverLicenseIssuedAtDate',
];

const removeForCreate = [
  'id',
  'request_id',
  'client_order_id',
  'created_at',
  'start_at',
  'start_at_local',
  'state',
  'assessed_cargo_value',
  'client_comment',
  'client',
  'producer',
  'problem',
  'required_min_body_height_in_cm',
  'required_min_body_length_in_cm',
  'points',
  'driver',
  'vehicle',
  'vehicle_type',
  'created_by',
  'by_routing_sheet',
  'frontend_status',
  'type',
  'address',
  'registered_request_id',
  'registered_request_log_url',
  'transportOrderId',
  'loadersOrderId',
  'problems',
  'isDriverLoaderRequired',
  'by_routing_sheet',
  'key',
  'trackEncoder',
  'trackPolyline',
];

const secondaryRequired = ['loadersRequiredOnAddress'];

const reformatPhotos = [
  'photoFile',
  'photoFiles',
  'registrationCertificateFrontSideFile',
  'registrationCertificateReverseSideFile',
  'rentContractFile',
  'driverLicenseFrontSideFile',
  'driverLicenseReverseSideFile',
  'passportPhotoFile',
  'passportRegistrationFile',
];

const UI_STATES = {
  7: 'unformed',
  5: 'unformed',
  6: 'invalid',
  0: 'default',
  4: 'onDuty',
  1: 'onValidation',
  8: 'invalid',
};

//todo move all text to localization
const UI_STATE_PARAMS = {
  transport: {
    1: {
      title: 'Транспортное средство находится на проверке',
      color: 'yellow',
      description:
        'Просим дождаться результатов проверки. В случае одобрения ТС он становится готовым к работе в системе. В списке ТС желтый индикатор состояния “На проверке” у него пропадает. В  противном случае, ТС принимает статус “Не одобрено” а в списке ТС желтый индикатор заменяется красным.',
      disableEdit: false,
      disableMenu: true,
    },
    'work_suspended': {
      title: 'Эксплуатация транспортного средства временно приостановлена',
      color: 'grey',
      description:
        'После возобновления эксплуатации (опцию можно выбрать в кнопке дополнительных действий), рейсы для данного ТС будут поступать в обычном режиме.',
      disableEdit: true,
      disableMenu: false,
      actions: [
        {
          title: t.buttons('Возобновить эксплуатацию'),
          methodName: 'maintananceAction',
          method: () => { },
        },
      ],
    },
    6: {
      title: 'Транспортное средство не одобрено',
      color: 'red',
      description: 'ТС не одобрено после его проверки. Для уточнения причин Вы можете связаться с оператором.',
      disableEdit: false,
      disableMenu: true,
      actions: [
        {
          title: t.buttons('Отправить на перепроверку'),
          methodName: '',
          method: () => { },
        },
      ],
    },
    7: {
      title: 'Эксплуатация транспортного средства закончена',
      color: 'grey',
      description:
        'Данное ТС не может использоваться в системе в будущем, так как его эксплуатация была приостановлена',
      disableEdit: true,
      disableMenu: true,
    },
  },
  driver: {
    1: {
      title: 'Водитель  находится на проверке',
      color: 'yellow',
      description:
        'Просим дождаться результатов проверки. После одобрения водителя он становится готовым к работе в системе. В списке водителей желтый индикатор состояния “На проверке” у него пропадет. В противном случае, карточка водителя принимает статус “Не одобрено” а в списке водителей желтый индикатор заменяется красным.',
      disableEdit: true,
      disableMenu: true,
    },
    3: {
      disableEdit: true,
      disableMenu: false,
    },
    'work_suspended': {
      title: 'Работа водителя приостановлена',
      color: 'grey',
      description:
        'В данном статусе водителю рейсы недоступны. Возобновить работу водителя в системе можно выбрав опцию "Готов работать"',
      disableEdit: true,
      disableMenu: false,
      actions: [
        {
          title: t.buttons('restore'),
          methodName: 'maintananceAction',
          method: () => { },
        },
      ],
    },
    6: {
      title: 'Водитель не одобрен',
      color: 'red',
      description: 'Водитель не одобрен после его проверки. Для уточнения причин Вы можете связаться с оператором.',
      disableEdit: true,
      disableMenu: true,
      actions: [
        {
          title: t.buttons('Отправить на перепроверку'),
          methodName: '',
          method: () => { },
        },
      ],
    },
  },
  loader: {
    1: {
      title: 'Специалист  находится на проверке',
      color: 'yellow',
      description:
        'Просим дождаться результатов проверки. После одобрения специалиста он становится готовым к работе в системе. В списке специалистов желтый индикатор состояния “На проверке” у него пропадет. В противном случае, карточка специалиста принимает статус “Не одобрено” а в списке специалистов желтый индикатор заменяется красным.',
      disableEdit: true,
      disableMenu: true,
    },
    3: {
      disableEdit: true,
      disableMenu: true,
    },
    5: {
      title: 'Специалист временно недоступен',
      color: 'grey',
      description:
        'В данном статусе специалисту рейсы недоступны. Возобновить работу специалиста в системе можно выбрав опцию "Готов работать"',
      disableEdit: true,
      disableMenu: true,
      actions: [
        {
          title: t.buttons('restore'),
          methodName: 'maintananceAction',
          method: () => { },
        },
      ],
    },
  },
};

const HOST = window.API_CONFIGS[APP].host;
const API_VERSION = window.API_CONFIGS[APP].apiVersion;

const vehicleTypeArrayCycle = (array, types, currentType, category) => {
  if (!Array.isArray(array) || !Array.isArray(types) || types.length < currentType || array.length === 0) {
    return null;
  }
  let tempValue = array[0];
  const type = types[currentType];
  if (!type) {
    return null;
  }
  const { name, val } = type;
  array.forEach((el) => {
    if (el[name] <= val && el[name] >= tempValue[name] && (category ? el.category == category : true)) {
      tempValue = el;
    }
  });
  const finalArr = array.filter((el) => el[name] === tempValue[name] && (category ? el.category == category : true));
  if (finalArr.length === 1) {
    return finalArr[0].id;
  }
  return vehicleTypeArrayCycle(finalArr, types, currentType + 1);
};

export function devLog(...args) {
  if (IS_DEV) {
    console.log(...args);
  }
}

export function setLocalStorageItem(key, data) {
  localStorage.setItem(key, data)
  window.dispatchEvent(new Event('local-storage'))
}

export const monitorEventHandlers = {
  order_status_change: async ({ data, store, replaceData, loadingData }) => {
    const { orderId, status, updatedAt } = data || {};
    const order = store.getItemById(orderId, 'order');
    if (order && status >= 700) {
      order.delete();
      return;
    }
    store.socketStatusChange(orderId, status);
    if (!loadingData.current) {
      loadingData.current = true;
      await Utils.setDelay(3000);
      // await replaceData();
      loadingData.current = false;
    }
  },
  order_problem: async ({ data, store }) => {
    const { orderId, problemType, problemStatus, message, createdAt } = data || {};
    const order = store.getItemById(orderId, 'order');
    if (order) {
      const problem = {
        type: problemType,
        status: problemStatus,
        createdAt,
      };

      if (message) {
        problem.data = {
          startupMessage: message,
          dispute_new_messages: 1,
        };
      }

      const { problems: problemsInput = [] } = order.dataDirty;
      const problems = [...problemsInput];
      if (!problems.find((item) => item.type === problemType)) {
        problems.push(problem);
      }

      order.updateDirtyData({
        problem,
        problems,
      });
    }
  },
  order_published: async ({ data, store }) => {
    const order = data;
    if (!store.getItemById(order.orderId, 'order')) {
      store.setDirtyData([order], 'order');
    }
  },
  loaders_order_shared: async ({ data, store, replaceData, loadingData }) => {
    const order = data;
    if (!store.getItemById(order.orderId, 'order') && !loadingData.current) {
      loadingData.current = true;
      //Данные неполноценные, перезагружаем полностью рейсы
      await Utils.setDelay(3000);
      await replaceData();
      loadingData.current = false;
    }
  },
  gps_track: async ({ data, store }) => {
    const { orderId, vehicleId, latitude, longitude, createdAt } = data;
    const updatedAt = moment(createdAt);
    const updatedAtUnix = updatedAt.format('X');

    const vehicleUpdated = {
      lastGpsLatitude: latitude,
      lastGpsLongitude: longitude,
      // lastGpsSentAt: updatedAtUnix,
      // lastApiCallAt: updatedAtUnix,
    };

    let orderUpdated = false;

    if (orderId) {
      const order = store.getItemById(orderId, 'order');
      if (order) {
        const dataDirty = order.dataDirty;
        const vehicle = dataDirty?.vehicle || {};
        order.updateDirtyData({
          vehicle: {
            ...vehicle,
            ...vehicleUpdated,
          },
        });
        orderUpdated = true;
      }
    }

    if (vehicleId && !orderUpdated) {
      const vehicle = store.getItemById(vehicleId, 'vehicle');
      if (vehicle) {
        vehicle.updateDirtyData(vehicleUpdated);
      }
    }
  },
  transport_order_shared: async ({ data, store, replaceData }) => {
    const order = data;
    if (!store.getItemById(order.id, 'order')) {
      await replaceData();
    }
  },
};

export const orderEventHandlers = {
  gps_track: async ({ data, setVehicleUpdated }) => {
    const detail = data;
    const vehicleId = detail?.vehicleId;

    if (vehicleId && detail?.latitude && detail?.longitude) {
      setVehicleUpdated({
        lastGpsLatitude: detail.latitude,
        lastGpsLongitude: detail.longitude,
      });
    }
  },
  gps_track_update_polyline: async ({ data, setGpsTrackPolylines, setGpsTrackPolyline }) => {
    const { polylines, polyline, encoder } = data || {};

    if (polylines) {
      setGpsTrackPolylines(polylines);
    }

    if (polyline && encoder) {
      setGpsTrackPolyline({
        polyline,
        encoder,
      });
    }
  },
};

const formatParser = 'YYYY-MM-DD';

const DEFAULT_MONITOR_DATES = {
  selection: {
    date: {
      toStartAtDateFrom: moment().format(formatParser),
      toStartAtDateTill: moment().add(1, 'days').format(formatParser),
    },
    option: 1,
  },
  auctions: {
    date: {
      toStartAtDateFrom: moment().format(formatParser),
      toStartAtDateTill: moment().add(30, 'days').format(formatParser),
    },
    option: 8,
  },
  execution: {
    date: {
      toStartAtDateFrom: null,
      toStartAtDateTill: null,
    },
    option: 0,
  },
  'paper-check': {
    date: {
      toStartAtDateFrom: null,
      toStartAtDateTill: null,
    },
    option: 0,
  },
};

const orderHistoryStringValues = [
  'startedExecutionFromWeb',
  'startedExecution',
  'finishExecutionFromWeb',
  'finishExecution',
  'isDocumentsAcceptedByClient',
  'orderManualSharing',
  'offerStatus',
  'orderManualTaken',
  'isCalcDocumentsAcceptedByClient',
  'registryIsAccepted',
];

const orderHistoryCostValues = [
  'finalCalculation',
];

const orderHistoryStateValues = [
  'stateForClient',
  'stateForProducer',
  'uiState'
]

class Utils {
  static get uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static get uiStatesClassNames() {
    return UI_STATES;
  }

  static get uiStateParams() {
    return UI_STATE_PARAMS;
  }

  static get Moment() {
    return moment();
  }

  static isUserClientInProducerContour(contours) {
    return (contours || []).find((contour) => contour.type === 3 && contour.contractor_status === 2);
  }

  static isUserClientHasItsOwnContour(contours) {
    return (contours || []).find((contour) => contour.type === 2);
  }

  static isUserClientGeneralCircuit(contours) {
    return !!(contours || []).find((contour) => contour.type === 1);
  }

  static isUserProducerInClientContour(contours) {
    return (contours || []).find((contour) => contour?.type === 2 && contour.status === 2);
  }

  static isUserProducerHasItsOwnContour(contours) {
    return (contours || []).find((contour) => contour?.type === 3);
  }

  static isUserProducerInContourAggregator(contours) {
    return (contours || []).find((contour) => contour?.id === CONTOUR_MAIN_ID);
  }

  static producerIsBlockedProfile(contractor) {
    let isBlocked = true;

    if (contractor.vehiclesAdded && contractor.driversAdded && contractor.profileFilled) {
      isBlocked = false;
    }

    return isBlocked;
  }

  static get requireFieldsForCalculation() {
    return [].concat(requiredFieldsForCalculation, additionalFieldsForCalculation);
  }

  static logout() {
    Cookies.delete(APP + 'Token');
    Cookies.delete('contrAgent');
    localStorage.removeItem('monitorDates');
    localStorage.removeItem('order');
    localStorage.removeItem('loaderOrder');
    localStorage.removeItem('transportOrder');
    localStorage.removeItem('wagonOrder');
    localStorage.removeItem('driverOrder');
    localStorage.removeItem('vehiclesAdded');
    localStorage.removeItem('extraSave');
    localStorage.removeItem('mainSave');
    localStorage.removeItem('driversAdded');
    localStorage.removeItem('menuAlert');
  }

  static decodeJwt(jwt) {
    return jwtDecode(jwt);
  }

  static isWindows() {
    let os = 'Unknown OS';
    if (navigator.userAgent.indexOf('Win') != -1) {
      return true;
    } else {
      return false;
    }
  }

  static getDecodedUser() {
    const keyCookie = `${APP}Token`;

    let userToken = Cookies.get(keyCookie);

    if (!userToken) {
      return null;
    }

    return Utils.decodeJwt(userToken);
  }

  static setDelay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static formatDate(date, format = 'DD MMMM, YYYY') {
    const d = moment(date).format(format);
    return d === 'Invalid date' ? date : d;
  }

  static getAvailableLoadingTypesByIntersection(bodyTypes, vehicleBodyTypeAvailableLoadingTypes) {
    let loadingTypeIntersection = null;

    for (const bodyTypeId of bodyTypes) {
      const bodyTypeLoadingMap = vehicleBodyTypeAvailableLoadingTypes[bodyTypeId];

      if (loadingTypeIntersection === null) {
        loadingTypeIntersection = { ...bodyTypeLoadingMap };
        continue;
      }

      for (const loadingTypeId of Object.keys(bodyTypeLoadingMap)) {
        if (typeof loadingTypeIntersection[loadingTypeId] === 'undefined') {
          loadingTypeIntersection[loadingTypeId] = bodyTypeLoadingMap[loadingTypeId];
          continue;
        }

        if (!bodyTypeLoadingMap[loadingTypeId]) {
          loadingTypeIntersection[loadingTypeId] = false;
        }
      }
    }

    return Object.keys(loadingTypeIntersection || {})
      .filter((loadingTypeId) => loadingTypeIntersection[loadingTypeId])
      .map((v) => parseInt(v, 10));
  }

  static reformatStringDate(date) {
    if (!date) return false;
    if (_isObject(date)) return Utils.formatDate(date, 'YYYY-MM-DD');
    let d = date.split('.');
    if (d.length) {
      return Utils.validateArrayAsADate(d).reverse().join('-');
    }
    return Utils.formatDate(date, 'YYYY-MM-DD');
  }

  static dateIsInvalid(date, format = 'DD MMMM, YYYY') {
    const d = moment(date).format(format);
    return d === 'Invalid date';
  }

  static validateArrayAsADate(arrDate) {
    arrDate[0] = parseInt(arrDate[0]) > 31 ? 31 : arrDate[0];
    arrDate[1] = parseInt(arrDate[1]) > 12 ? 12 : arrDate[1];
    if (arrDate[2] && arrDate[2].length === 4 && parseInt(arrDate[2]) < 1950) {
      arrDate[2] = 1950;
    } else if (arrDate[2] && arrDate[2].length === 4 && parseInt(arrDate[2]) > 2050) {
      arrDate[2] = parseInt(arrDate[2]);
    }
    return arrDate;
  }

  static async sendLocalStorageToBackend() {
    const localStorage = this.allStorage()
    await ContractorService.setFrontSettings(localStorage)
  }

  static async setLocalStorageFromBackend() {
    const req = await ContractorService.getFrontSettings()
    if (req) {
      Object.entries(req).map(([key, value]) => {
        localStorage.setItem(key, value)
      })
    }
  }

  static allStorage() {
    let values = {}

    Object.keys(localStorage).map((key) => {
      values = {
        ...values,
        [key]: localStorage.getItem(key)
      }
    })

    return values;
  }

  static customDateFormatter(value, format) {
    let splitted = value.includes('-') ? value.split('-').reverse() : value.split('.');
    splitted = Utils.validateArrayAsADate(splitted);
    const v = splitted.slice(0).reverse().join('-');
    if (splitted.length === 3 && splitted[2].length === 4 && !Utils.dateIsInvalid(v)) {
      return Utils.formatDate(v, format);
    }
    return false;
  }

  static deepEqual(object1, object2) {
    if (typeof object1 === 'object' && object1 !== null && typeof object2 === 'object' && object2 !== null) {
      if (Object.keys(object1).length !== Object.keys(object2).length) {
        return false;
      }

      for (const prop in object1) {
        if (object2[prop] === undefined || !Utils.deepEqual(object1[prop], object2[prop])) {
          return false;
        }
      }

      return true;
    }

    if (object1 instanceof Date && object2 instanceof Date) {
      return object1.getTime() === object2.getTime();
    }

    return object1 === object2;
  }

  static concatToFullAddress(val) {
    return [
      val.properties.locality,
      val.properties.streetName,
      val.properties.streetNumber,
      val.properties.postaCode,
    ].filter((v) => v);
  }

  static mapOrderData(reqData) {
    const data = _cloneDeep(reqData);
    const returnData = {};
    for (const k of Object.keys(data)) {
      let val = data[k];
      if (_isObject(data[k])) {
        const toInteger = parseInt(data[k].key);
        if (!isNaN(toInteger)) val = toInteger;
      }

      if (dateParsers.indexOf(k) > -1 || k.toLowerCase().includes('date')) {
        val = !_isObject(val) ? Utils.reformatStringDate(data[k]) : val;
      }

      if (k === 'addresses') {
        val = val.map((address, key) => {
          const { latitude, longitude } = address;
          address.position = key + 1;
          address.longitude = latitude;
          address.latitude = longitude;
          delete address.id;
          delete address.selected;
          delete address.editable;
          delete address.deletable;
          delete address.deleted;
          if (address.attachedFiles && address.attachedFiles.length) {
            address.attachedFiles = address.attachedFiles
              .filter((el) => !!el)
              .map((f) => {
                if (!f.fileName) {
                  f.fileName = f.name;
                  delete f.name;
                }
                if (!f.fileId) {
                  f.fileId = f.file?.id;
                }
                delete f.tmpFile;
                delete f.fileData;
                delete f.file;
                return f;
              });
          }
          return address;
        });
      }

      if (k === 'yearOfManufacture') {
        val = data[k].val;
      }

      if (k === 'address') {
        const { latitude, longitude } = val;
        val.longitude = latitude;
        val.latitude = longitude;
        delete val.id;
        delete val.selected;
        delete val.editable;
        if (val.attachedFiles && val.attachedFiles.length) {
          val.attachedFiles = val.attachedFiles.map((f) => {
            if (f) {
              if (!f.fileName) {
                f.fileName = f.name;
                delete f.name;
              }
              if (!f.fileId) {
                f.fileId = f.file?.id;
              }
              delete f.tmpFile;
              delete f.fileData;
              delete f.file;
            }
            return f;
          });
        }
      }

      if (k === 'loadingType' && _isObject(val)) {
        val = val.key;
      }

      if (k === 'requiredPasses') {
        val = val.reduce((acc, val) => {
          if (val.key !== 0 && val.key) {
            acc.push(val.key);
          }

          return acc;
        }, []);
      }

      if (k.includes('InCm')) {
        val = parseFloat(val) * 100;
      }

      if (k === 'loadersRequiredOnAddress') {
        val = val + 1;
      }

      if (k === 'liftingCapacityInKg') {
        val = Utils.toKg(val);
      }

      if (integerParsers.indexOf(k) > -1) {
        val = parseInt(val);
      }

      if (k.includes('Phone')) {
        val = val ? val.replace(/\D/g, '') : '';
      }

      if (k === 'passportUnitCode' && val && !val.includes('-')) {
        val = `${val.slice(0, 3)}-${val.slice(3, 6)}`;
      }

      if (k === 'assessedCargoValue') {
        val = parseFloat(`${val}`.trim());
      }

      if (k === 'canWorkAsLoader') {
        val = val ? 1 : 0;
      }

      if (k === 'neverDelegate') {
        val = val ? 1 : 0;
      }

      if (val?.saveVal) {
        val = val.saveVal;
      }

      Object.assign(returnData, { [k]: val });
    }

    if (!returnData.insurance) {
      delete returnData.assessedCargoValue;
      delete returnData.cargoCategoryId;
    }

    return returnData;
  }

  static convertOrderDataToEditData(format, data, dictionaries, setDates = false) {
    const omiting = [
      'toStartAtDate',
      'toStartAtTime',
      'vehicleType',
      'bodyTypes',
      'addresses',
      'cargoCategoryId',
      'assessedCargoValue',
      'loadersRequiredOnAddress',
      'loadersTime',
      'loadersCountRequired',
      'required_contour_ids',
      'required_producer_ids',
      'contour_id',
      'requiredPassesDetectionMode',
    ];

    /*	let lroa = {key: '', val: ''};
            if (data.loadersRequiredOnAddress) {
                lroa = {
                    key: data.loadersRequiredOnAddress,
                    val: data.addresses[data.loadersRequiredOnAddress || 1].addressString
                };
            }*/
    if (data.points) {
      data.addresses = [];
      for (const p of Object.values(data.points)) {
        data.addresses.push(p);
      }
    }
    const date = moment(data.start_at_local);
    const bodyGroup = Utils.getVehicleGroupByType(Object.values(data.bodyTypes)[0]);
    const vt = Array.isArray(dictionaries?.vehicleTypes)
      ? dictionaries?.vehicleTypes?.find((v) => v.id === data.vehicleType)?.name
      : false;

    const requiredContours = data?.required_contour_ids || data?.requiredContours || [];
    const requiredProducers = data?.required_producer_ids || data?.requiredContours || [];

    const formatted = {
      toStartAtDate: setDates ? date.format('DD.MM.YYYY') : undefined, //data?.toStartAtDate ? moment(data.toStartAtDate) : date.format('DD.MM.YYYY'),
      toStartAtTime: setDates ? date.format('HH:mm') : undefined,
      bodyType: { key: data.bodyType || data.type, val: dictionaries?.vehicleBodies?.[data.bodyType || data.type] },
      addresses: data.addresses.map((address) => {
        const { latitude, longitude } = address;
        address.addressString = address.addressString || address.address;
        address.longitude = latitude;
        address.latitude = longitude;
        delete address.address;
        return address;
      }),
      requiredContours,
      requiredProducers,
      requiredPassesDetectionMode: data?.requiredPassesDetectionMode || 1,
      vehicleType: {
        key: data?.vehicleType || data?.vehicle_type?.id,
        val: {
          name: data?.vehicleType ? vt : data?.vehicle_type?.name,
        },
      },
      bodyGroup: { key: bodyGroup, val: VEHICLE_BODY_GROUPS[bodyGroup] },
      bodyTypes: Object.values(data.bodyTypes)?.map((el) => el.toString()),
      cargoCategoryId: { key: data.cargoCategoryId, val: dictionaries?.cargoTypes?.[data.cargoCategoryId] },
      assessedCargoValue: data.assessedCargoValue || data.assessed_cargo_value,
      loadersRequiredOnAddress: {
        key: '',
        val: '',
      },
    };
    if (data.request_id) {
      formatted.requestId = data.request_id;
    }
    const omitted = _omit(data, omiting);
    Object.assign(formatted, omitted);
    for (const prop of removeForCreate) {
      delete formatted[prop];
    }

    return formatted;
  }

  static convertLoaderDataToEditData(format, data, setDates = false) {
    const date = moment(data.start_at_local);
    const { latitude, longitude, address } = data.point;
    data.address = {
      longitude: latitude,
      latitude: longitude,
      addressString: address,
    };

    const requiredContours = data?.required_contour_ids || data?.requiredContours || [];
    const requiredProducers = data?.required_producer_ids || data?.requiredContours || [];

    const formatted = {
      toStartAtDate: setDates ? date.format('DD.MM.YYYY') : undefined,
      toStartAtTime: setDates ? date.format('HH:MM') : undefined,
      comment: data.client_comment,
      address: data.address,
      loadersCount: data.loadersCount,
      requiredContours,
      requiredProducers,
    };
    return formatted;
  }

  static convertUserDataToEditData(format, data, contractorTypes) {
    const formatted = Object.assign({}, format);
    const fio = data.fullName.split(' ');
    formatted.name = fio[1];
    formatted.surname = fio[0];
    formatted.patronymic = fio[2];
    formatted.type = { key: data.type, val: contractorTypes[data.type] };
    formatted.email = data.email;
    formatted.phone = data.phone;
    formatted.timezone = data.timezone;
    formatted.employeeRoles = data.employeeRoles;
    return formatted;
  }

  static convertUserDataToEditDataForProducer(format, data, contractorTypes, isMe, digitalSignatureType) {
    const formatted = Object.assign({}, format);
    formatted.name = data?.name || '';
    formatted.surname = data?.surname || '';
    formatted.patronymic = data?.patronymic || '';
    formatted.type = { key: data.type || data.role, val: contractorTypes[data.type || data.role] };
    formatted.email = data.email;
    formatted.phone = data.phone;
    formatted.timezone = data.timezone;
    formatted.digitalSignatureValidTill = data.digitalSignatureValidTill ? moment(data.digitalSignatureValidTill) : '';
    formatted.digitalSignatureIssuedAtDate = data.digitalSignatureIssuedAtDate
      ? moment(data.digitalSignatureIssuedAtDate)
      : '';
    formatted.digitalSignatureType = {
      key: data.digitalSignatureType,
      val: digitalSignatureType[data.digitalSignatureType],
    };
    formatted.hasDigitalSignature = data.hasDigitalSignature || false;
    formatted.employeeRoles = data.employeeRoles;
    return formatted;
  }

  static pickNonEmptyOrderData(data) {
    const returnData = {};
    for (const k of Object.keys(data)) {
      if (Array.isArray(data[k]) && data[k].length > 0) {
        returnData[k] = data[k];
        if (k === 'addresses') {
          returnData[k] = returnData[k].map((address) => {
            if (address.attachedFiles && address.attachedFiles.length) {
              address.attachedFiles.map((f) => {
                if (f && !f.fileName) {
                  f.fileName = f.name;
                  delete f.name;
                }
                return f;
              });
            }
            return address;
          });
        }
      } else if (_isObject(data[k]) && Object.values(data[k]).join('').length > 0) {
        returnData[k] = data[k];
        if (k === 'address' && returnData[k].attachedFiles && returnData[k].attachedFiles.length) {
          delete returnData[k].id;
          delete returnData[k].selected;
          returnData[k].attachedFiles = returnData[k].attachedFiles.map((f) => {
            if (f && !f.fileName) {
              f.fileName = f.name;
              delete f.name;
            }
            return f;
          });
        }
        if ((k === 'vehicleType' && !data[k].key) || k === 'bodyGroup') {
          delete returnData[k];
        }
      } else if (typeof data[k] !== 'undefined' && !Array.isArray(data[k]) && !_isObject(data[k])) {
        returnData[k] = data[k];
      }
    }
    return returnData;
  }

  static formattedProfileForSendData(data) {
    if (data.phone) {
      data.phone = data.phone ? data.phone.replace(/\D/g, '') : '';
    }

    delete data.fullName;
    delete data.id;
    delete data.addressLegal;
    delete data.inn;

    return data;
  }

  static formattedProfileForAdditionalData(data) {
    if (data.documents?.some((item) => item)) {
      data.documents = data.documents?.map(({ fileId, id, documentType, type }) => {
        return {
          fileId: fileId || id,
          documentType: documentType || type,
        };
      });
    }
    return data;
  }

  static serializeProfileSavingData(data) {
    if (data.documents) {
      data.documents = data.documents.reduce((acc, doc) => {
        if (doc.type !== 7) {
          doc.documentType = doc.type;
          doc.fileId = doc?.fileId || doc?.file?.id || (doc.files && doc.files.length ? doc?.files[0]?.id : null);
          acc.push(_pick(doc, ['documentType', 'fileId']));
        }
        return acc;
      }, []);
    }
    if (data.taxationSystem) {
      data.taxationSystem = data.taxationSystem.key;
    }

    if (data?.agentId?.val?.id) {
      data.agentId = data.agentId.val.id;
    }

    if (data.vatRate) {
      data.vatRate = data.vatRate.key;
      //todo: Remove if backend fix issue
      data.vatRate = data.vatRate === '0.00' ? 0 : data.vatRate;
    }
    if (data.logo || data.logoFileId) {
      data.logoFileId = data.logoFileId || data?.logo?.id;
    }
    if (data.phone) {
      data.phone = data.phone ? data.phone.replace(/\D/g, '') : '';
    }
    if (!data.bik) {
      delete data.bik;
    }
    if (!data.checkingAccount) {
      delete data.checkingAccount;
    }
    return _pick(data, [
      'agentId',
      'addressFact',
      'addressPost',
      'checkingAccount',
      'bik',
      'logoFileId',
      'documents',
      'phone',
      'vatRate',
      'taxationSystem',
      'bankName',
      'correspondentAccount',
    ]);
  }

  static reFormatContractorData(contractor, taxationSystem, vatRate) {
    const tx = contractor.taxationSystem;
    let vr = contractor.vatRate;
    //todo: Remove if backend fix issue
    if (!isNaN(tx)) {
      contractor.taxationSystem =
        tx !== null
          ? {
            key: contractor.taxationSystem,
            val: taxationSystem[contractor.taxationSystem],
          }
          : {
            key: '',
            val: '',
          };
    }
    if (!isNaN(vr)) {
      vr = vr === '0.00' ? 1 : 2;
      contractor.vatRate =
        vr !== null
          ? {
            key: vr,
            val: vatRate[vr],
          }
          : {
            key: '',
            val: '',
          };
    }
    return contractor;
  }

  static validateFieldsForCalculation(nonEmpty) {
    let reqFields = requiredFieldsForCalculation;
    if (nonEmpty.loadersCountRequired) {
      reqFields = [].concat(requiredFieldsForCalculation, secondaryRequired);
    }

    if (!nonEmpty.insurance) {
      __pull(reqFields, 'assessedCargoValue');
    }

    const pickRequired = _pick(nonEmpty, reqFields);
    return Object.keys(pickRequired).length === reqFields.length;
  }

  static pickForCalculation(nonEmpty) {
    return _omit(nonEmpty, [
      'requestId',
      'transportOrderId',
      'sanitaryBookRequired',
      'loadersOrderId',
      'status',
      'contourTree',
    ]);
  }

  static reformatAddressData(data, loadingTypes) {
    const address = _cloneDeep(data);
    const { latitude, longitude } = address;
    //const loadingType = loadingTypes[address.loadingType];
    //address.loadingMethod = {val:loadingType, key:address.loadingType};
    address.latitude = longitude;
    address.longitude = latitude;
    // address.secondPhone = address.secondPhone || undefined;
    // address.contactName =  address.contactName || address.contacts;
    // address.contactEmail =  address.contactEmail || address.email;
    return address;
  }

  static removeExtension(fileName) {
    if (!fileName) return false;
    return fileName.replace(/\.[^/.]+$/, '');
  }

  static moneyFormat(amount, divide = 100, noCurrency = false) {
    if (!amount) return 0;
    const numberFormat = new Intl.NumberFormat(t.localizationFormat, t.currency);
    return numberFormat.format(amount / divide).replace('₽', noCurrency ? '' : 'руб.');
  }

  static documentCheckStage(status) {
    return [401, 402, 403, 404, 501, 502, 503, 504, 505].includes(status);
  }

  static checkPendingStatus(status) {
    return [102, 103, 800, 801, 802].includes(status);
    //status >= 101 && status <= 105;
  }

  static stdCompare(a, b) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  }

  static queryString(input = window.location.search) {
    input = input.slice(input.indexOf('?') + 1);
    if (input) {
      return input
        ?.match(/[\w\d%\-!.~'()\*]+=[\w\d%\-!.~'()\*]+/g)
        ?.map((s) => s.split('=').map(decodeURIComponent))
        ?.reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {});
    }
    return {};
  }

  static toQueryString(params = {}) {
    const queryString = Object.keys(params)
      .filter((key) => params[key] !== null && params[key] !== undefined && params[key] !== '')
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    return !queryString ? '' : `?${queryString}`;
  }

  static async uploadFile(file, fileName) {
    if (Utils.bytesToMB(file.size) > Utils.bytesToMB(FILE_SIZE_LIMIT_IN_BYTES)) {
      throw { code: 413, message: t.error(413) };
    }
    const data = new FormData();
    fileName = fileName || Utils.removeExtension(file.name);
    const fileData = {
      fileName: fileName,
    };
    data.append('file', file);
    data.append('filename', fileName);
    const response = await CommonService.uploadFile(data);
    return { fileData, response };
  }

  static concatImageUrl(imageUrl) {
    if (!imageUrl) return null;
    if (APP == 'producer') {
      return `${window.API_CONFIGS[APP].host.slice(0, -1)}${imageUrl}`;
    } else {
      return `${window.API_CONFIGS[APP].host.slice(0, -1)}${imageUrl}`;
    }
  }

  static concatRootImageUrl(imageUrl) {
    if (!imageUrl) return null;
    return `${HOST}${API_VERSION}${imageUrl}`;
  }

  static serializeProducerProfileMain(data) {
    data = _.pick(data, ['addressLegal', 'addressFact', 'addressPost', 'phone', 'agentId', 'vatRate']);
    data.phone = data.phone ? data.phone.replace(/\D/g, '') : '';
    if (data?.agentId?.val?.id) {
      data.agentId = data.agentId.val.id;
    }
    if (data.vatRate) {
      data.vatRate = +data.vatRate.key;
    }

    return data;
  }

  static serializeProducerProfileExtra(data) {
    return _.pick(data, ['logoFile', 'rulesFile', 'authorizedPersonPassportFile', 'ceoOrderFile']);
  }

  static reformatForProducerEssenceEdit(data, bodyTypes, vehicleTypes) {
    data.yearOfManufacture = { key: '', val: data?.yearOfManufacture };

    for (const photoKey of reformatPhotos) {
      if (data[photoKey]) {
        if (
          photoKey === 'registrationCertificateFrontSideFile' ||
          photoKey === 'registrationCertificateReverseSideFile' ||
          photoKey === 'rentContractFile' ||
          photoKey === 'passportPhotoFile' ||
          photoKey === 'passportRegistrationFile' ||
          photoKey === 'driverLicenseFrontSideFile' ||
          photoKey === 'driverLicenseReverseSideFile'
        ) {
          const file = data[photoKey]?.files?.find((el) => el.isActual === 1)?.file;
          data[photoKey] = {
            fileHash: file?.fileHash,
            fileId: file?.id,
          };
        } else if (data[photoKey].map) {
          data[photoKey] = data[photoKey].map((el) => {
            return {
              fileHash: el.fileHash,
              fileId: el.id,
            };
          });
        } else {
          data[photoKey] = {
            fileHash: data[photoKey].fileHash,
            fileId: data[photoKey].id,
          };
        }
      }
    }

    if (data.bodyType) {
      data.bodyType = { key: data.bodyType, val: bodyTypes.find((item) => item.id == data.bodyType)?.title };
    }

    if (typeof data.volume !== 'undefined') {
      data.useBodyVolume = true;
    }

    if (vehicleTypes && vehicleTypes[data.vehicleTypeId]) {
      if (data.vehicleTypeId) {
        data.vehicleTypeId = { key: data.vehicleTypeId, val: vehicleTypes[data.vehicleTypeId] };
      }
    }
    if (data.palletsCapacity) {
      data.palletsCapacity = { key: data.palletsCapacity, val: data.palletsCapacity };
    }
    if (data.hasSanitaryBook === false) {
      data.hasSanitaryBook = 0;
    }

    for (const prop of Object.keys(data)) {
      if (prop.includes('InCm')) {
        data[prop] = parseFloat(data[prop]) / 100 || null;
      }
      if (prop === 'liftingCapacityInKg') {
        data[prop] = Utils.toTon(data[prop], false);
      }
      if (prop.toLowerCase().includes('date') && data[prop]) {
        data[prop] = moment(data[prop]).format('DD.MM.YYYY');
      }
    }

    return data;
  }

  static validatePhotos(data) {
    const obj = {};
    for (const photoKey of reformatPhotos) {
      if (data[photoKey]) {
        obj[photoKey] = data[photoKey];
      }
    }
    return obj;
  }

  static calcm3(data) {
    const { bodyWidthInCm, bodyLengthInCm, bodyHeightInCm } = data;
    if (bodyWidthInCm && bodyLengthInCm && bodyHeightInCm) {
      const val = (
        parseFloat(bodyWidthInCm >= 100 ? bodyWidthInCm / 100 : bodyWidthInCm) *
        parseFloat(bodyLengthInCm >= 100 ? bodyLengthInCm / 100 : bodyLengthInCm) *
        parseFloat(bodyHeightInCm >= 100 ? bodyHeightInCm / 100 : bodyHeightInCm)
      ).toFixed(2);
      const split = val.split('.');
      return split[1] === '00' ? split[0] : val;
    }
    return '';
  }

  static toTon(kg, withString = true) {
    if (!kg) return;
    const ton = kg / 1000;
    return withString ? `${ton} т.` : ton;
  }

  static toKg(ton) {
    if (!ton) return 0;
    return ton * 1000;
  }

  static scrollToFirstError() {
    const elems = document.getElementsByClassName('error');
    if (elems[0]) {
      window.scrollTo(0, elems[0].offsetTop - 100);
    }
  }

  static getImageFullUrl(url) {
    if (!url) return false;
    return `${window.API_CONFIGS[APP].host}${url.replace('/', '')}`;
  }

  static mapCalculationData(calculations) {
    for (const prop of Object.keys(calculations)) {
      for (const sprop of Object.keys(calculations[prop])) {
        if (calculations[prop][sprop] === false) {
          calculations[prop][sprop] = 0;
        }
        if (calculations[prop][sprop] === true) {
          calculations[prop][sprop] = 1;
        }
      }
    }
    return calculations;
  }

  static driverStatus(driver) {
    let status = '';
    if (driver?.driver?.employmentStatus === 'busy') {
      status = "Занят"
    }
    // if (driver.isOnVehicle) {
    //   status = `На ТС ${driver?.sessionVehicle?.plateNumber}`;
    // } else if (driver.busyOnOrder) {
    //   status = 'На рейсе';
    // } else if (driver.onSickLeave) {
    //   status = 'Недоступен';
    // } else if (driver.onTheLine) {
    //   status = 'На линии';
    // } 
    else {
      status = 'Свободен';
    }
    return status;
  }

  static formatMonitorDateFormat(frontend_status) {
    if (!frontend_status) return '';
    let tt = '';
    if (frontend_status) {
      tt = moment
        .unix(frontend_status.state_entered_at)
        .fromNow()
        .replace('назад', '')
        .replace('несколько секунд', 'мин')
        .replace('минуту', 'мин')
        .replace('минуты', 'мин')
        .replace('минут', 'мин')
        .trim();
      tt = tt.split(' ');
      if (tt.length === 1) tt.unshift('1');
      tt = tt.join(' ');
    }
    return tt;
  }

  static setCalcDistance(id, distance) {
    calculatedDistances[id] = distance;
    return calculatedDistances[id];
  }

  static getCalcDistance(id) {
    return calculatedDistances[id];
  }

  static truckImage(name) {
    return TRUCK_IMAGES[name];
  }

  static truckImageById(id) {
    return TRUCK_IMAGES_BY_ID[id];
  }

  static getVehicleCapacityById(id) {
    return (
      VEHICLE_CAPACITY_BY_ID[id] || {
        length: [1, 15],
        width: [1, 4],
        height: [1, 4],
      }
    );
  }

  static getContractNameById(id) {
    return CONTRACTS[id];
  }

  static getVehicleBodyGroups() {
    return VEHICLE_BODY_GROUPS;
  }

  static getVehicleBodyTypesByGroup(id) {
    return VEHICLE_BODY_TYPES[id];
  }

  static getVehicleGroupByType(id) {
    const bodyTypes = Object.values(VEHICLE_BODY_TYPES);
    let index = 0;
    bodyTypes.forEach((el, i) => {
      if (el.find((type) => type == id)) {
        index = ++i;
      }
    });
    return index;
  }

  static passportScanTransform(data) {
    for (const prop in data) {
      if (PASSPORT_SCAN_PARAMS[prop]) {
        if (prop === 'dob') {
          data.dob = Utils.formatDate(data.dob, 'DD.MM.YYYY');
        }
        if (prop === 'issuedDate') {
          data.issuedDate = Utils.formatDate(data.issuedDate, 'DD.MM.YYYY');
        }
        data[PASSPORT_SCAN_PARAMS[prop]] = data[prop];
        delete data[prop];
      }
    }
    for (const prop of PASSPORT_DELETE_PARAMS) {
      delete data[prop];
    }
    return data;
  }

  static LicenceScanTransform(data) {
    for (const prop in data) {
      if (LICENCE_SCAN_PARAMS[prop]) {
        if (prop === 'dob') {
          data.dob = Utils.formatDate(data.dob, 'DD.MM.YYYY');
        }
        if (prop === 'issuedDate') {
          data.issuedDate = Utils.formatDate(data.issuedDate, 'DD.MM.YYYY');
        }
        if (prop === 'validUntil') {
          data.validUntil = Utils.formatDate(data.validUntil, 'DD.MM.YYYY');
        }
        data[LICENCE_SCAN_PARAMS[prop]] = data[prop];
        delete data[prop];
      }
    }
    for (const prop of PASSPORT_DELETE_PARAMS) {
      delete data[prop];
    }
    return data;
  }

  static bytesToMB(bytes) {
    return bytes / 1048576;
  }

  static serializeCheckData(submitData) {
    const reqData = {};
    for (const prop of Object.keys(submitData)) {
      const arr = prop.split(',');
      if (arr.length > 1) {
        const vals = submitData[prop].saveVal.split(' ');
        for (const [index, v] of arr.entries()) {
          if (vals[index]) {
            reqData[v] = vals[index];
          }
        }
      } else if (submitData[prop]?.saveVal) {
        if (prop === 'passportUnitCode') {
          reqData[prop] = submitData[prop]?.saveVal.replace('-', '');
        } else {
          reqData[prop] = submitData[prop]?.saveVal;
        }
      } else if (prop === 'paymentDelay' || prop === 'discount') {
        reqData[prop] = submitData[prop].key;
      } else if (prop === 'regionId') {
        reqData[prop] = submitData[prop]?.key;
      } else if (prop.includes('InCm')) {
        reqData[prop] = parseFloat(submitData[prop]) * 100;
      } else if (prop === 'liftingCapacityInKg') {
        reqData[prop] = Utils.toKg(submitData[prop]);
      } else if (prop === 'holdingId') {
        reqData[prop] = submitData[prop]?.val?.id;
      } else if (prop === 'ownerType' || prop === 'vehicleTypeId') {
        reqData[prop] = parseInt(submitData[prop]?.key);
      } else if (prop.toLowerCase().includes('date') && submitData[prop]) {
        reqData[prop] = Utils.reformatStringDate(submitData[prop]);
      } else if (prop === 'creditLimit') {
        if (isNaN(parseInt(submitData[prop]))) {
          reqData[prop] = null;
        } else {
          reqData[prop] = (_isObject(submitData[prop]) ? submitData[prop].key : submitData[prop]) * 100;
        }
      } else {
        if (_isObject(submitData[prop])) {
          reqData[prop] = submitData[prop].key;
        } else if (submitData[prop]) {
          reqData[prop] = submitData[prop];
        }
        //reqData[prop] = _isObject(submitData[prop]) ? submitData[prop].key : submitData[prop];
      }
    }
    return reqData;
  }

  static getUrlParams(locationSearch) {
    const getParams = {};
    if (locationSearch) {
      locationSearch.replace(/([^?=&]+)(=([^&]*))?/g, function ($0, $1, $2, $3) {
        getParams[$1] = decodeURIComponent($3);
      });
    }
    return getParams;
  }

  static secToMs(seconds) {
    return Number(seconds + '000');
  }

  static async switchToDelegated(contractorId, fromProfile = false) {
    try {
      const { token, role } = await UserService.switchToDelegated(contractorId);

      if (Cookies.get('delegatedApp') && !fromProfile) {
        showError({
          message: 'На данный момент уже открыт ЛК в режиме делегирования',
        });
        return;
      }

      const hostForRedirectAfterRegistration = () => {
        let result = '/';

        if (role === 1) {
          result = window.API_CONFIGS.producer.url;
          if (Cookies.get('producerToken')) Cookies.set('defaultProducerToken', Cookies.get('producerToken'));
          Cookies.set('delegatedApp', 'producer');
          Cookies.set('producerToken', token);
        } else if (role === 2) {
          result = window.API_CONFIGS.client.url;
          if (Cookies.get('clientToken')) Cookies.set('defaultClientToken', Cookies.get('clientToken'));
          Cookies.set('delegatedApp', 'client');
          Cookies.set('clientToken', token);
        } else if (role === 4) {
          result = window.API_CONFIGS.dispatcher.url;
          if (Cookies.get('dispatcherToken')) Cookies.set('defaultDispatcherToken', Cookies.get('dispatcherToken'));
          Cookies.set('delegatedApp', 'dispatcher');
          Cookies.set('dispatcherToken', token);
        }

        return result;
      };

      window.open(hostForRedirectAfterRegistration(), '_blank');
    } catch (e) {
      showError({
        message: e.data.message,
      });
      return;
    }
  }

  static handleDateTimeInput(e) {
    const {
      target: { className, value },
      inputType,
    } = e;
    if (inputType == 'insertText') {
      if (className.includes('ant-calendar-input')) {
        if (value.length == 2 || value.length == 5) {
          e.target.value += '.';
        }
        if (value.length == 13) {
          e.target.value += ':';
        }
      } else if (className.includes('ant-time-picker-panel-input')) {
        if (value.length == 2) {
          e.target.value += ':';
        }
      }
    }
  }

  static endDelegation() {
    Cookies.delete('delegatedApp');
    if (Cookies.get('defaultProducerToken')) {
      Cookies.set('producerToken', Cookies.get('defaultProducerToken'));
      Cookies.delete('defaultProducerToken');
    }
    if (Cookies.get('defaultDispatcherToken')) {
      Cookies.set('dispatcherToken', Cookies.get('defaultDispatcherToken'));
      Cookies.delete('defaultDispatcherToken');
    }
    if (Cookies.get('defaultClientToken')) {
      Cookies.set('clientToken', Cookies.get('defaultClientToken'));
      Cookies.delete('defaultClientToken');
    }
  }

  static scrollOrderToNecessaryPlace(location) {
    const { goTo } = this.queryString(location?.search);
    if (goTo) {
      document.getElementById(goTo)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }

  static getMonitorDates() {
    const monitorDates = JSON.parse(localStorage.getItem('monitorDates'));
    let newMonitorDates = { ...monitorDates };
    if (!monitorDates) {
      newMonitorDates = { ...DEFAULT_MONITOR_DATES };
    } else {
      Object.keys(DEFAULT_MONITOR_DATES).forEach((el) => {
        if (!newMonitorDates[el]?.date) {
          newMonitorDates[el] = { ...DEFAULT_MONITOR_DATES[el] };
        } else if (newMonitorDates[el].option === 1 && newMonitorDates[el].option === 4) {
          switch (newMonitorDates[el].option) {
            case 1:
              newMonitorDates[el] = {
                toStartAtDateFrom: moment().format(formatParser),
                toStartAtDateTill: moment().add(1, 'days').format(formatParser),
              };
            case 4:
              newMonitorDates[el] = {
                toStartAtDateFrom: moment().format(formatParser),
                toStartAtDateTill: moment().add(7, 'days').format(formatParser),
              };
          }
        }
      });
    }
    return newMonitorDates;
  }

  static handleCalculationDetails(performers, userId, orderServices) {
    return performers.map((item) => {
      const newItem = { ...item };
      const userIsVatPayer = item.client.id == userId ? item.client.isVatPayer : item.producer.isVatPayer;
      if (item.finalCalculation) {
        const { costVatRate: vatRate, details, startedAt, completedAt } = item.finalCalculation;
        item.finalCalculation.startedAt = startedAt ? moment(startedAt).format('DD.MM.YYYY HH:mm') : null;
        item.finalCalculation.completedAt = completedAt ? moment(completedAt).format('DD.MM.YYYY HH:mm') : null;
        if (vatRate) {
          if (userIsVatPayer) {
            newItem.finalCalculation.details = details.map((detail) => {
              const { article, costPerItem, summary } = detail;
              detail.vatRate = orderServices[article]?.vatPercent || 0;
              detail.costPerItem = costPerItem + (costPerItem * detail.vatRate) / 100;
              detail.summary = summary + (summary * detail.vatRate) / 100;
              return detail;
            });
            newItem.finalCalculation.costWithVat = newItem.finalCalculation.details.reduce((acc, curr) => {
              acc += curr.summary
              return acc
            }, 0)
          }
        }
      }
      return newItem;
    });
  }

  static getExportCustomColumns(config) {
    let exportFile = [];
    const columns = config.columns || {};
    const defaultColumns = config.defaultColumns || {};
    Object.keys(columns).forEach(el => {
      if (columns[el].extra || !defaultColumns[el] || !columns[el].export) {
        return;
      }
      exportFile.push({ property: el, renamedHeader: columns[el].title })
    })
    return exportFile;
  }

  static async exportList(service, params, config, exportParams = {}) {
    const exportFunc = async (isXls) => {
      let exportFile = []
      if (config) {
        exportFile = this.getExportCustomColumns(config)
      }
      try {
        await service.exportList(
          {
            ...params,
            isWindows: this.isWindows(),
            isXls,
            exportFile,
          },
          exportParams.active || false
        );
        showAlert({
          title: 'Выгрузка инициирована',
          okButtonProps: {
            id: 'export-ok',
          },
          content: t.buttons('exportStarted'),
        });
      } catch (e) {
        console.error(e);
        showError(e);
      }
    }
    showConfirm({
      title: 'Выберите формат выгрузки',
      content: '',
      okText: 'Excel',
      okType: 'default',
      cancelText: 'CSV',
      onOk: async () => {
        await exportFunc(true)
      },
      cancelButtonProps: {
        onClick: async () => {
          Ant.Modal.destroyAll()
          await exportFunc(false)
        }
      },
    })

  }

  static getVehicleType({
    vehicleTypes,
    category,
    liftingCapacityMin = null,
    liftingPalletsMin = null,
    volumeMin = null,
  }) {
    if (
      !Array.isArray(vehicleTypes) ||
      liftingCapacityMin === null ||
      liftingPalletsMin === null ||
      volumeMin === null
    ) {
      return null;
    }
    const types = [
      { name: 'liftingCapacityMin', val: liftingCapacityMin * 1000 },
      { name: 'liftingPalletsMin', val: liftingPalletsMin },
      { name: 'volumeMin', val: volumeMin },
    ];

    return vehicleTypeArrayCycle(vehicleTypes, types, 0, category);
  }

  static getOrderHistoryValue(property, value, dictionaries, extraData) {
    if (orderHistoryStringValues.includes(property)) {
      return t.order(`historyFields.${value}`)
    } else if (orderHistoryCostValues.includes(property)) {
      return this.moneyFormat(value, 100, false)
    } else if (orderHistoryStateValues.includes(property)) {
      switch (property) {
        case 'stateForProducer':
          return dictionaries.performerUiStateForProducer.find(el => el.id === +value)?.title
        case 'stateForClient':
          return dictionaries.performerUiStateForClient.find(el => el.id === +value)?.title
        default:
          return dictionaries.orderUiState.find(el => el.id === +value)?.title
      }
    }
    if (property === "implementerEmployee" && Array.isArray(extraData?.employees)) {
      return extraData.employees.find(el => el.id === +value)?.fullName
    }
    return value;
  }

  static setDefaultParams(paramsName, params, id) {
    const temp = JSON.parse(localStorage.getItem(`defaultParams-${id}`)) || {};
    if (params) {
      Object.keys(params).forEach((el) => {
        if (Array.isArray(params[el])) {
          params[el] = params[el].toString();
        }
      });
    }
    if (temp.params) {
      temp.params[paramsName] = params;
    } else {
      temp.params = {};
      temp.params[paramsName] = params;
    }
    localStorage.setItem(`defaultParams-${id}`, JSON.stringify(temp));
  }

  static getIncrementingId(data, page) {
    return (
      data?.map((el, index) => {
        el.number = index + 1;
        if (+page > 1) {
          el.number = el.number + (page - 1) * 100;
        }
        return el;
      }) || []
    );
  }

  static getDefaultParams(paramsName, settings) {
    if (!paramsName) {
      return {};
    }
    const tempParams = JSON.parse(localStorage.getItem(`defaultParams-${settings?.id}`));
    if (!tempParams || !tempParams?.params || !tempParams?.params?.[paramsName]) {
      const filtersDBRaw = localStorage.getItem(`filters-${settings?.id}`);
      if (filtersDBRaw) {
        const filtersDB = JSON.parse(filtersDBRaw);
        if (
          filtersDB[paramsName] &&
          filtersDB[paramsName]?.default?.['0'] &&
          filtersDB[paramsName]?.default?.['0']?.params
        ) {
          return filtersDB[paramsName].default['0']?.params;
        }
      }
      return {};
    }
    return tempParams.params[paramsName];
  }

  static toFirstLetterUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static async checkForAlreadyExistingAddresses({ latitude, longitude, setExistingAddressModalVisible, client }) {
    const reqData = {};
    if (latitude) {
      reqData.latitude = latitude;
    }
    if (longitude) {
      reqData.longitude = longitude;
    }
    if (client) {
      reqData.contractorId = client;
    } else if (APP == 'dispatcher' && !client) return null;
    let existingAddresses = [];
    try {
      existingAddresses = await AddressService.listByCoordinates(reqData);
      if (existingAddresses.length > 0) {
        setExistingAddressModalVisible(true);
      }
    } catch (e) { }
    return existingAddresses;
  }

  static async fetchAllEmployees() {
    const response = await ProfileService.contractorUsers({ itemsPerPage: 100, page: 1 });
    const dataSource = Object.values(response.items);
    let page = 2;
    const totalPages = Math.ceil(response.itemCount / 100);
    while (page <= totalPages) {
      const newResponse =
        await ProfileService.contractorUsers({ itemsPerPage: 100, page });
      page += 1;
      dataSource.push(...Object.values(newResponse.items));
    }
    return dataSource;
  }

  static async fetchAllGroups() {
    const response = await ProfileService.contractorGroupsList({ itemsPerPage: 100, page: 1 });
    const dataSource = Object.values(response.requestGroups);
    let page = 2;
    const totalPages = Math.ceil(response.itemCount / 100);
    while (page <= totalPages) {
      const newResponse =
        await ProfileService.contractorGroupsList({ itemsPerPage: 100, page });
      page += 1;
      dataSource.push(...Object.values(newResponse.requestGroups));
    }
    return dataSource;
  }

  static async fetchAllCancellationReasons() {
    const response = await CancellationReasonService.list({ itemsPerPage: 100, page: 1 });
    const dataSource = Object.values(response.cancellationReasons);
    let page = 2;
    const totalPages = Math.ceil(response.itemCount / 100);
    while (page <= totalPages) {
      const newResponse =
        await CancellationReasonService.list({ itemsPerPage: 100, page });
      page += 1;
      dataSource.push(...Object.values(newResponse.cancellationReasons));
    }
    return dataSource;
  }

  static formatPhoneString(phone) {
    return phone.replace(/^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/, '+$1($2)$3-$4-$5');
  }
}

export default Utils;
