import moment from 'moment';

export const compareOrdersByProblemsAndById = (order1, order2) => {
  const compareResult = compareOrdersByProblems(order1, order2);
  if (compareResult === 0) {
    return compareOrdersById(order1, order2);
  }
  return compareResult;
};

export function compareOrdersByProblemsAndByToStartAt(order1, order2) {
  const compareResult = compareOrdersByProblems(order1, order2);
  if (compareResult === 0) {
    const compareResult2 = compareOrdersByToStartAt(order1, order2);
    if (compareResult2 === 0) {
      return compareOrdersById(order1, order2);
    }
    return compareResult2;
  }
  return compareResult;
}

export function compareOrdersByProblemsAndByToStartAtDesc(order1, order2) {
  const compareResult = compareOrdersByProblems(order1, order2);
  if (compareResult === 0) {
    const compareResult2 = compareOrdersByToStartAtDesc(order1, order2);
    if (compareResult2 === 0) {
      return compareOrdersByIdDesc(order1, order2);
    }
    return compareResult2;
  }
  return compareResult;
}

export function compareOrdersByProblemsAndByTimeoutSelecting(order1, order2) {
  const compareResult = compareOrdersByProblems(order1, order2);
  if (compareResult === 0) {
    return compareOrdersByTimeoutSelecting(order1, order2);
  }
  return compareResult;
}

export const compareOrdersByProblems = (order1, order2) => {
  const problemsLength1 = order1?.data?.problems?.filter(({status}) => (status === 1))?.['length'];
  const problemsLength2 = order2?.data?.problems?.filter(({status}) => (status === 1))?.['length'];

  return problemsLength2 - problemsLength1;
};

export const compareOrdersById = (order1, order2) => {
  return order1.id - order2.id;
};

export const compareOrdersByIdDesc = (order1, order2) => {
  return order2.id - order1.id;
};

export const compareOrdersByToStartAt = (order1, order2) => {
  const { toStartAt: toStartAt1 } = order1.data;
  const { toStartAt: toStartAt2 } = order2.data;
  return toStartAt1 - toStartAt2;
};

export const compareOrdersByToStartAtDesc = (order1, order2) => {
  const { toStartAt: toStartAt1 } = order1.data;
  const { toStartAt: toStartAt2 } = order2.data;
  return toStartAt2 - toStartAt1;
};

export const compareOrdersByTimeoutSelecting = (order1, order2) => {
  const { timeoutSelecting: timeoutSelecting1 = 0 } = order1.data;
  const { timeoutSelecting: timeoutSelecting2 = 0 } = order2.data;

  return timeoutSelecting1 - timeoutSelecting2;
};
