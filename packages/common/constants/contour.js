const CONTOUR_MAIN_ID = 1;

// const CONTOUR_TYPES = {
//   1: 'Контур агрегатора',
//   2: 'Контур клиента',
//   3: 'Контур продюсера',
// };

const CONTOUR_TYPES = [
  {
    title: 'Контур агрегатора',
    id: 1,
  },
  {
    title: 'Контур клиента',
    id: 2,
  },
  {
    title: 'Контур продюсера',
    id: 3,
  }
];

const CONTOUR_COMMISSION_PAYER = [
  {
    id: 1,
    title: 'Заказчик'
  },
  {
    id: 2,
    title: 'Подрядчик'
  },
]

const CONTOUR_STATUSES = {
  1: 'Активен',
  2: 'Удален',
};

const CONTOUR_ROLES = {
  1: 'Перевозчика',
  2: 'Грузовладельца',
  4: 'Экспедитора',
}

export { CONTOUR_MAIN_ID, CONTOUR_TYPES, CONTOUR_COMMISSION_PAYER, CONTOUR_STATUSES, CONTOUR_ROLES };
