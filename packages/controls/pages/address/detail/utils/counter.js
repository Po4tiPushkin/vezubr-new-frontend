import { validators as validatorsContacts } from '../../../../forms/address/address-contacts-form/';
import { validators as validatorsMain } from '../../../../forms/address/address-main-form/';

const addressCounterContactErrors = (context) => {
  const { addressInfo: { contacts: addressContacts = [] } = {} } = context;
  return Object.keys(validatorsContacts).reduce((count, fieldName) => {
    const fieldValue = addressContacts?.[0]?.[fieldName];
    const hasError = validatorsContacts[fieldName](fieldValue, addressContacts?.[0] || {});
    return count + (hasError ? 1 : 0);
  }, 0);
};

const addressCounterMainErrors = (context) => {
  const { addressInfo } = context;
  return Object.keys(validatorsMain).reduce((count, fieldName) => {
    const fieldValue = addressInfo?.[fieldName];
    const hasError = validatorsMain[fieldName](fieldValue, addressInfo || {});
    return count + (hasError ? 1 : 0);
  }, 0);
};

export {
  addressCounterContactErrors,
  addressCounterMainErrors
};
