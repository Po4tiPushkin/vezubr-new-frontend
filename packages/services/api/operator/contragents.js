import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Profile extends ApiBaseClass {
  async clients(data = { orderBy: 'id' }) {
    if (typeof this.clientsCancelToken !== 'undefined') {
      this.clientsCancelToken.cancel('Operation canceled due to new request.');
    }
    this.clientsCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.contragents.clients, data, false, this.clientsCancelToken);
  }

  async producers(data = { orderBy: 'id' }) {
    if (typeof this.producersCancelToken !== 'undefined') {
      this.producersCancelToken.cancel('Operation canceled due to new request.');
    }
    this.producersCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.contragents.producers, data, false, this.producersCancelToken);
  }

  async clientMainInfo(data) {
    return await this.req('post', CP.contragents.clientMainInfo, data);
  }

  async clientBalance(data) {
    return await this.req('post', CP.contragents.clientBalance, data);
  }

  async clientServiceInfo(data) {
    return await this.req('post', CP.contragents.clientServiceInfo, data);
  }

  async clientChangeServiceInfo(data) {
    return await this.req('post', CP.contragents.clientChangeServiceInfo, data);
  }

  async producerServiceInfo(data) {
    return await this.req('post', CP.contragents.producerServiceInfo, data);
  }

  async producerChangeServiceInfo(data) {
    return await this.req('post', CP.contragents.producerChangeServiceInfo, data);
  }

  async clientCompareData(data) {
    return await this.req('post', CP.contragents.clientCheckData, data);
  }

  async clientApprove(data) {
    return await this.req('post', CP.contragents.clientApprove, data);
  }

  async clientReject(data) {
    return await this.req('post', CP.contragents.clientReject, data);
  }

  async clientBan(data) {
    return await this.req('post', CP.contragents.clientBan, data);
  }

  async getUsersList(data) {
    return await this.req('post', CP.contragents.usersList, data);
  }

  async producerApprove(data) {
    return await this.req('post', CP.contragents.producerApprove, data);
  }

  async producerReject(data) {
    return await this.req('post', CP.contragents.producerReject, data);
  }

  async producerBan(data) {
    return await this.req('post', CP.contragents.producerBan, data);
  }

  async producerMainInfo(data) {
    return await this.req('post', CP.contragents.producerMainInfo, data);
  }

  async producerExtraInfo(data) {
    return await this.req('post', CP.contragents.producerExtraInfo, data);
  }

  async producerCompareData(data) {
    return await this.req('post', CP.contragents.producerCheckData, data);
  }

  async producerFinance(data) {
    return await this.req('post', CP.contragents.producerFinance, data);
  }

  async producerGenericContract(data) {
    return await this.req('post', CP.contragents.producerGenericContract, data);
  }

  async holdings(data) {
    return await this.req('post', CP.contragents.holdings, data);
  }

  async user(data) {
    return await this.req('post', CP.contragents.user, data);
  }

  async createHolding(data) {
    return await this.req('post', CP.contragents.createHolding, data);
  }

  async blockClientOrders(data) {
    return await this.req('post', CP.contragents.clientRestrictionChange, data);
  }

  async blockProducerOrders(data) {
    return await this.req('post', CP.contragents.producerRestrictionChange, data);
  }

  async scoring(data) {
    return await this.req('post', CP.contragents.clientScoring, data);
  }
}

export default new Profile();
