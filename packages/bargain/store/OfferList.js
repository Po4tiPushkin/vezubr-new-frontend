import { observable, computed, action, flow } from 'mobx';
import { computedFn } from 'mobx-utils';
import OfferItem from './OfferItem';
import { BARGAIN_ACTIVE_STATUSES, BARGAIN_COMPLETED_STATUSES } from '../constants';

class OfferList {
  _data = observable.map([], { deep: false });

  @observable _loading = false;

  @observable _status = 0;

  @observable _itemProcessing = {};

  _loadingFlow = null;

  constructor({ status, list, getListFunc }) {
    this.setStatus(status);

    if (list) {
      this.setDirtyData(list);
    } else if (getListFunc) {
      this.loadList(getListFunc);
    }
  }

  _cancelLoadingFlow() {
    if (this._loadingFlow) {
      this._loadingFlow.cancel();
      this._loadingFlow = null;
    }
  }

  @action
  setItemProcessing(id, name) {
    this._itemProcessing = { id, name };
  }

  @computed
  get status() {
    return this._status;
  }

  @computed
  get isActive() {
    return BARGAIN_ACTIVE_STATUSES.includes(this._status);
  }

  @computed
  get isCompleted() {
    return BARGAIN_COMPLETED_STATUSES.includes(this._status);
  }

  @action
  setStatus(status) {
    this._status = status;
  }

  @action
  clearItemProcessing(id) {
    const { id: idUse } = this._itemProcessing;
    if (idUse === id) {
      this._itemProcessing = {};
    }
  }

  @computed
  get itemProcessing() {
    return this._itemProcessing;
  }

  @computed
  get isItemProcessing() {
    return !!this.itemProcessing.id;
  }

  @computed
  get isLoading() {
    return this._loading;
  }

  @action
  addToStore(offer) {
    if (!offer.id) {
      console.error('Empty id for adding offer');
      return;
    }

    const existOffer = this._data.get(offer.id);

    if (existOffer === offer) {
      console.warn('adding offer already added');
      return;
    }

    if (existOffer && existOffer !== offer) {
      console.log('replace offer id: ' + offer.id);
    }

    this._data.set(offer.id, offer);
  }

  _loadList = flow(function* (getListFunc) {
    this._loading = true;

    try {
      const dirtyList = yield getListFunc();
      if (dirtyList && Array.isArray(dirtyList)) {
        this.clearData();
        this.setData(dirtyList);
      }
    } catch (error) {
      console.error(e);
    } finally {
      this._loadingFlow = null;
      this._loading = false;
    }
  });

  @action
  destroy() {
    this._cancelLoadingFlow();
  }

  @action
  createNewOffer(dirtyData = { id: 0, sum: 50000 }) {
    const storeItem = new OfferItem(dirtyData, this);
    storeItem.setAsNew(true);
    return storeItem;
  }

  @action
  loadList(getListFunc) {
    this._cancelLoadingFlow();
    this._loadingFlow = this._loadList(getListFunc);
  }

  getItemById(id) {
    return this._data.get(id);
  }

  @action
  clearData() {
    this._data.clear();
  }

  @action
  deleteItem(id) {
    this._data.delete(id);
  }

  getOfferById = computedFn(function (offerId) {
    return this._data.get(offerId);
  });

  @action
  setDirtyData(list, isNew = false) {
    const data = this._data;

    for (const itemDirty of list) {
      let storeItem = new OfferItem(itemDirty, this);
      storeItem.setAsNew(isNew);

      if (data.has(storeItem.id)) {
        const existItem = data.get(storeItem.id);
        existItem.updateDirtyData(itemDirty);
        existItem.setAsNew(isNew);
        storeItem = null;
      } else {
        data.set(storeItem.id, storeItem);
      }
    }
  }

  @computed
  get list() {
    const items = [];
    const data = this._data;

    for (const [id, item] of data.entries()) {
      items.push(item);
    }

    return items;
  }

  @computed
  get min() {
    let min = null;
    const data = this._data;

    for (const [id, offer] of data.entries()) {
      const sum = offer?.data?.sum;

      if (min === null || sum < min) {
        min = sum;
      }
    }

    return min;
  }

  @computed
  get tableList() {
    const items = [];
    const data = this._data;
    for (const [id, offer] of data.entries()) {
      items.push({
        id,
        offer,
      });
    }

    return items;
  }

  get dirtyList() {
    const items = [];
    const data = this._data;

    for (const [id, item] of data.entries()) {
      items.push(item.dirtyData);
    }

    return items;
  }

  @computed
  get hasAccepted() {
    const data = this._data;
    for (const [id, item] of data.entries()) {
      if (item.data.status === 2) {
        return true;
      }
    }
  }
}

export default OfferList;
