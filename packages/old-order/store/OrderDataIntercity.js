import { observable, computed } from 'mobx';
import OrderDataBase from './OrderDataBase';

class OrderDataIntercity extends OrderDataBase {
  get _excludeForSave() {
    return [
      ...super._excludeForSave,
      'contourTreeData'
    ];
  }

  orderType = 3;

  @observable.struct requiredDocumentsCategories = undefined;

  @observable _orderCategory = 1;

  @computed
  get orderCategory() {
    return this._orderCategory || null
  }

  set orderCategory(orderCategory) {
    this._orderCategory = orderCategory
  }

  @computed
  get disabled__requiredDocumentsCategories() {
    return  this.isDisabledMain
  }
}

export default OrderDataIntercity;
