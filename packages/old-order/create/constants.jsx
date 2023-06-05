import React from 'react';
import { Ant } from '@vezubr/elements';
import { ReactComponent as IconComponentMap } from '@vezubr/common/assets/img/icons/map.svg';
import { ReactComponent as IconComponentLoader } from '@vezubr/common/assets/img/icons/loader.svg';

export const CALCULATION_FIELDS = [
  {
    names: ['requiredPassesDetectionMode', 'orderType', 'hydroliftRequired', 'palletJackIsRequired', 'isTakeOutPackageRequired'],
    defaultChecked: true,
    hidden: true,
  },
  {
    names: ['toStartAtDate', 'toStartAtTime'],
    title: 'Дата',
    icon: <Ant.Icon type="clock-circle" />,
  },
  {
    names: ['bodyTypes', 'vehicleType'],
    title: 'Машина',
    icon: <Ant.Icon type="car" />,
  },
  {
    names: ['addresses', 'trackPolyline', 'trackEncoder'],
    title: 'Адрес',
    icon: <Ant.Icon component={IconComponentMap} />,
  },
];

export const CALCULATION_INTERCITY_FIELDS = [
  {
    names: ['requiredPassesDetectionMode', 'orderType'],
    defaultChecked: true,
    hidden: true,
  },
  {
    names: ['toStartAtDate', 'toStartAtTime'],
    title: 'Дата',
    icon: <Ant.Icon type="clock-circle" />,
  },
  {
    names: ['bodyTypes', 'vehicleType'],
    title: 'Машина',
    icon: <Ant.Icon type="car" />,
  },
  {
    names: ['addresses', 'trackPolyline', 'trackEncoder'],
    title: 'Адрес',
    icon: <Ant.Icon component={IconComponentMap} />,
  },
];

export const CALCULATION_LOADER_FIELDS = [
  {
    names: ['requiredPassesDetectionMode'],
    defaultChecked: true,
    hidden: true,
  },
  {
    names: ['toStartAtDate', 'toStartAtTime'],
    title: 'Дата',
    icon: <Ant.Icon type="clock-circle" />,
  },

  {
    names: ['loadersCount', 'requiredLoaderSpecialities'],
    title: 'Специалисты',
    icon: <Ant.Icon component={IconComponentLoader} />,
  },

  {
    names: ['addresses', 'address'],
    title: 'Адрес',
    icon: <Ant.Icon component={IconComponentMap} />,
  },
];

export const ORDER_TARIFF_PUBLISH_FIELDS = [
  'requiredContours',
  'requiredProducers',
  'contourTree',
  'insurance',
  'assessedCargoValue',
  'cargoCategoryId',
];

export const ORDER_RATE_PUBLISH_FIELDS = [
  'requiredContours',
  'requiredProducers',
  'useClientRate',
  'contourTree',
  'clientRate',
  'insurance',
  'assessedCargoValue',
  'cargoCategoryId',
];

export const ORDER_BARGAIN_PUBLISH_FIELDS = [
  'requiredContours',
  'requiredProducers',
  'contourTree',
  'clientRate',
  'bargainsEndDatetime',
  'bargainsEndDate',
  'bargainsEndTime',
  'insurance',
  'assessedCargoValue',
  'cargoCategoryId',
];

export const BARGAIN_STRATEGY_TYPES = {
  2: 'Открытый',
  3: 'Закрытый',
};

export const CALCULATION_FIELDS_DISPATCHER = [
  {
    names: ['requiredPassesDetectionMode', 'orderType', 'client', 'hydroliftRequired', 'isTakeOutPackageRequired', 'palletJackIsRequired'],
    defaultChecked: true,
    hidden: true,
  },
  {
    names: ['toStartAtDate', 'toStartAtTime'],
    title: 'Дата',
    icon: <Ant.Icon type="clock-circle" />,
  },
  {
    names: ['bodyTypes', 'vehicleType'],
    title: 'Машина',
    icon: <Ant.Icon type="car" />,
  },
  {
    names: ['addresses', 'trackPolyline', 'trackEncoder'],
    title: 'Адрес',
    icon: <Ant.Icon component={IconComponentMap} />,
  },
];

export const CALCULATION_LOADER_FIELDS_DISPATCHER = [
  {
    names: ['requiredPassesDetectionMode', 'client'],
    defaultChecked: true,
    hidden: true,
  },
  {
    names: ['toStartAtDate', 'toStartAtTime'],
    title: 'Дата',
    icon: <Ant.Icon type="clock-circle" />,
  },

  {
    names: ['loadersCount', 'requiredLoaderSpecialities'],
    title: 'Специалисты',
    icon: <Ant.Icon component={IconComponentLoader} />,
  },

  {
    names: ['addresses', 'address'],
    title: 'Адрес',
    icon: <Ant.Icon component={IconComponentMap} />,
  },
];