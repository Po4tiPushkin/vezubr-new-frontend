import { validateAddressItemLoadingType, validateAddressItemPhone, validateMinLengthValue } from './fields';
import { validateEmail, validateEmpty } from '@vezubr/common/validators/fields';
import * as Address from '@vezubr/address';

export default {
  ...Address.Validators.validateAddressItem,
  loadingType: (loadingType, address, data) => {
    const { disabledLoadingTypesByVehicleAndBody, orderType } = data;
    return orderType !== 2 ? validateAddressItemLoadingType({ loadingTypeId: loadingType, disabledLoadingTypesByVehicleAndBody, isRequired: true }) : false;
  },
  email: (email) => validateEmail(email, false),
};
