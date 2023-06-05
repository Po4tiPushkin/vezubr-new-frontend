import { Invoices as InvoicesService } from '@vezubr/services';

const mapItemAction = (payload) => {
  return (dispatch) => dispatch({ type: 'MAP_ACTION', payload });
};

export { mapItemAction };
