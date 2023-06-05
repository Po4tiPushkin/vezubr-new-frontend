import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Invoices extends ApiBaseClass {
  async invoices(filters) {
    if (typeof this.invoicesListCancelToken !== 'undefined') {
      this.invoicesListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.invoicesListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.invoices.filteredList, filters, false , this.invoicesListCancelToken);
  }

  async accept(data) {
    return await this.req('post', CP.invoices.accept(data.id),data);
  }

  async info(invoiceId) {
    return await this.req('get', CP.invoices.info(invoiceId));
  }

  
}

export default new Invoices();
