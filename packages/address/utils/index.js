import { Utils } from '@vezubr/common/common';
import { fileGetFileData } from "@vezubr/common/utils";

export function getRealAddresses(addresses) {
  return (addresses || [])
    .filter((a) => !a.isNew)
    .map((a, index) => ({ ...a, position: index + 1 }))
    .map(getRealAddress);
}

export function getRealAddress(addressInput) {
  if (addressInput.isNew) {
    return null;
  }

  const address = {
    ...addressInput,
  };

  delete address.guid;
  return address;
}

export function getStoreAddress(address) {
  const newAddress = {
    ...address,
    guid: Utils.uuid,
  };

  newAddress.attachedFiles = (address.attachedFiles || []).map(fileGetFileData);

  newAddress.addressString = address.addressString || address.address;
  delete newAddress.address;
  return newAddress;
}
