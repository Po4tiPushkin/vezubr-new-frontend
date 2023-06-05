import { observable, computed, action } from 'mobx';
import { computedFn } from 'mobx-utils';
import { Registries as RegistriesService } from '@vezubr/services';

class Disband {
  @observable _state = false;
  @observable _selected = {};
  @observable _sending = false;

  @computed
  get isSending() {
    return this._sending;
  }

  @computed
  get state() {
    return this._state;
  }

  @computed
  get hasChoose() {
    return Object.values(this._selected).reduce((accumulator, currentValue) => {
      if (currentValue) {
        return true;
      }
      return accumulator;
    }, false);
  }

  getSelected = computedFn(function getSelectedFunc(orderId) {
    return this._selected[orderId];
  });

  @action.bound
  clear() {
    this._state = false;
    this._selected = {};
    this._sending = false;
  }

  @action
  setState(flag) {
    this._state = flag;
  }

  @action
  _setSending(flag) {
    this._sending = flag;
  }

  @action
  setSelected(orderId, actId) {
    const selected = this.getSelected(orderId);
    if (selected) {
      delete this._selected[orderId];
      return;
    }
    this._selected[orderId] = actId;
  }

  @action
  async send(registryId) {
    const orders = Object.keys(this._selected).map((id) => ({
      id,
      state: this._selected[id],
    }));

    const ordersCountToReform = orders.length;

    this._setSending(true);

    try {
      await RegistriesService.reform({ registryId, orders });
      this.clear();
      return ordersCountToReform;
    } catch (e) {
      this._setSending(false);
      throw e;
    }
  }
}

export default new Disband();
