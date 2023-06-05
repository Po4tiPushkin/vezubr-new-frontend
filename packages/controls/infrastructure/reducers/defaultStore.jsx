import t from '@vezubr/old-common/src/localization';
import { MapDeprecated } from '@vezubr/old-components';
import platformName from '@vezubr/old-common/src/common/platformName';
import React from 'react';

const DRIVER = 1;
const LOADER = 2;


export const contractsRoute = {
  url: '/contracts',
  active: false,
  hasNotify: false,
  name: t.nav('Договоры'),
  icon: 'actsOrange',
  access: [DRIVER, LOADER],
  className: 'rightCenter',
  arrowPosition: 'leftCenter',
  sub: [
    {
      id: 'contracts-1',
      title: t.order(`Правила пользования платформой ${platformName}`),
      icon: 'actsOrange',
      url: '/contracts/1',
      access: [DRIVER, LOADER],
    },
    {
      id: 'contracts-2',
      title: t.order('Договор перевозки'),
      icon: 'actsOrange',
      url: '/contracts/2',
      access: [DRIVER, LOADER],
    },
    {
      id: 'contracts-3',
      title: t.order('Договор ПРР'),
      icon: 'actsOrange',
      url: '/contracts/3',
      access: [DRIVER, LOADER],
    },
    {
      id: 'contracts-4',
      title: t.order('Политика конфиденциальности'),
      icon: 'actsOrange',
      url: '/contracts/4',
      access: [DRIVER, LOADER],
    },
    {
      id: 'contracts-5',
      title: t.order('Согласие на обработку ПД'),
      icon: 'actsOrange',
      url: '/contracts/5',
      access: [DRIVER, LOADER],
    },
    {
      id: 'contracts-6',
      title: t.order('Договор аренды ТС с экипажем'),
      icon: 'actsOrange',
      url: '/contracts/6',
      access: [DRIVER, LOADER],
    },
    {
      id: 'contracts-7',
      title: t.order('Согласие собственника ТС'),
      icon: 'actsOrange',
      url: '/contracts/7',
      access: [DRIVER, LOADER],
    },
  ],
};

