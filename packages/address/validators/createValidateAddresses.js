import { validateEmpty } from '@vezubr/common/validators/fields';
import t from '@vezubr/common/localization';
import _compact from 'lodash/compact';

export default (validateAddressItem, validateField) => {
  return (addresses, data) => {
    const realAddresses = addresses.filter((a) => !a.isNew);

    const field = validateField(realAddresses, data);

    const items = {};

    for (const address of realAddresses) {
      let errors = [];

      for (const addressField of Object.keys(validateAddressItem)) {
        errors.push(validateAddressItem[addressField](address[addressField], address, data));
      }

      errors = _compact(errors);

      if (errors.length > 0) {
        items[address.guid] = errors;
      }
    }

    if (Object.keys(items).length > 0 || field) {
      return JSON.stringify({
        items,
        field,
      });
    }

    return null;
  };
};
