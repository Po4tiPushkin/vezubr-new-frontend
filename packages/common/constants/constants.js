import t from '../localization';
import React from 'react';
import timezones from 'moment-timezone';
import { CONTOUR_MAIN_ID, CONTOUR_COMMISSION_PAYER, CONTOUR_STATUSES, CONTOUR_TYPES } from './contour';

const TIMEZONES = timezones.tz.names();

const ROLES = {
  2: t.reg('customer'),
  4: t.reg('dispatcher'),
  1: t.reg('contractor'),
}

const CUSTOMER_TYPES = {
  client: {
    title: t.reg('customer').toUpperCase(),
    values: [
      {
        title: t.reg('privatePerson'),
        id: 1,
        active: false,
        urlKeyName: 'registerIndividual',
        keys: [
          {
            title: t.reg('fName'),
            name: 'name',
            type: 'text',
            className: '',
            error: t.reg('errors.fName'),
          },
          {
            title: t.reg('lName'),
            type: 'text',
            name: 'surname',
            className: 'margin-top-16',
            error: t.reg('errors.lName'),
          },
          {
            title: t.reg('email'),
            type: 'email',
            name: 'email',
            className: 'margin-top-16',
            error: t.reg('errors.email'),
          },
          {
            title: t.reg('password'),
            type: 'password',
            name: 'password',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
          {
            title: t.reg('rPassword'),
            type: 'password',
            name: 'cPassword',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
        ],
      },
      {
        title: t.reg('corporateClient'),
        id: 2,
        active: true,
        urlKeyName: 'registerCorporate',
        keys: [
          {
            title: t.reg('innIp'),
            name: 'inn',
            type: 'text',
            className: '',
            error: t.reg('errors.inn'),
          },
          {
            title: t.reg('fName'),
            name: 'name',
            type: 'text',
            className: 'margin-top-16',
            error: t.reg('errors.name'),
          },
          {
            title: t.reg('lName'),
            type: 'text',
            name: 'surname',
            className: 'margin-top-16',
            error: t.reg('errors.surname'),
          },
          {
            title: t.reg('email'),
            type: 'email',
            name: 'email',
            className: 'margin-top-16',
            error: t.reg('errors.email'),
          },
          {
            title: t.reg('password'),
            type: 'password',
            name: 'password',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
          {
            title: t.reg('rPassword'),
            type: 'password',
            name: 'cPassword',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
        ],
      },
    ],
  },
  producer: {
    title: t.reg('contractor').toUpperCase(),
    values: [
      {
        title: t.reg('truckOwner'),
        id: 3,
        active: true,
        urlKeyName: 'truckOwner',
        keys: [
          {
            title: t.reg('innIp'),
            name: 'inn',
            type: 'text',
            className: '',
            error: t.reg('errors.inn'),
          },
          {
            title: t.reg('fName'),
            name: 'name',
            type: 'text',
            className: 'margin-top-16',
            error: t.reg('errors.name'),
          },
          {
            title: t.reg('lName'),
            type: 'text',
            name: 'surname',
            className: 'margin-top-16',
            error: t.reg('errors.lName'),
          },
          {
            title: t.reg('email'),
            type: 'email',
            name: 'email',
            className: 'margin-top-16',
            error: t.reg('errors.email'),
          },
          {
            title: t.reg('password'),
            type: 'password',
            name: 'password',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
          {
            title: t.reg('rPassword'),
            type: 'password',
            name: 'cPassword',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
        ],
      },
      {
        title: t.reg('loadersService'),
        id: 4,
        active: false,
        urlKeyName: 'loadersService',
        keys: [
          {
            title: t.reg('innIp'),
            name: 'inn',
            type: 'text',
            className: '',
            error: t.reg('errors.inn'),
          },
          {
            title: t.reg('fName'),
            name: 'name',
            type: 'text',
            className: 'margin-top-16',
            error: t.reg('errors.fName'),
          },
          {
            title: t.reg('lName'),
            type: 'text',
            name: 'surname',
            className: 'margin-top-16',
            error: t.reg('errors.lName'),
          },
          {
            title: t.reg('email'),
            type: 'email',
            name: 'email',
            className: 'margin-top-16',
            error: t.reg('errors.email'),
          },
          {
            title: t.reg('password'),
            type: 'password',
            name: 'password',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
          {
            title: t.reg('rPassword'),
            type: 'password',
            name: 'cPassword',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
        ],
      },
    ],
  },
  operator: {
    title: t.reg('operator').toUpperCase(),
    values: [
      {
        title: t.reg('truckOwner'),
        id: 3,
        active: true,
        urlKeyName: 'truckOwner',
        keys: [
          {
            title: t.reg('innIp'),
            name: 'inn',
            type: 'text',
            className: '',
            error: t.reg('errors.inn'),
          },
          {
            title: t.reg('fName'),
            name: 'name',
            type: 'text',
            className: 'margin-top-16',
            error: t.reg('errors.name'),
          },
          {
            title: t.reg('lName'),
            type: 'text',
            name: 'surname',
            className: 'margin-top-16',
            error: t.reg('errors.lName'),
          },
          {
            title: t.reg('email'),
            type: 'email',
            name: 'email',
            className: 'margin-top-16',
            error: t.reg('errors.email'),
          },
          {
            title: t.reg('password'),
            type: 'password',
            name: 'password',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
          {
            title: t.reg('rPassword'),
            type: 'password',
            name: 'cPassword',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
        ],
      },
      {
        title: t.reg('loadersService'),
        id: 4,
        active: false,
        urlKeyName: 'loadersService',
        keys: [
          {
            title: t.reg('innIp'),
            name: 'inn',
            type: 'text',
            className: '',
            error: t.reg('errors.inn'),
          },
          {
            title: t.reg('fName'),
            name: 'name',
            type: 'text',
            className: 'margin-top-16',
            error: t.reg('errors.fName'),
          },
          {
            title: t.reg('lName'),
            type: 'text',
            name: 'surname',
            className: 'margin-top-16',
            error: t.reg('errors.lName'),
          },
          {
            title: t.reg('email'),
            type: 'email',
            name: 'email',
            className: 'margin-top-16',
            error: t.reg('errors.email'),
          },
          {
            title: t.reg('password'),
            type: 'password',
            name: 'password',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
          {
            title: t.reg('rPassword'),
            type: 'password',
            name: 'cPassword',
            className: 'margin-top-16',
            error: t.reg('errors.password'),
          },
        ],
      },
    ],
  },
};

const ORDER_CATEGORIES_GROUPPED = [
  {
    value: 1,
    title: 'Грузовая',
  },
  {
    value: 4,
    title: 'Грузопассажирская',
  },
  {
    value: 3,
    title: 'Специальная',
    selectable: false,
    children: [
      {
        value: 2,
        title: 'Манипулятор',
      },
      {
        value: 5,
        title: 'Магистральный трал'
      },
      {
        value: 6,
        title: 'Цистерна'
      },
      {
        value: 7,
        title: 'Самосвал'
      },
      {
        value: 8,
        title: 'Автовоз'
      },
      {
        value: 9,
        title: 'Контейнеровоз'
      },
    ]
  },
];

const ORDER_CATEGORIES_GROUPPED_TRAILER = [
  {
    value: 1,
    title: 'Грузовая',
  },
  {
    value: 3,
    title: 'Специальная',
    selectable: false,
    children: [
      {
        value: 5,
        title: 'Магистральный трал'
      },
      {
        value: 6,
        title: 'Цистерна'
      },
      {
        value: 7,
        title: 'Самосвал'
      },
      {
        value: 8,
        title: 'Автовоз'
      },
      {
        value: 9,
        title: 'Контейнеровоз'
      },
    ]
  },
];

const ORDER_CATEGORIES_GROUPPED_VEHICLE = [
  {
    value: 1,
    title: 'Грузовая',
  },
  {
    value: 4,
    title: 'Грузопассажирская',
  },
  {
    value: 3,
    title: 'Специальная',
    selectable: false,
    children: [
      {
        value: 2,
        title: 'Манипулятор',
      },
    ]
  },
];

const PATTERNS = {
  password: /^(?=.*[A-Za-z])(?=.*\d)[^]{6,}$/,
  phone: '',
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  emailNew: /^([\d\w])+([\d\w".+\-"])*@([\d\w"\-"])*\.([\d\w\."\-"])*[\d\w]$/,
  userName: /[' ', ',', '.', ':', ';']/g,
};

const VEHICLE_BODY_GROUPS = {
  1: 'Закрытый',
  2: 'Бортовой',
  3: 'Рефрижератор',
  4: 'Специализированный',
};

const VEHICLE_BODY_TYPES = {
  1: ['3', '4', '8'],
  2: ['1'],
  3: ['2'],
  4: ['10', '11', '12', '13', '14'],
};

const VEHICLE_BODY_GROUPS_BODY_TYPES = {
  1: [3, 4, 7, 8],
  2: [1],
  3: [2],
  4: [10, 11, 12, 13, 14],
};

const STATUS_COLORS = {
  1: 'yellow',
  2: 'blue',
  3: 'orange',
  4: 'orange2',
  5: 'grey',
  6: 'red',
  8: 'red',
  7: 'grey',
};
const ORDERS_STAGES = {
  selection: {
    name: t.nav('selection'),
    values: [102, 103, 201, 800, 801, 802],
  },
  selectionEnding: {
    name: t.nav('selectionEnding'),
    values: [106, 107],
  },
  execution: {
    name: t.nav('execution'),
    values: [301, 302, 303, 304, 305, 306, 307, 803, 804],
  },
  paperCheck: {
    name: t.nav('paperCheck'),
    values: [402, 403, 501, 502, 503, 504, 505],
  },
};

const ORDERS_STAGES_FILTERS = {
  selection: {
    name: t.nav('selection'),
    values: [102, 201],
  },
  execution: {
    name: t.nav('execution'),
    values: [301, 302, 303, 304, 305, 306, 307, 310],
  },
  paperCheck: {
    name: t.nav('paperCheck'),
    values: [402, 501],
  },
  settlments: {
    name: t.nav('Взаиморасчеты'),
    values: [503, 504, 505],
  },
  canceled: {
    name: t.nav('Отмененные'),
    values: [800, 801, 802, 803, 804],
  },
  closed: {
    name: t.nav('Закрытые'),
    values: [900, 901],
  },
};

const VEHICLE_CONSTRUCTION_TYPE = {
  1: 'Монорамный',
  2: 'Полирамный',
};

const CONTRAGENT_STATUS = {
  1: 'На регистрации, номер телефона подтвержден',
  2: 'Регистрация отклонена',
  3: 'Зарегистрирован',
  4: 'Заблокирован',
  5: 'Удален',
  6: 'На регистрации, номер телефона не подтвержден',
  7: 'На проверке',
};

const CONTRAGENT_CONTOUR_STATUS = {
  1: 'Новый',
  2: 'Подтвержденный',
  3: 'Удален',
};

const UNIT_UI_STATES = {
  1: 'На проверке',
  2: 'Нет рейсов',
  3: 'Есть рейсы',
  4: 'На рейсе',
  5: 'Работа приостановлена',
  6: 'Корректировка',
  7: 'Эксплуатация завершена',
  8: 'Отказано в регистрации',
};

const RATINGS = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};
// Enum: "to_start_at" "order_id" ,"producer_name" "executor_surname" "driver_id" "current_position" "plate_number"

const LOADERS_DEF_FORMAT = {
  toStartAtDate: undefined,
  toStartAtTime: undefined,
  loadersCount: undefined,
  address: {},
  comment: undefined,
  requiredContours: [],
};

const ORDER_DEF_FORMAT = {
  orderType: 1,
  toStartAtDate: undefined,
  toStartAtTime: undefined,
  orderIdentifier: undefined,
  comment: undefined,
  sanitaryBookRequired: undefined,
  sanitaryPassportRequired: undefined,
  rampCompatibilityRequired: undefined,
  palletJackIsRequired: undefined,
  fasteningIsRequired: undefined,
  hydroliftRequired: undefined,
  insurance: false,
  vehicleType: { key: '', val: { name: '' } },
  bodyTypes: ['3', '4', '8'],
  bodyGroup: { key: 1, val: 'Закрытый' },
  assessedCargoValue: undefined,
  cargoCategoryId: { key: '', val: '' },
  conicsIsRequired: undefined,
  loadersCountRequired: 0,
  loadersRequiredOnAddress: { key: '', val: '' },
  loadersTime: undefined,
  addresses: [],
  maxHeightFromGroundInCm: undefined,
  minVehicleBodyLengthInCm: undefined,
  minVehicleBodyHeightInCm: undefined,
  vehicleMinHeight: undefined,
  vehicleMinWidth: undefined,
  requiredPassesDetectionMode: 1,
  contourTree: [],
  requiredPasses: [],
  requiredContours: [],
  requiredProducers: [],
};

const ADDRESS_DEF_FORMAT = {
  addressString: '',
  contacts: '',
  email: '',
  phone: '',
  comment: '',
  latitude: '',
  longitude: '',
  secondPhone: '',
  loadingType: { key: 1, val: 'Задняя' },
  attachedFiles: [],
  titleForFavourites: '',
};

const USER_DEF_FORMAT = {
  name: '',
  surname: '',
  patronymic: '',
  type: { key: '', val: '' },
  email: '',
  phone: '',
  timezone: '',
  employeeRoles: [],
};

const PRODUCER_USER_DEF_FORMAT = {
  name: '',
  surname: '',
  patronymic: '',
  type: { key: '', val: '' },
  email: '',
  phone: '',
  digitalSignatureValidTill: '',
  digitalSignatureIssuedAtDate: '',
  digitalSignatureType: { key: '', val: '' },
  hasDigitalSignature: 0,
  timezone: '',
};

const OPERATOR_USER_DEF_FORMAT = {
  name: '',
  surname: '',
  patronymic: '',
  type: { key: '', val: '' },
  email: '',
  phone: '',
  digitalSignatureValidTill: '',
  digitalSignatureIssuedAtDate: '',
  digitalSignatureType: { key: '', val: '' },
  hasDigitalSignature: 0,
  timezone: '',
};

const DOCUMENTS_CATEGORY = {
  1: 'Транспортная накладная',
  2: 'маршрутный лист',
  3: 'Акт ПРР',
  4: 'Фотография чек(ов) — платная парковка, стоянка, и т.п.',
  5: 'Дополнительные документы к остановному комплекту, отправляются водителем сразу или в течение 12 часов с момента завершения рейса',
  6: 'Произвольные фотографии в процессе исполнения рейса',
  7: 'Страховой полис',
};

const EMPLOYEE_SYSTEM_STATES = {
  1: 'Зарегистрирован',
  2: 'Заблокирован',
  3: 'Удален',
  4: 'Не подтвержден',
  5: 'На этапе регистрации',
  6: 'Проверка статуса',
};

const ORDER_TYPE_STATES = {
  1: 'город',
  2: 'межгород',
  3: 'ПРР',
};

const DROPDOWNTIME = {
  [-1]: t.settings('notNotify'),
  [15 * 60]: `15 ${t.settings('min')}`,
  [30 * 60]: `30 ${t.settings('min')}`,
  [45 * 60]: `45 ${t.settings('min')}`,
};

const WEEK_DAYS = {
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Суббота',
  7: 'Воскресенье',
}

const WEEK_DAYS_SHORTENED = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
  7: 'Вс',
}

const DROPDOWNPERIOD = {
  1: t.order('filters.today'),
  2: t.order('filters.yesterday'),
  3: t.order('filters.forWeek'),
  4: t.order('filters.forMonth'),
  5: t.order('filters.forYear'),
};

const DROPDOWNPERIOD_PRODUCER_ORDERS = {
  1: t.order('filters.today'),
  2: t.order('filters.yesterday'),
  ...DROPDOWNPERIOD,
};

const DROPDOWNPERIOD_OPERATOR_ORDERS = {
  1: t.order('filters.today'),
  2: t.order('filters.yesterday'),
  ...DROPDOWNPERIOD,
};

const LANGUAGE = {
  1: 'RU',
  2: 'EN',
};

const PRODUCER_TRANSPORT_DEF_FORMAT = {
  bodyHeightInCm: undefined,
  bodyLengthInCm: undefined,
  bodyType: { key: '', val: '' },
  bodyWidthInCm: undefined,
  geozonePasses: [],
  hasConics: 0,
  hasFastening: 0,
  hasHydrolift: 0,
  hasPalletsJack: 0,
  hasSanitaryPassport: 0,
  heightFromGroundInCm: 0,
  isRampCompatible: 0,
  isRearLoadingAvailable: 1,
  isSideLoadingAvailable: 0,
  isTopLoadingAvailable: 0,
  liftingCapacityInKgTransport: undefined,
  liftingCapacityMin: 0,
  markAndModel: undefined,
  nightParkingAddress: undefined,
  nightParkingLatitude: undefined,
  nightParkingLongitude: undefined,
  ownerType: { key: '', val: '' },
  useBodyVolume: false,
  palletsCapacity: { key: '', val: '' },
  plateNumber: undefined,
  registrationCertificateFrontSideFileId: 0,
  registrationCertificateReverseSideFileId: 0,
  rentContractFile: undefined,
  rentContractFinishAtDate: undefined,
  rentContractStartAtDate: undefined,
  sanitaryPassportExpiresAtDate: undefined,
  vin: undefined,
  yearOfManufacture: { key: '', val: '' },
  linkedDriversIds: [],
  photoFiles: [],
};

const PRODUCER_DRIVER_DEF_FORMAT = {
  applicationPhone: undefined,
  canWorkAsLoader: 0,
  contactPhone: undefined,
  dateOfBirth: undefined,
  driverLicenseDateOfBirth: undefined,
  driverLicenseExpiresAtDate: undefined,
  driverLicenseFile: undefined,
  driverLicenseIssuedAtDate: undefined,
  driverLicenseIssuedBy: undefined,
  driverLicenseName: undefined,
  driverLicenseId: undefined,
  driverLicensePatronymic: undefined,
  driverLicensePlaceOfBirth: undefined,
  driverLicenseSurname: undefined,
  emergencyContactName: undefined,
  emergencyContactPhone: undefined,
  factAddress: undefined,
  hasSanitaryBook: 0,
  homePhone: undefined,
  name: undefined,
  neverDelegate: 0,
  passportFile: undefined,
  passportIssuedAtDate: undefined,
  passportIssuedBy: undefined,
  passportId: undefined,
  passportUnitCode: undefined,
  patronymic: undefined,
  photoFile: undefined,
  placeOfBirth: undefined,
  registrationAddress: undefined,
  sanitaryBookExpiresAtDate: undefined,
  surname: undefined,
  passportRusResident: true,
  dlRusResident: true,
};

const PRODUCER_TRACTOR_DEF_FORMAT = {
  geozonePasses: undefined,
  registrationCertificateFrontSideFile: undefined,
  registrationCertificateReverseSideFile: undefined,
  markAndModel: undefined,
  plateNumber: undefined,
  yearOfManufacture: { key: '', val: '' },
  ownerType: { key: '', val: '' },
  rentContractFile: undefined,
  rentContractFinishAtDate: undefined,
  rentContractStartAtDate: undefined,
  linkedDriversIds: [],
  photoFile: undefined,
};

const PRODUCER_WAGON_DEF_FORMAT = {
  tractorId: undefined,
  trailerId: undefined,
  effectiveFromDate: undefined,
  nightParkingAddress: undefined,
  nightParkingLatitude: undefined,
  nightParkingLongitude: undefined,
  linkedDriversIds: [],
};

const LOADERS_SYSTEM_STATE = {
  STATE_REGISTERED: 'На проверке',
  STATE_BANNED: 'Забанен',
  STATE_DELETED: 'Удален',
  STATE_NOT_VERIFIED: 'Не подтвержден',
  STATE_ON_REGISTRATION: 'В процессе регистрации',
  STATE_CHECK: 'На проверке',
};

const ORDER_REQUIREMENTS = [
  'rampCompatibilityRequired',
  'palletJackRequired',
  'conicsRequired',
  'conicsIsRequired',
  'isCornerPillarRequired',
  'hydroliftRequired',
  'palletJackIsRequired',
  'isThermograph',
  'isChainRequired',
  'isStrapRequired',
  'isTarpaulinRequired',
  'isNetRequired',
  'isWheelChockRequired',
  'isGPSMonitoringRequired',
  'isWoodenFloorRequired',
  'isDoppelstockRequired',
  'cornerPillarRequired',
  'chainRequired',
  'strapRequired',
  'tarpaulinRequired',
  'netRequired',
  'wheelChockRequired',
  'gPSMonitoringRequired',
  'woodenFloorRequired',
  'doppelstockRequired',
  'thermograph',
  'isDriverLoaderRequired',
  'isTakeOutPackageRequired',
  'sanitaryBookRequired',
  'sanitaryPassportRequired',
]

const SCHEDULE_ENTITIES = {
  vehicles: 'Vehicle',
  drivers: 'Drivers',
}

export {
  CUSTOMER_TYPES,
  PATTERNS,
  ORDER_DEF_FORMAT,
  ADDRESS_DEF_FORMAT,
  LOADERS_DEF_FORMAT,
  USER_DEF_FORMAT,
  TIMEZONES,
  DROPDOWNPERIOD,
  DROPDOWNTIME,
  LANGUAGE,
  DOCUMENTS_CATEGORY,
  EMPLOYEE_SYSTEM_STATES,
  ORDER_TYPE_STATES,
  PRODUCER_TRANSPORT_DEF_FORMAT,
  PRODUCER_DRIVER_DEF_FORMAT,
  PRODUCER_TRACTOR_DEF_FORMAT,
  PRODUCER_WAGON_DEF_FORMAT,
  DROPDOWNPERIOD_PRODUCER_ORDERS,
  DROPDOWNPERIOD_OPERATOR_ORDERS,
  RATINGS,
  STATUS_COLORS,
  ORDERS_STAGES,
  PRODUCER_USER_DEF_FORMAT,
  OPERATOR_USER_DEF_FORMAT,
  ORDERS_STAGES_FILTERS,
  LOADERS_SYSTEM_STATE,
  CONTOUR_TYPES,
  CONTOUR_STATUSES,
  CONTRAGENT_CONTOUR_STATUS,
  CONTRAGENT_STATUS,
  VEHICLE_CONSTRUCTION_TYPE,
  UNIT_UI_STATES,
  CONTOUR_MAIN_ID,
  CONTOUR_COMMISSION_PAYER,
  VEHICLE_BODY_GROUPS,
  VEHICLE_BODY_TYPES,
  VEHICLE_BODY_GROUPS_BODY_TYPES,
  ROLES,
  WEEK_DAYS,
  WEEK_DAYS_SHORTENED,
  ORDER_CATEGORIES_GROUPPED,
  ORDER_CATEGORIES_GROUPPED_TRAILER,
  ORDER_CATEGORIES_GROUPPED_VEHICLE,
  ORDER_REQUIREMENTS,
  SCHEDULE_ENTITIES
};
