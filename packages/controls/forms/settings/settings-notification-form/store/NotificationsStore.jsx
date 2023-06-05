import { observable, computed, action, extendObservable } from 'mobx';
import _reduce from 'lodash/reduce';
import _concat from 'lodash/concat';
import _uniq from 'lodash/uniq';
import { computedFn } from 'mobx-utils';
import { NOTIFICATIONS_GROUP_STATUSES, NOTIFICATIONS_TIMEOUT_TYPE } from '../constant';

function checkTimeoutProps(timeOutType) {
  if (!NOTIFICATIONS_TIMEOUT_TYPE[timeOutType]) {
    throw new Error('Has no timeout status ' + timeOutType);
  }
}

class StoreData {
  @observable smsSendingTimeFrom = '08:00';
  @observable smsSendingTimeTo = '18:00';
  @observable mode = 'all';
  @observable sendMode = 'always';
}

export class NotificationsStore {
  @observable _sending = false;
  @observable _loading = false;
  @observable _disabled = false;
  @observable _edited = false;

  _data = (() => {
    const data = new StoreData();
    for (const timeOutType of Object.keys(NOTIFICATIONS_TIMEOUT_TYPE)) {
      extendObservable(data, {
        [timeOutType]: observable.map([], { deep: false }),
      });
    }
    return data;
  })();

  getTimeoutItem = computedFn(function (status, timeOutType) {
    checkTimeoutProps(timeOutType);
    const data = this._data[timeOutType];
    return data.get(status);
  });

  @action
  setTimeoutItem(status, value, timeOutType) {
    checkTimeoutProps(timeOutType);
    const data = this._data[timeOutType];
    this._edited = true;
    data.set(status, value);
  }

  getItem = computedFn(function (prop) {
    return this._data[prop];
  });

  @action
  getValidateData() {
    const notifications = [];

    const statuses = _reduce(NOTIFICATIONS_GROUP_STATUSES, (result, value) => _uniq(_concat(result, value)), []);

    for (const status of statuses) {
      const values = {};
      for (const timeOutType of Object.keys(NOTIFICATIONS_TIMEOUT_TYPE)) {
        const value = this.getTimeoutItem(status, timeOutType);
        values[timeOutType] = typeof value === 'undefined' ? -1 : value;
      }

      if (Object.keys(values).length > 0) {
        notifications.push({
          status,
          ...values,
        });
      }
    }

    const values = {
      notifications,
    };

    values.interface = {
      smsSendingTimeFrom: this.getItem('smsSendingTimeFrom'),
      smsSendingTimeTo: this.getItem('smsSendingTimeTo'),
      sendMode: this.getItem('sendMode'),
    };

    values.mode = this.getItem('mode')

    return {
      values,
    };
  }

  @action
  setItem(prop, value) {
    this._edited = true;
    this._data[prop] = value;
  }

  @action
  setSending(flag) {
    this._sending = flag;
  }

  @action
  setLoading(flag) {
    this._loading = flag;
  }

  @action
  setDirtyData(data) {
    for (const noteProp of data?.notifications || []) {
      const { status } = noteProp;
      for (const timeOutType of Object.keys(NOTIFICATIONS_TIMEOUT_TYPE)) {
        if (typeof noteProp[timeOutType] !== 'undefined') {
          this.setTimeoutItem(status, noteProp[timeOutType], timeOutType);
        }
      }
    }
    Object.assign(this._data, {
      ...data?.interface,
      mode: data?.mode || 'all'
    } || {});
  }

  @action
  setDisabled(flag) {
    this._disabled = flag;
  }

  @action
  setEdited(edited) {
    this._edited = edited
  }

  @computed
  get isLoading() {
    return this._loading;
  }

  @computed
  get isSending() {
    return this._sending;
  }

  @computed
  get isEdited() {
    return this._edited;
  }

  @computed
  get isDisabled() {
    return this._disabled || this.isSending || this.isLoading;
  }
}
