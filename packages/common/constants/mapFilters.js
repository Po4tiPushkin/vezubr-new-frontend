import t from '../localization';

const MAP_FILTERS = {
  client: {
    selecting: [
      { title: t.map('orderOnSelection').toUpperCase().toUpperCase(), value: 'selecting', checked: true },
      { title: t.map('orderOnExecution').toUpperCase(), value: 'executing', checked: false },
    ],
    executing: [
      { title: t.map('orderOnSelection').toUpperCase().toUpperCase(), value: 'selecting', checked: false },
      { title: t.map('orderOnExecution').toUpperCase(), value: 'executing', checked: true },
    ],
    paperCheck: [
      { title: t.map('orderOnSelection').toUpperCase().toUpperCase(), value: 'selecting', checked: false },
      { title: t.map('orderOnExecution').toUpperCase(), value: 'executing', checked: true },
    ],
  },
  selection: [
    { title: t.map('urgency3').toUpperCase(), value: 'urgency3', checked: true },
    { title: t.map('urgency2').toUpperCase(), value: 'urgency2', checked: true },
    { title: t.map('Показать рейсы в ожидании исполнения').toUpperCase(), value: 'shouldStart', checked: false },
    { title: t.map('freeVehicles').toUpperCase(), value: 'freeVehicles', checked: true },
    { title: t.map('ordersInUnloading').toUpperCase(), value: 'isUnloading', checked: true },
  ],
  selectionEnding: [
    { title: t.map('urgency3').toUpperCase(), value: 'urgency3', checked: true },
    { title: t.map('urgency2').toUpperCase(), value: 'urgency2', checked: true },
    { title: t.map('Показать рейсы в ожидании исполнения”').toUpperCase(), value: 'shouldStart', checked: false },
    { title: t.map('freeVehicles').toUpperCase(), value: 'freeVehicles', checked: true },
    { title: t.map('ordersInUnloading').toUpperCase(), value: 'isUnloading', checked: true },
  ],
  execution: [
    { title: t.map('freeVehicles').toUpperCase(), value: 'freeVehicles', checked: false },
    { title: t.map('cityDelivery').toUpperCase(), value: 'execution', checked: true },
    {
      title: t.map('internationalDelivery').toUpperCase(),
      value: 'internationalDelivery',
      checked: false,
      disabled: true,
    },
  ],
  paperCheck: [
    { title: t.map('freeVehicles').toUpperCase(), value: 'freeVehicles', checked: false },
    { title: t.map('cityDelivery').toUpperCase(), value: 'execution', checked: true },
    {
      title: t.map('internationalDelivery').toUpperCase(),
      value: 'internationalDelivery',
      checked: false,
      disabled: true,
    },
  ],
  auction: [
    { title: t.map('urgency3').toUpperCase(), value: 'urgency3' },
    { title: t.map('urgency2').toUpperCase(), value: 'urgency2' },
    { title: t.map('ordersWithOffers').toUpperCase(), value: 'ordersWithOffers', disabled: true },
    { title: t.map('freeVehicles').toUpperCase(), value: 'freeVehicles' },
    { title: t.map('internationalDelivery').toUpperCase(), value: 'internationalDelivery', disabled: true },
  ],
  operator: {
    myProblems: [
      { title: t.map('Мои проблемные рейсы в подборе').toUpperCase(), value: 'operatorSelecting', checked: true },
      { title: t.map('Мои проблемные рейсы в исполнении').toUpperCase(), value: 'operatorExecuting', checked: true },
      { title: t.map('freeVehicles').toUpperCase(), value: 'freeVehicles', checked: true },
      { title: t.map('ordersInUnloading').toUpperCase(), value: 'operatorIsUnloading', checked: true },
      { title: t.map('ТС в рейсе').toUpperCase(), value: 'onDuty', checked: false },
    ],
    operatorProblems: [
      { title: t.map('Проблемные рейсы в подборе').toUpperCase(), value: 'operatorSelecting', checked: true },
      { title: t.map('Все рейсы на сегодня').toUpperCase(), value: 'operatorTodayOrders', checked: false },
      { title: t.map('Все рейсы на будущеe').toUpperCase(), value: 'operatorFutureOrders', checked: false },
      { title: t.map('Торги').toUpperCase(), value: 'auction', checked: false, disabled: true },
      { title: t.map('Проблемные рейсы в исполнении').toUpperCase(), value: 'operatorExecuting', checked: true },
      { title: t.map('freeVehicles').toUpperCase(), value: 'freeVehicles' },
      { title: t.map('ordersInUnloading').toUpperCase(), value: 'operatorIsUnloading', checked: false },
      { title: t.map('ТС в рейсе').toUpperCase(), value: 'onDuty', checked: false },
    ],
    userProblems: [
      { title: t.map('Проблемные рейсы в подборе').toUpperCase(), value: 'operatorSelecting', checked: true },
      { title: t.map('Все рейсы на сегодня').toUpperCase(), value: 'operatorTodayOrders', checked: false },
      { title: t.map('Все рейсы на будущеe').toUpperCase(), value: 'operatorFutureOrders', checked: false },
      { title: t.map('Торги').toUpperCase(), value: 'auction', checked: false, disabled: true },
      { title: t.map('Проблемные рейсы в исполнении').toUpperCase(), value: 'operatorExecuting', checked: true },
      { title: t.map('freeVehicles').toUpperCase(), value: 'freeVehicles' },
      { title: t.map('ordersInUnloading').toUpperCase(), value: 'operatorIsUnloading', checked: false },
      { title: t.map('ТС в рейсе').toUpperCase(), value: 'onDuty', checked: false },
    ],
  },
};

export { MAP_FILTERS };
