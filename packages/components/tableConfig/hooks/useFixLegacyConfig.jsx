import React, { useMemo } from 'react';

const useFixLegacyConfig = (config, tableKey) => {
  const fixLegacyConfig = useMemo(() => {
    if (!config?.columns) {
      return config;
    }
    const newConfig = { ...config }
    switch (tableKey) {
      case 'cargo-place-client':
      case 'cargo-place-dispatcher':
      case 'cargo-place-producer':
        return newConfig;
      case 'orders-client':
      case 'orders-dispatcher':
      case 'orders-producer':
        if (newConfig.columns.frontend_client_status) {
          newConfig.columns.orderUiState = newConfig.columns.frontend_client_status;
          delete newConfig.columns.frontend_client_status;
        }
        if (newConfig.vehicleTypeTitle) {
          newConfig.columns.requiredVehicleTypeId = newConfig.columns.vehicleTypeTitle
          delete newConfig.columns.vehicleTypeTitle
        }
        return newConfig
      case 'auctions-client':
      case 'auctions-dispatcher':
      case 'auctions-producer':
        if (newConfig.columns.id) {
          newConfig.columns.orderId = newConfig.columns.id;
          delete newConfig.columns.id
        }
        return newConfig;
      case 'clients-dispatcher':
      case 'clients-producer':
        if (newConfig.columns.condition) {
          let temp = newConfig.columns.status
          newConfig.columns.status = newConfig.columns.condition;
          newConfig.columns.contourStatus = temp;
          delete newConfig.columns.condition;
        }
        return newConfig;
      case 'addresses-client':
      case 'addresses-dispatcher':
        if (newConfig.columns.mobilePhone) {
          newConfig.columns.phone = newConfig.columns.mobilePhone;
          delete newConfig.columns.mobilePhone;
        }
        if (newConfig.columns.landlinePhone) {
          newConfig.columns.phone2 = newConfig.columns.landlinePhone;
          delete newConfig.columns.landlinePhone;
        }
        if (newConfig.columns.extraLandlinePhone) {
          newConfig.columns.extraPhone = newConfig.columns.extraLandlinePhone;
          delete newConfig.columns.extraLandlinePhone
        }
        if (newConfig.columns.id) {
          newConfig.columns.number = newConfig.columns.id;
          delete newConfig.columns.id;
        }
        return newConfig
      case 'tractors-producer':
      case 'tractors-dispatcher':
        return newConfig
      case 'trailers-producer':
      case 'trailers-dispatcher':
        return newConfig
      case "producer-registries-create-producer":
      case "producer-registries-create-dispatcher":
        if (newConfig.columns.orderNr) {
          newConfig.columns.order_nr = newConfig.columns.orderNr
          delete newConfig.columns.orderNr
        }
        if (newConfig.columns.requestNr) {
          newConfig.columns.request_nr = newConfig.columns.requestNr
          delete newConfig.columns.requestNr
        }
        return newConfig
      default:
        if (newConfig.columns.id || newConfig.columns.orderId || newConfig.columns.order_id) {
          newConfig.columns.number = newConfig.columns.id || newConfig.columns.orderId || newConfig.columns.order_id;
          delete newConfig.columns.id;
          delete newConfig.columns.orderId;
          delete newConfig.columns.order_id;
        }
        return newConfig;
    }
  }, [config, tableKey]);
  return fixLegacyConfig;
};

export default useFixLegacyConfig;