const defaultStore = {
  user: {},
  userSettings: {},
  availableBalance: 0,
  dictionaries: {},
  sidebarState: (APP === 'producer' || APP === 'client') && localStorage.menuAlert ? true : false,
  map: {},
  contractor: {
    byEmployees: [],
  },
  notifications: [],
  currentTab: null,
  monitorDates: {},
  customProperties: [],
  topNav: ['newOrder', 'monitor', 'orders', 'bills'],
  topNavOperator: ['contragents', 'directoriesOperator'],
  topNavDispatcher: ['newOrder', 'monitor', 'ordersForDispatcher', 'directoriesForDispatcher'],
  topNavEnter: ['monitor', 'orders', 'transports', 'registriesList'],
  topNavClient: ['newOrder', 'monitor', 'orders', 'registriesList'],
  topNavProducer: ['monitor', 'ordersNav', 'directories', 'registries'],
  sidebarNav: [
    'monitor',
    'newOrder',
    'auctions',
    'orders',
    'deferred',
    'profile',
    'settings',
    'help',
  ],
  clientSidebarNav: [
    'monitor',
    'newOrder',
    'requests',
    'orders',
    'cargoPlaces',
    'producers',
    'registriesList',
    'documentManagementClient',
    'directoriesClient',
    'profile',
    'settings',
    'help',
  ],
  producerSidebarNav: [
    'monitor',
    'requests',
    'ordersNav',
    'clients',
    'documentsForProducer',
    'documentManagement',
    'directories',
    'contracts',
    'profile',
    'settings',
    'help',
  ],
  operatorSidebarNav: [
    'contragents',
    'directoriesOperator',
  ],
  dispatcherSidebarNav: [
    'monitor',
    'newOrder',
    'requests',
    'ordersForDispatcher',
    'cargoPlaces',
    'dispatcherContragents',
    'documentsForDispatcher',
    'documentManagement',
    'directoriesForDispatcher',
    'profile',
    'settings',
    'help',
  ],
  enterSidebarNav: [
    'monitor',
    'counterparties',
    'orders',
    'profile',
    'cargoPlaces',
    'directoriesClient',
    'documents',
    'registries',
  ],
  routes: {
    monitor: {
      url: '/monitor/selection',
      active: false,
      hasNotify: true,
      children: [
        {
          id: 'selection',
          name: t.nav('selection'),
          url: '/monitor/selection',
          hasNotify: true,
          active: true,
          disabled: false,
          monitorType: 'selecting',
        },
        {
          id: 'execution',
          name: t.nav('execution'),
          url: '/monitor/execution',
          active: false,
          disabled: false,
          monitorType: 'executing',
        },
        {
          id: 'paper-check',
          name: t.nav('paperCheck'),
          url: '/monitor/paper-check',
          active: false,
          disabled: false,
          monitorType: 'paperCheck',
        },
        {
          id: 'auctions',
          name: t.nav('auction'),
          url: '/monitor/auctions',
          active: false,
          disabled: true,
          monitorType: 'auctions',
        },
      ],
      producerChildren: [
        {
          id: 'selection',
          name: t.nav('selection'),
          url: '/monitor/selection',
          active: true,
          access: [DRIVER, LOADER],
          monitorType: 'selection',
        },
        {
          id: 'selection-ending',
          name: t.nav('selectionEnding'),
          url: '/monitor/selection-ending',
          active: false,
          access: [DRIVER],
          monitorType: 'selectionEnding',
        },
        {
          id: 'auctions',
          name: t.nav('auction'),
          url: '/monitor/auctions',
          active: false,
          access: [DRIVER],
          disabled: true,
          monitorType: 'auctions',
        },
        {
          id: 'execution',
          name: t.nav('execution'),
          url: '/monitor/execution',
          active: false,
          access: [DRIVER, LOADER],
          monitorType: 'execution',
        },
        {
          id: 'paper-check',
          name: t.nav('paperCheck'),
          url: '/monitor/paper-check',
          active: false,
          disabled: false,
          access: [DRIVER, LOADER],
          monitorType: 'paperCheck',
        },
      ],
      operatorChildren: [
        {
          id: 'myProblems',
          name: t.nav('Мои проблемные рейсы'),
          url: '/monitor/my-problems',
          active: true,
          access: [DRIVER, LOADER],
        },
        {
          id: 'operatorProblems',
          name: t.nav('Проблемы операторов'),
          url: '/monitor/operator-problems',
          active: false,
          access: [DRIVER],
        },
        {
          id: 'userProblems',
          name: t.nav('Проблемы пользователей'),
          url: '/monitor/users-problem',
          active: false,
          access: [DRIVER],
          disabled: false,
        },
        {
          id: 'execution',
          name: t.nav('Торги'),
          url: '/monitor/execution',
          active: false,
          disabled: true,
          access: [DRIVER, LOADER],
        },
        /*{
          id: 'paper-check',
          name: t.nav('paperCheck'),
          url: '/monitor/paper-check',
          active: false,
          disabled: false,
          access: [DRIVER, LOADER]
        },*/
      ],
      name: t.nav('monitor'),
      icon: 'mapOrange',
      className: 'monitor',
      access: [DRIVER, LOADER],
    },
    auctions: {
      url: '/auctions',
      active: false,
      hasNotify: false,
      name: t.nav('auction'),
      icon: 'auctionHammer',
      className: 'auction',
      access: [DRIVER, LOADER],
    },
    deferred: {
      url: '/deferred',
      active: false,
      hasNotify: false,
      name: t.nav('deferred'),
      icon: 'repeatOrange',
      className: 'deferred',
      access: [DRIVER, LOADER],
    },
    documents: {
      url: '/documents',
      active: false,
      hasNotify: false,
      name: t.documents('ordersDocuments'),
      icon: 'ordersDocuments2',
      className: 'documents',
      access: [DRIVER, LOADER],
    },
    changelog: {
      url: '/changelog',
      active: false,
      hasNotify: false,
      name: t.nav('changelog'),
      icon: 'actsOrange',
      className: 'changelog',
      access: [DRIVER, LOADER],
    },
    profile: {
      url: '/profile/main',
      active: false,
      hasNotify: false,
      name: t.nav('profile'),
      icon: 'usersOrange',
      className: 'profile',
      access: [DRIVER, LOADER],
    },
    settings: {
      url: '/settings/personal',
      active: false,
      hasNotify: false,
      name: t.nav('settings'),
      icon: 'settingsOrange',
      className: 'settings',
      access: [DRIVER, LOADER],
    },
    newOrder: {
      url: '/new-order',
      active: false,
      name: t.nav('newOrder'),
      icon: 'plusOrange',
      className: 'rightCenter',
      arrowPosition: 'leftCenter',
      sub: [
        {
          id: 'city',
          title: t.order('transportOrder'),
          icon: 'orderTypeDeliveryOrange',
          url: '/new-order/city',
        },
        {
          id: 'intercity',
          title: t.order('intercityOrder'),
          icon: 'truckIntercityOrangeNf',
          url: '/new-order/intercity',
        },
        {
          id: 'regular',
          title: t.order('regularOrder'),
          icon: 'regularOrders',
          url: '/regular-order/new',
        },
        {
          id: 'loaders',
          title: 'ПРР',
          icon: 'orderTypeLoad',
          url: '/new-order/loader',
        }
      ],
    },
    ordersForDispatcher: {
      url: '/orders',
      active: false,
      sub: [
        {
          id: 'allOrder',
          title: `Все ${t.order('orders')}`,
          icon: 'ordersOrange',
          url: '/orders',
        },
        {
          id: 'auction',
          title: t.nav('auction'),
          icon: 'auctionHammer',
          url: '/auctions',
        },
        {
          id: 'deferred',
          url: '/deferred',
          active: false,
          hasNotify: false,
          title: t.nav('deferred'),
          icon: 'repeatOrange',
          className: 'deferred',
          access: [DRIVER, LOADER],
        },
        {
          id: 'regular',
          url: '/regular-orders',
          title: t.nav('regular'),
          icon: 'regularOrders',
          className: 'deferred',
        },
      ],
      children: [
        {
          id: 'map',
          name: t.nav('map'),
          url: `/orders/:id/map`,
          hasNotify: false,
          active: true,
        },
        {
          id: 'general',
          name: 'Рейс',
          url: '/orders/:id/general',
          hasNotify: false,
          active: false,
        },
        {
          id: 'perpetrators',
          name: t.nav('perpetrators'),
          url: '/orders/:id/perpetrators',
          hasNotify: false,
          active: false,
        },
        {
          id: 'documents',
          name: t.nav('documents'),
          url: '/orders/:id/documents',
          hasNotify: false,
          active: false,
        },
        {
          id: 'photos',
          name: t.nav('photos'),
          url: '/orders/:id/photos',
          hasNotify: false,
          active: false,
        },
        {
          id: 'history',
          name: t.nav('history'),
          url: '/orders/:id/history',
          hasNotify: false,
          active: false,
        },
      ],
      name: t.nav('orders'),
      icon: 'ordersOrange',
      className: 'orders',
      access: [DRIVER, LOADER],
    },
    documentsForProducer: {
      url: '/registries',
      active: false,
      name: t.nav('registries'),
      icon: 'billsOrange',
      className: 'documents',
      arrowPosition: 'leftCenter',
      access: [DRIVER, LOADER],
      sub: [
        {
          id: 'registries-create',
          title: t.nav('createRegistry'),
          icon: 'billsOrange',
          url: '/registries/create',
        },
        {
          id: 'registries-list',
          title: 'Список реестров',
          icon: 'registriesOrangeOut',
          url: '/registries',
        },
      ]
    },
    documentsForDispatcher: {
      url: '/registries',
      active: false,
      name: 'Реестры',
      icon: 'billsOrange',
      className: 'documents',
      arrowPosition: 'leftCenter',
      sub: [
        {
          id: 'formRegistry',
          title: `${t.documents('formRegistryDocuments')}`,
          icon: 'billsOrange',
          url: '/registries/create',
        },
        {
          id: 'clientRegistries',
          title: `${t.documents('clientRegistries')}`,
          icon: 'registriesOrangeOut',
          url: '/registries/producer',
        },
        {
          id: 'producerRegistries',
          title: `${t.documents('producerRegistries')}`,
          icon: 'registriesOrange',
          url: '/registries/client',
        },
      ],
    },
    documentManagement: {
      url: '/documents',
      active: false,
      name: t.nav('documentsCycle'),
      icon: 'actsOrange',
      className: 'documents',
      arrowPosition: 'leftCenter',
      sub: [
        {
          id: 'transportDocuments',
          title: `${t.documents('transportDocuments')}`,
          icon: 'actsOrange',
          url: '/documents-flow',
          show: APP !== 'client'
        },
        {
          id: 'orders',
          title: `${t.documents('ordersDocuments')}`,
          icon: 'docsAnalysis',
          url: '/documents',
        }
      ],
    },
    documentManagementClient: {
      url: '/documents-flow',
      active: false,
      name: `Перевозочные документы`,
      icon: 'actsOrange',
      className: 'documents',
    },
    orders: {
      url: '/orders',
      active: false,
      sub: [
        {
          id: 'allOrder',
          title: `Все ${t.order('orders')}`,
          icon: 'ordersOrange',
          url: '/orders',
        },
        {
          id: 'auction',
          title: t.nav('auction'),
          icon: 'auctionHammer',
          url: '/auctions',
        },
        {
          id: 'deferred',
          url: '/deferred',
          active: false,
          hasNotify: false,
          title: t.nav('deferred'),
          icon: 'repeatOrange',
          className: 'deferred',
          access: [DRIVER, LOADER],
        },
        {
          id: 'regular',
          url: '/regular-orders',
          title: t.nav('regular'),
          icon: 'regularOrders',
          className: 'deferred',
        },
      ],
      children: [
        {
          id: 'map',
          name: t.nav('map'),
          url: `/orders/:id/map`,
          hasNotify: false,
          active: true,
        },
        {
          id: 'general',
          name: 'Рейс',
          url: '/orders/:id/general',
          hasNotify: false,
          active: false,
        },
        {
          id: 'perpetrators',
          name: t.nav('perpetrators'),
          url: '/orders/:id/perpetrators',
          hasNotify: false,
          active: false,
        },
        {
          id: 'documents',
          name: t.nav('documents'),
          url: '/orders/:id/documents',
          hasNotify: false,
          active: false,
        },
        {
          id: 'photos',
          name: t.nav('photos'),
          url: '/orders/:id/photos',
          hasNotify: false,
          active: false,
        },
        {
          id: 'history',
          name: t.nav('history'),
          url: '/orders/:id/history',
          hasNotify: false,
          active: false,
        },
      ],
      name: t.nav('orders'),
      icon: 'ordersOrange',
      className: 'orders',
      access: [DRIVER, LOADER],
    },

    ordersNav: {
      url: '/orders',
      active: false,
      sub: [
        {
          id: 'orders',
          title: `Все ${t.order('orders')}`,
          icon: 'ordersOrange',
          url: '/orders',
        },
        {
          id: 'auction',
          title: t.nav('auction'),
          icon: 'auctionHammer',
          url: '/auctions',
        },
      ],
      name: 'Рейсы',
      icon: 'ordersOrange',
      access: [DRIVER, LOADER],
      className: 'orders',
    },

    ordersForProducer: {
      url: '/orders',
      active: false,
      hasNotify: false,
      name: t.nav('orders'),
      icon: 'ordersOrange',
      className: 'orders',
      access: [DRIVER, LOADER],
      sub: [
        {
          id: 'allOrder',
          title: `Все ${t.order('orders')}`,
          icon: 'ordersOrange',
          url: '/orders',
        },
      ],
      children: [
        {
          id: 'map',
          name: t.nav('map'),
          url: `/orders/:id/map`,
          hasNotify: false,
          active: true,
        },
        {
          id: 'general',
          name: 'Рейс',
          url: '/orders/:id/general',
          hasNotify: false,
          active: false,
        },
        {
          id: 'perpetrators',
          name: t.nav('perpetrators'),
          url: '/orders/:id/perpetrators',
          hasNotify: false,
          active: false,
        },
        {
          id: 'documents',
          name: t.nav('documents'),
          url: '/orders/:id/documents',
          hasNotify: false,
          active: false,
        },
        {
          id: 'photos',
          name: t.nav('photos'),
          url: '/orders/:id/photos',
          hasNotify: false,
          active: false,
        },
        {
          id: 'history',
          name: t.nav('history'),
          url: '/orders/:id/history',
          hasNotify: false,
          active: false,
        },
      ],
    },
    requests: {
      url: '/requests',
      active: false,
      name: t.nav('requests'),
      icon: 'requestsAll_v2',
      access: [DRIVER, LOADER],
      className: 'orders',
      sub: [
        {
          id: 'requests-rate-tariff',
          title: 'Активные Заявки',
          icon: 'requestsTariffRate',
          url: '/requests/active'
        },
        {
          id: 'requests',
          title: 'Архив Заявок',
          icon: 'requestsAll_v2',
          url: '/requests/all'
        },
      ],
    },
    producers: {
      url: '/producers',
      active: false,
      name: t.clients('producer'),
      icon: 'producersOrange2',
      className: 'producers',
      access: [DRIVER, LOADER],
    },
    clients: {
      url: '/clients',
      active: false,
      name: t.nav('clients'),
      icon: 'clientsOrange',
      className: 'clients',
      access: [DRIVER, LOADER],
    },

    registriesList: {
      url: '/registries',
      active: false,
      name: t.nav('registries'),
      icon: 'registriesOrange',
      className: 'registries',
      access: [DRIVER, LOADER],
    },

    registriesListProducer: {
      url: '/registries',
      active: false,
      name: t.nav('registries'),
      icon: 'registriesOrangeOut',
      className: 'registries',
      access: [DRIVER, LOADER],
    },

    transports: {
      url: '/transports',
      active: false,
      icon: 'orderTypeDeliveryOrange',
      name: t.nav('transports'),
      className: 'transports',
      access: [DRIVER],
    },
    transportsForDispatcher: {
      url: '/transports',
      active: false,
      icon: 'orderTypeDeliveryOrange',
      name: t.nav('transports'),
      className: 'transports',
      access: [DRIVER],
      children: [
        {
          id: 'general',
          name: 'Рейс',
          url: '/transports/:id/general',
          hasNotify: false,
          active: false,
        },
        {
          id: 'perpetrators',
          name: t.nav('perpetrators'),
          url: '/transports/:id/perpetrators',
          hasNotify: false,
          active: false,
        },
        {
          id: 'documents',
          name: t.nav('documents'),
          url: '/transports/:id/documents',
          hasNotify: false,
          active: false,
        },
        {
          id: 'photos',
          name: t.nav('photos'),
          url: '/transports/:id/photos',
          hasNotify: false,
          active: false,
        },
        {
          id: 'history',
          name: t.nav('history'),
          url: '/transports/:id/history',
          hasNotify: false,
          active: false,
        },
      ],
    },

    registries: {
      url: '/registries',
      arrowPosition: 'leftCenter',
      active: false,
      name: t.nav('registries'),
      icon: 'billsOrange',
      className: 'registries rightCenter',
      access: [DRIVER, LOADER],
      sub: [
        {
          id: 'registries-create',
          title: t.nav('createRegistry'),
          icon: 'billsOrange',
          url: '/registries/create',
          access: [DRIVER, LOADER],
        },
        {
          id: 'registries-list',
          title: 'Список реестров',
          icon: 'registriesOrangeOut',
          url: '/registries',
          access: [DRIVER, LOADER],
        },
      ],
    },

    loadersProducer: {
      id: 'loaders',
      url: '/loaders',
      name: t.loader('title'),
      icon: 'orderTypeLoad',
      className: 'loader',
      access: [LOADER],
    },
    directories: {
      arrowPosition: 'leftCenter',
      sub: [
        {
          id: 'tariffs',
          url: '/tariffs',
          title: t.nav('tariffs'),
          icon: 'tariffsOrange',
          className: 'tariffs',
          access: [DRIVER],
        },
        {
          id: 'drivers',
          url: '/drivers',
          title: t.driver('title'),
          icon: 'wheelOrange',
          className: 'driver',
          access: [DRIVER],
        },
        {
          url: '/transports',
          id: 'transports',
          active: false,
          icon: 'orderTypeDeliveryOrange',
          name: t.nav('transports'),
          className: 'transports',
          access: [DRIVER],
        },
        {
          id: 'tractors',
          title: t.tractors('title'),
          icon: 'semiTruckOrange',
          className: 'tractor',
          url: '/tractors',
          access: [DRIVER],
        },
        {
          id: 'trailers',
          url: '/trailers',
          title: t.trailer('title'),
          icon: 'trailerOrange',
          className: 'trailer',
          access: [DRIVER],
        },
        {
          id: 'loaders',
          url: '/loaders',
          title: 'Специалисты',
          icon: 'orderTypeLoad',
          className: 'loader',
          access: [DRIVER],
        },
        {
          id: 'insurers',
          url: '/insurers',
          title: 'Страховые компании',
          icon: 'insurerOrange'
        }
      ],
      url: '/directories',
      active: false,
      name: t.nav('directories'),
      icon: 'dataBaseOrange',
      className: 'directories rightCenter',
      access: [DRIVER],
    },
    directoriesOperator: {
      arrowPosition: 'leftCenter',
      sub: [
        {
          id: 'drivers',
          url: '/drivers',
          title: t.driver('title'),
          icon: 'wheelOrange',
          className: 'driver',
          access: [DRIVER],
        },
        {
          id: 'transports',
          url: '/transports',
          active: false,
          icon: 'orderTypeDeliveryOrange',
          name: t.nav('transports'),
          className: 'transports',
          access: [DRIVER],
        },
        {
          id: 'contours',
          url: '/contours',
          active: false,
          icon: 'editOrange',
          name: t.nav('contours'),
          className: 'conrours',
          access: [DRIVER],
        },
      ],
      url: '/directories',
      active: false,
      name: t.nav('directories'),
      icon: 'dataBaseOrange',
      className: 'directories rightCenter',
      access: [DRIVER],
    },
    directoriesClient: {
      arrowPosition: 'leftCenter',
      sub: [
        {
          id: 'addresses',
          url: '/addresses',
          title: 'Адреса',
          icon: 'addressesOrange',
          access: [DRIVER],
        },
        {
          id: 'tariffs',
          url: '/tariffs',
          title: t.nav('tariffs'),
          icon: 'tariffsOrange',
          className: 'tariffs',
          access: [DRIVER],
        },
        {
          id: 'insurers',
          url: '/insurers',
          title: 'Страховые компании',
          icon: 'insurerOrange'
        }
      ],
      url: '/directories',
      active: false,
      name: t.nav('directories'),
      icon: 'dataBaseOrange',
      className: 'directories rightCenter',
      access: [DRIVER],
    },
    cargoPlaces: {
      arrowPosition: 'leftCenter',
      url: '/cargoPlaces',
      active: false,
      name: 'Грузоместа',
      icon: 'boxOrange',
      className: 'directories rightCenter',
      access: [DRIVER],
    },
    producerProfile: {
      url: '/profile/account/main',
      active: false,
      hasNotify: false,
      name: t.nav('profile'),
      icon: 'usersOrange',
      className: 'profile',
      access: [DRIVER, LOADER],
    },
    contragents: {
      url: '/contragents',
      active: false,
      name: t.nav('contragents'),
      icon: 'auctionOrange',
      className: 'rightCenter',
      arrowPosition: 'leftCenter',
      sub: [
        {
          id: 'transport',
          title: t.clients('title'),
          icon: 'orderTypeDeliveryOrange',
          url: '/clients',
        },
        {
          id: 'loader',
          title: t.clients('producer'),
          icon: 'orderTypeLoad',
          url: '/producers',
        },
      ],
    },
    dispatcherContragents: {
      url: '/contragents',
      active: false,
      name: t.nav('contragents'),
      icon: 'auctionOrange',
      className: 'rightCenter',
      arrowPosition: 'leftCenter',
      sub: [
        {
          id: 'transport',
          title: t.clients('title'),
          icon: 'clientsOrange',
          url: '/clients',
        },
        {
          id: 'loader',
          title: t.clients('producer'),
          icon: 'producersTruck2',
          url: '/producers',
        },
      ],
    },
    directoriesForDispatcher: {
      arrowPosition: 'leftCenter',
      sub: [
        {
          id: 'addresses',
          url: '/addresses',
          title: 'Адреса',
          icon: 'addressesOrange',
        },
        {
          id: 'tariffs',
          url: '/tariffs',
          title: t.nav('tariffs'),
          icon: 'tariffsOrange',
          className: 'tariffs',
        },
        {
          id: 'drivers',
          url: '/drivers',
          title: t.driver('title'),
          icon: 'wheelOrange',
          className: 'driver',
          access: [DRIVER],
        },
        {
          id: 'transports',
          url: '/transports',
          active: false,
          icon: 'orderTypeDeliveryOrange',
          name: t.nav('transports'),
          className: 'transports',
          access: [DRIVER],
        },
        {
          id: 'tractors',
          title: t.tractors('title'),
          icon: 'semiTruckOrange',
          className: 'tractor',
          url: '/tractors',
          access: [DRIVER],
        },
        {
          id: 'trailers',
          url: '/trailers',
          title: t.trailer('title'),
          icon: 'trailerOrange',
          className: 'trailer',
          access: [DRIVER],
        },
        {
          id: 'loaders',
          url: '/loaders',
          title: 'Специалисты',
          icon: 'orderTypeLoad',
          className: 'loader',
          access: [DRIVER],
        },
        {
          id: 'insurers',
          url: '/insurers',
          title: 'Страховые компании',
          icon: 'insurerOrange'
        }

      ],
      url: '/directories',
      active: false,
      name: t.nav('directories'),
      icon: 'dataBaseOrange',
      className: 'directories rightCenter',
    },
    counterparties: {
      url: '/counterparties',
      active: false,
      name: t.nav('contragents'),
      icon: 'auctionOrange',
      className: 'counterparties',
    },
    drivers: {
      url: '/drivers',
      active: false,
      name: t.driver('title'),
      icon: 'wheelOrange',
      id: 'drivers',
      className: 'driver',
      access: [DRIVER],
    },
    tariffs: {
      url: '/tariffs',
      active: false,
      name: t.nav('tariffs'),
      icon: 'actsOrange',
      className: 'tariffs',
      access: [DRIVER],
    },

    help: {
      arrowPosition: 'leftCenter',
      sub: [
        {
          id: 'clientHelp',
          url: 'https://vezubr-ru.gitbook.io/instrukciya-dlya-gruzovladelcev/',
          redirect: true,
          title: t.nav('clientHelp'),
          icon: 'clientsOrange',
          access: [DRIVER, LOADER],
        },
        {
          id: 'producerHelp',
          url: 'https://vezubr-ru.gitbook.io/instrukciya-dlya-perevozchikov/',
          title: t.nav('producerHelp'),
          icon: 'producersTruck2',
          redirect: true,
          className: 'producerHelp',
          access: [DRIVER, LOADER],
        },
        {
          id: 'dispatcherHelp',
          url: 'https://vezubr-ru.gitbook.io/instrukciya-dlya-ekspeditorov/',
          title: t.nav('dispatcherHelp'),
          icon: 'dispatchersOrange2',
          redirect: true,
          className: 'dispatcherHelp',
          access: [DRIVER, LOADER],
        },
        {
          id: 'appHelp',
          url: 'https://vezubr-ru.gitbook.io/instrukciya-dlya-mp/',
          redirect: true,
          icon: 'phoneOrange',
          name: t.nav('appHelp'),
          className: 'appHelp',
          access: [DRIVER, LOADER],
        },
        {
          id: 'faq',
          url: 'https://vezubr-ru.gitbook.io/faq-1/',
          redirect: true,
          icon: 'faqOrange',
          name: t.nav('faq'),
          className: 'faq',
          access: [DRIVER, LOADER],
        },
      ],
      url: '/help',
      active: false,
      name: t.nav('help'),
      icon: 'questionOrange',
      access: [DRIVER, LOADER],
      className: 'help rightCenter',
    },
  },
  components: {
    map: {
      node: MapDeprecated,
    },
  },
  contracts: {
    loadingDocs: false,
    loadingDoc: null,
    documents: {},
  },
  profileCardBinding: {
    cardsById: {},
    cardsOrder: [],
    finishCard: null,
    listLoading: true,
    initialUrlLoading: false,
    updateLoading: false,
  },
};

//Object.freeze(defaultStore);

export default defaultStore;