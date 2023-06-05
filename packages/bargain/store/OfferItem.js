import { observable, computed, action, runInAction, toJS, flow } from 'mobx';
import { formatOffer } from '../utils';

class OfferItem {
  @observable _data;

  @observable _isNew = false;

  _id;

  _store;

  get store() {
    return this._store;
  }

  constructor(data, store) {
    this._store = store;
    this._id = data.id;
    this.setDirtyData(data);
  }

  @action
  setProcessing(name) {
    this._store.setItemProcessing(this.id, name);
  }

  @action
  addToStore() {
    this._store.addToStore(this);
  }

  @action
  clearProcessing() {
    this._store.clearItemProcessing(this.id);
  }

  @computed
  get processing() {
    const { id, name } = this._store.itemProcessing;
    return (id === this.id && name) || null;
  }

  @computed
  get isHasProcessing() {
    return this._store.isItemProcessing;
  }

  @action
  setAsNew(flag) {
    this._isNew = !!flag;
  }

  @computed
  get isNew() {
    return this._isNew;
  }

  @action
  delete() {
    this._store.deleteItem(this.id);
  }

  @action
  setDirtyData(data) {
    this._data = data;
  }

  @action
  updateDirtyData(data) {
    this._data = {
      ...this._data,
      ...data,
    };
  }

  @computed
  get id() {
    return this._id;
  }

  get dirtyData() {
    return toJS(this._data);
  }

  @computed
  get data() {
    return formatOffer(this._data);
  }
}

export default OfferItem;
