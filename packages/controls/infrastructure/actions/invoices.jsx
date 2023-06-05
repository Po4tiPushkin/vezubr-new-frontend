import { Invoices as InvoicesService } from '@vezubr/services';

const getInvoices = (filters) => {
  return async (dispatch) => {
    let payload;
    payload = await InvoicesService.invoices(filters);
    return dispatch({ type: 'GET_FILTERED_INVOICES_SUCCESS', payload });
  };
};

export { getInvoices };
