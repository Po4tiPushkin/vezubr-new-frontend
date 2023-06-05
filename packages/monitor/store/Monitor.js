import { observable, computed, action, runInAction, toJS } from 'mobx';
import { computedFn, deepObserve } from 'mobx-utils';
import moment from 'moment';
import { filterDates } from '../utils';
import itemTypes from './items';

class Monitor {
  _data = (() => {
    const data = {};
    for (const type of Object.keys(itemTypes)) {
      data[type] = observable.map([], { deep: false });
    }
    return data;
  })();

  @observable _vars = {};

  _interval = null;

  @observable.struct _time = moment();

  _props = observable.object({}, null, { deep: false });

  @observable _openedPopup = {
    id: null,
    type: null,
    timeStamp: null,
  };

  @action.bound
  _setTime() {
    this._time = moment();
  }

  @computed
  get time() {
    return this._time.clone();
  }

  onInit() {
    this._interval = setInterval(this._setTime, 30000);
  }

  onDestroy() {
    clearInterval(this._interval);
  }

  @action
  setVar(varName, varValue) {
    this._vars[varName] = varValue;
  }

  @action
  deleteVar(varName) {
    delete this._vars[varName];
  }

  getVarNoComputed(varName) {
    return this._vars?.[varName];
  }

  getVar = computedFn(function (varName) {
    return this._vars?.[varName];
  });

  @action
  setProp(propName, propValue) {
    this._props[propName] = propValue;
  }

  getProp = computedFn(function (propName) {
    return this._props?.[propName];
  });

  @action
  openPopup(item) {
    const { id, type } = item;
    const timeStamp = Date.now();
    this._openedPopup = {
      id,
      type,
      timeStamp,
    };
  }

  getItemById(id, type) {
    return this._data[type].get(id);
  }

  @computed
  get openedPopupInfo() {
    const { id, timeStamp, type } = this._openedPopup;
    return {
      item: type && this._data[type].get(id),
      type,
      timeStamp,
    };
  }

  @action _deleteByField(field, fieldValue, type) {
    const data = this._data[type];
    const iterator = data.entries();
    let entry = null;
    do {
      entry = iterator.next().value;
      const [id, item] = entry || [];
      if (item && item[field] === fieldValue) {
        data.delete(id);
      }
    } while (entry);
  }

  @action
  clearData(type) {
    if (!type || !itemTypes[type]) {
      Object.keys(this._data).forEach((type) => {
        this._data[type].clear();
      });
      return;
    }

    this._data[type].clear();
  }

  @action
  deleteItem(id, type) {
    this._data[type].delete(id);
  }

  @action
  deleteGroup(groupId, type) {
    this._deleteByField('groupBy', groupId, type);
  }

  @action
  setDirtyData(dataDirty, type) {
    let StoreItem = itemTypes[type];
    const data = this._data[type];

    for (const itemDirty of dataDirty) {
      const id = StoreItem.getIdFromDirtyData(itemDirty);
      if (data.has(id)) {
        const existItem = data.get(id);
        existItem.setDirtyData(itemDirty);
      } else {
        data.set(id, new StoreItem(itemDirty, this));
      }
    }
  }

  @action
  socketStatusChange(orderId, status) {
    const { order } = this._data;
    const items = [];
    for (const [id, item] of order.entries()) {
      if (item.id === orderId) {
        item.updateDirtyData({ uiState: { ...item.uiState, state: status } })
      }
    }

  }

  getItemsFilteredNoComputed(type, filterFunc, sortFunc) {
    const items = [];
    const data = this._data[type];
    for (const [id, item] of data.entries()) {
      if (!filterFunc || filterFunc(item)) {
        items.push(item);
      }
    }

    if (sortFunc) {
      return sortFunc(items);
    }

    return items;
  }

  dynamicParams() {
    return filterDates();
  }

  getItemsFiltered = computedFn(function (type, filterFunc, sortFunc) {
    return this.getItemsFilteredNoComputed(type, filterFunc, sortFunc);
  });
}

export default Monitor;
