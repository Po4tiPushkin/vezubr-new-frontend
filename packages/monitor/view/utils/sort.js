import * as Utils from '../../utils';

export const sortOrdersSelection = (orders) => orders.sort(Utils.compareOrdersByProblemsAndByToStartAt);

export const sortOrdersExecution = (orders) => orders.sort(Utils.compareOrdersByProblemsAndByToStartAt);

export const sortOrdersPaperCheck = (orders) => orders.sort(Utils.compareOrdersByProblemsAndByToStartAt);

export const sortOrdersBargain = (orders) => orders.sort(Utils.compareOrdersByProblemsAndByToStartAtDesc);
