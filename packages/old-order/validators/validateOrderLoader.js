import t from '@vezubr/common/localization';
import validateOrderBase from './validateOrderBase';
import * as Address from '@vezubr/address';
import validateAddressItem from './validateAddressItem';

export default (regular) =>  ({
  ...validateOrderBase(regular),
  addresses: Address.Validators.createValidateAddresses(validateAddressItem, (addresses) => {
    let field = null;
    if (!addresses.length) {
      field = t.error('provideAddress');
    }
    return field;
  }),

  loadersCount: (loadersCount) => !loadersCount && 'Укажите количество специалистов',
  requiredLoaderSpecialities: (requiredLoaderSpecialities) => { 
    let errors = false;
    Object.keys(requiredLoaderSpecialities).forEach(el => {
      if (!requiredLoaderSpecialities[el]) {
        errors = {...errors, [el]: 'Укажите количество специалистов'}
      }
    })
    return errors;
  },
  bodyTypes: undefined,
  vehicleType: false,
});
