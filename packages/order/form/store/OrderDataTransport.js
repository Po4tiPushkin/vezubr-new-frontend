import { computed, observable } from 'mobx';
import OrderDataBase from './OrderDataBase';
import { dateCreateMoment } from '@vezubr/common/utils';
import * as Address from '@vezubr/address';

class OrderDataTransport extends OrderDataBase {
  get _excludeForSave() {
    return [...super._excludeForSave, 'contourTreeData'];
  }

  @observable.struct _requiredPasses = -1;

  selectingStrategy = 1;

  @observable.struct loadersCountRequired = undefined;

  @observable.struct _loadersRequiredOnAddress = undefined;

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
    return this.isDisabledMain
  }

  @observable.struct loadersTime = undefined;

  @computed
  get loadersRequiredOnAddress() {
    return this._loadersRequiredOnAddress;
  }

  set loadersRequiredOnAddress(position) {
    this._loadersRequiredOnAddress = position;
    const { addresses: addressInput } = this;

    if (!this.loadersTime) {
      const addresses = Address.Utils.getRealAddresses(addressInput);
      const currentAddress = addresses[position - 1];
      if (currentAddress && currentAddress.requiredArriveAt) {
        this.loadersTime = dateCreateMoment(currentAddress.requiredArriveAt).format('HH:mm');
      }
    }
  }

  @computed
  get disabled__loadersRequiredOnAddress() {
    return !this.loadersCountRequired;
  }

  @computed
  get disabled__loadersTime() {
    return !this.loadersCountRequired;
  }


  @computed
  get requiredPasses() {
    const { addresses: addressInput } = this;
    const addresses = Address.Utils.getRealAddresses(addressInput);
    if (this._requiredPasses === -1) {
      if (addresses.length > 1) {
        return 0;
      }

      return null;
    }

    return this._requiredPasses;
  }

  set requiredPasses(value) {
    this._requiredPasses = value;
  }

  @computed
  get requiredPassesDetectionMode() {
    if (this.requiredPasses === null) {
      return 2;
    } else if (this.requiredPasses !== 0) {
      return 3;
    }

    return 1;
  }

  set requiredPassesDetectionMode(mode) {
    let value = 0;
    if (mode === 3) {
      value = 1;
    } else if (mode === 2) {
      value = null;
    }
    this.requiredPasses = value;
  }

  @observable.struct sanitaryPassportRequired = false;

  @observable.struct sanitaryBookRequired = false;

  @observable.struct hydroliftRequired = false;

  @observable.struct isCornerPillarRequired = false;

  @observable.struct isChainRequired = false;

  @observable.struct isStrapRequired = false;

  @observable.struct isTarpaulinRequired = false;

  @observable.struct isNetRequired = false;

  @observable.struct isWheelChockRequired = false;

  @observable.struct isGPSMonitoringRequired = false;

  @observable.struct isWoodenFloorRequired = false;

  @observable.struct isDoppelstockRequired = false;

  @observable.struct palletJackIsRequired = false;
  
  @observable.struct conicsIsRequired = false;

  @observable.struct fasteningIsRequired = false;

  @observable.struct isDriverLoaderRequired = false;

  @observable.struct isTakeOutPackageRequired = false;
}

export default OrderDataTransport;
