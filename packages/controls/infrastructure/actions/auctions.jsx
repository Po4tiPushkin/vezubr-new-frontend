import { Invoices as InvoicesService } from '@vezubr/services';

const getAuctions = (filters) => {
  return async (dispatch) => {
    let payload;
    payload = await InvoicesService.invoices(filters);
    return dispatch({ type: 'GET_FILTERED_AUCTIONS_SUCCESS', payload });
  };
};

export { getAuctions };
