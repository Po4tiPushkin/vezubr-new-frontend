import { observable, computed, action, runInAction, toJS } from 'mobx';

class MonitorItemBase {
  static get type() {
    throw new Error('static get type must be overridden');
  }

  static getIdFromDirtyData(data) {
    return data.id;
  }

  _id;

  @observable _data;

  _store;

  constructor(data, store) {
    this._id = this.constructor.getIdFromDirtyData(data);
    this._store = store;
    this.setDirtyData(data);
  }

  get id() {
    return this._id;
  }

  @action.bound
  openPopup() {
    this._store.openPopup(this);
  }

  @action
  setDirtyData(data) {
    this._data = data;
  }

  @action
  updateDirtyData(data) {
    Object.assign(this._data, data);
  }

  @action
  delete() {
    this._store.deleteItem(this.id, this.constructor.type);
  }

  @computed
  get dataDirty() {
    return toJS(this._data);
  }

  @computed
  get data() {
    throw new Error('data must be overridden');
  }

  @computed
  get groupBy() {
    throw new Error('groupBy must be overridden');
  }

  @computed
  get position() {
    throw new Error('position must be overridden');
  }

  @computed
  get hasProblem() {
    throw new Error('hasProblem must be overridden');
  }

  @computed
  get problems() {
    throw new Error('problems must be overridden');
  }

  get type() {
    throw new Error('mapViewType must be overridden');
  }
}

export default MonitorItemBase;
