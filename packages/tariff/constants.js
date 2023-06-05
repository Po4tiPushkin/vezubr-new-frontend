export const TARIFF_HOURLY_DEFAULT_SERVICE = [];

export const TARIFF_HOURLY_DEFAULT_MOSCOW_SERVICE = [];

export const TARIFF_HOURLY_DEFAULT_MAIN_SERVICE = [];

export const TARIFF_LOADERS_DEFAULT_SERVICE = [];

export const TARIFF_LOADERS_DEFAULT_MAIN_SERVICE = [1405];

export const TARIFF_LOADERS_DEFAULT_MOSCOW_SERVICE = [];

export const TARIFF_FIXED_DEFAULT_SERVICE = [];

export const TARIFF_FIXED_DEFAULT_MAIN_SERVICE = [1550, 1410];

export const TARIFF_FIXED_DEFAULT_PARAMS = ['max_downtime']

export const TARIFF_FIXED_MAX_DOWN_TIME_FREE = 'max_downtime';

export const TARIFF_MILEAGE_DEFAULT_MAIN_SERVICE = [1415, 1410, 1035];

export const TARIFF_MILEAGE_DEFAULT_PARAMS = ['max_downtime']

export const TARIFF_MILEAGE_BASEWORKS = [
  {
    article: 'mileage',
    unitValue: 'км.',
    type: 'distance',
    name: 'Пробег'
  },
  {
    article: 'workMinutes',
    unitValue: 'мин.',
    type: 'time',
    name: 'Простой на всех точках'
  },
  {
    article: 'pointsCount',
    unitValue: 'шт',
    type: 'number',
    name: 'Адресов'
  }
]

export const TARIFF_DEFAULT_SERVICE_VALUES = {
};

export const TARIFF_DEFAULT_HOURS_WORKS = [
  {
    hoursWork: 7,
    hoursInnings: 1,
  },
];

export const TARIFF_DEFAULT_DISTANCE_COSTS = [
  {
    distance: 10
  }
]

export const TARIFF_TABLE_CONFIG = {
  vehicleWidth: 300,
  bodyTypesWidth: 220,
  baseWorkWidth: 150,
  serviceWidth: 110,
};

export const TARIFF_TYPES = {
  1: 'Почасовой',
  2: 'ПРР',
  3: 'Фиксированный',
  4: 'Пробег'
};

export const ROUTE_TYPES = {
  0: 'Точка-Точка',
  1: 'Город-Город',
}

export const ROUTE_TYPES_ARRAY = [
  {
    value: 0,
    label: 'Точка-Точка',
    disabled: APP == 'dispatcher'
  },
  {
    value: 1,
    label: 'Нас. пункт - Нас. пункт'
  },
]

export const ROUTE_TYPES_CONVERT = {
  'route_points': 0,
  'route_cities': 1,
}
export const TARIFF_DISABLED_LOADING_TYPES = [];

export const TARIFF_DISTANCE_VALUES = [
  10,
  20,
  30,
  40,
  50,
  100,
]

export const SERVICES_TO_SPECIALITIES = [
  {
    article: 1405,
    name: 'additionalWork',
  }
]

export const SPEICALITIES_TO_SERVICES = {
  [1405]: [2021, 2024, 2027, 2030, 2033, 2036, 2039]
}

export const TARIFF_HOURLY_ADDITIONAL_SERVICES = [
  1025, 1026, 1035, 1080, 1091, 1092, 1093, 1101, 1102, 1300, 1305, 1310, 1319, 1405
]

export const TARIFF_FIXED_ADDITIONAL_SERVICES = [
  1025, 1035, 1101, 1102, 1300, 1305, 1310, 1319,
]

export const TARIFF_MILEAGE_ADDITIONAL_SERVICES = [
  1091, 1092, 1093, 1101, 1102, 1300, 1305, 1310, 1319
]

export const TARIFF_SPECIALISTS_ADDITIONAL_SERVICES = [

];
export const SERVICE_PARAMS = {
  max_downtime: {
    parameter: 'max_downtime',
    unitValue: 'мин.',
    name: 'Бесплатное время простоя'
  }
}
