import t from '@vezubr/common/localization';
import validateOrderBase from './validateOrderBase';
import { CONTOUR_MAIN_ID } from '@vezubr/common/constants/contour';
import validateAddressItem from './validateAddressItem';
import * as Address from '@vezubr/address';

export default (regular) => ({
  ...validateOrderBase(regular),
  requiredPasses: (requiredPasses, data) => {
    const { addresses: addressInput } = data;

    const addresses = Address.Utils.getRealAddresses(addressInput);

    if (requiredPasses === 0 && addresses.length === 1) {
      return 'Так как указан один адрес, то для маршрутного листа надо явно указать требуется пропуск и какой или не требуется';
    }

  },

});
