import { WEEK_DAYS, WEEK_DAYS_SHORTENED } from '@vezubr/common/constants/constants';
import { getNumberAddition } from '@vezubr/common/utils';

export const DEFAULT_LOADING_TYPE = 1;
export const DISABLED_PREFIX = 'disabled__';
export const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';
export const PHONE_MASK = '+7 (999) 999-99-99';

export const ORDER_DOCUMENTS_REQUIRED = {
  city: {
    name: 'Город',
    rule: (article) => article > 1000 && article < 3000,
  },
  intercity: {
    name: 'Межгород',
    rule: (article) => article > 1000 && article < 3000,
  },
  international: {
    name: 'Международные перевозки',
    rule: (article) => article > 3000 && article < 4000,
  },
};

export const UNEDITABLE_ARTICLES = [1400, 1405];

export const ADDITIONAL_TIME_ARTICLES = [1405, 2021, 2024, 2027, 2030, 2033, 2036, 2039];

export const MINIMAL_TIME_ARTICLES = [1400, 2020, 2023, 2026, 2029, 2032, 2035, 2038];

export const SENDABLE_TIME_ARTICLES = [1319];

export const ALL_TIME_ARTICLES = [...ADDITIONAL_TIME_ARTICLES, ...MINIMAL_TIME_ARTICLES, ...SENDABLE_TIME_ARTICLES];

export const LOADERS_KEYS_TO_ARTICLES = {
  loader: 2020,
  rigger: 2023,
  packer: 2026,
  picker: 2029,
  slinger: 2032,
  forklift_operator: 2035,
  stacker: 2038,
};

export const LOADERS_ARTICLES_TO_KEYS = {
  2020: 'loader',
  2023: 'rigger',
  2026: 'packer',
  2029: 'picker',
  2032: 'slinger',
  2035: 'forklift_operator',
  2038: 'stacker',
};

export const LOADERS_ARTICLES = [2020, 2021, 2023, 2024, 2026, 2027, 2029, 2030, 2032, 2033, 2035, 2036, 2038, 2039];

export const ORDER_SERVICES_CONFIG = {
  9999: {
    hasNegative: true,
  },
  1500: {
    onlyNegative: true,
  },
  1036: {
    onlyNegative: true,
  },
};

export const ORDER_REGULARITY_OFFSETS = Array.from({ length: 15 }, (_, i) => ({
  label: `За ${i + 1} ${getNumberAddition(i + 1, 'день', 'дня', 'дней')}`,
  value: i + 1,
}));

export const ORDER_REGULARITY_UNITS = [
  {
    label: 'Дни',
    value: 'days',
  },
  {
    label: 'Неделя',
    value: 'week',
  },
  {
    label: 'Месяц',
    value: 'month',
  },
];

export const ORDER_REGULARITY_WEEK_DAYS = Array.from({ length: 7 }, (_, i) => ({
  label: WEEK_DAYS[i + 1],
  value: i + 1,
  short: WEEK_DAYS_SHORTENED[i + 1],
}));

export const ORDER_REGULARITY_MONTH_DAYS = Array.from({ length: 31 }, (_, i) => ({
  label: i + 1,
  value: i + 1,
}));

export const ORDER_INTERCITY_MAX_WORKING_DAYS = 30;
export const ORDER_CITY_MAX_WORKING_DAYS = 7;
export const ORDER_LOADER_MAX_WORKING_DAYS = 7;

export const REGULAR_ORDER_ARRIVE_AT_FIELDS = [
  'startOfPeriod',
  'endOfPeriod',
  'unit',
  'amount',
  'offset',
  'toStartAtTime',
];
