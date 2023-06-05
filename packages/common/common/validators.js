import t from '../localization';
import {
  createEditAddress,
  createEditUser,
  createEditOrder,
  createEditOrderLoader,
  createEditProducerVehicle,
  createEditProducerDriver,
  editProducerProfile,
  editProducerProfileAggregator,
  editClientProfile,
  editOperatorProfile,
  createEditProducerLoader,
  createEditTrailer,
  createEditInsurerContract,
  createEditContour,
  createChildCounterparty
} from './validators/index';

const showErrorOnAlert = [26, 27, 28];

class Validators {
  static get createEditAddress() {
    return createEditAddress;
  }

  static get createEditUser() {
    return createEditUser;
  }

  static get createEditOrder() {
    return createEditOrder;
  }

  static get createEditOrderLoader() {
    return createEditOrderLoader;
  }

  static get editProducerProfile() {
    return editProducerProfile;
  }

  static get editProducerProfileAggregator() {
    return editProducerProfileAggregator;
  }

  static get editClientProfile() {
    return editClientProfile;
  }

  static get editOperatorProfile() {
    return editOperatorProfile;
  }

  static get createEditTrailer() {
    return createEditTrailer;
  }

  static get createEditInsurerContract() {
    return createEditInsurerContract;
  }

  static get createEditContour() {
    return createEditContour;
  }

  static additionalOrderCreationValidations(data) {
    if (data.addresses && data.addresses.length === 1 && data.requiredPassesDetectionMode === 1) {
      return t.error('selectManualPass');
    }
    return false;
  }

  static handleOrderCreateExpections(err) {
    const errorText = err.error_str || t.error(err.error_no || err?.data?.error_no) || t.error('genericError');
    return {
      alert: err.error_no !== 26,
      code: err.error_no || err?.data?.error_no,
      message: errorText,
      additionalInfo: err.additionalInfo,
    };
  }

  static handleDriverCreateExceptions(err) {
    const errorText = err.error_str || t.error(err.error_no || err?.data?.error_no) || t.error('genericError');
    return {
      code: err.code,
      additionalInfo: err.data,
    }; 
  }

  static handleTractorCreateExceptions(err) {
    const errorText = err?.data?.message || err?.error_str || t.error(err?.error_no || err?.data?.error_no) || t.error('genericError');

    return {
      code: err?.code,
      errors: err?.data?.errors,
      message: errorText || null,
    }; 
  }

  static serializeErrors(err) {
    const errors = err?.additionalInfo?.formErrors || err?.additionalInfo;
    if (errors) {
      return errors.map((error) => {
        return {
          key: error.field,
          value: t.error(error.field),
          rawError: error.message,
        };
      });
    }
    return [];
  }

  static get createEditProducerVehicle() {
    return createEditProducerVehicle;
  }

  static get createEditProducerDriver() {
    return createEditProducerDriver;
  }

  static get createEditProducerLoader() {
    return createEditProducerLoader;
  }

  static get createChildCounterparty() {
    return createChildCounterparty;
  }

  static validateServiceInfo(reqData) {
    if (reqData.creditLimit > 0 && reqData.paymentDelay < 1) {
      return { type: 'paymentDelay', message: t.error('requiredField') };
    } else if (reqData.creditLimit < 1 && reqData.paymentDelay > 0) {
      return {
        type: 'paymentDelay',
        message: t.error('При лимите кредита равным нулю значение поля "Отсрочка" может быть только "Без отсрочки".'),
      };
    }
    return false;
  }
}

export default Validators;
