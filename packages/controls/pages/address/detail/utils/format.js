export function undecorateAddress(values) {
  const data = { ...values };
  data.cart = data.cart ? 1 : 0;
  data.elevator = data.elevator ? 1 : 0;
  data.isFavorite = data.isFavorite ? 1 : 0;
  data.necessaryPass = data.necessaryPass ? 1 : 0;
  data.status = data.status ? 1 : 0;

  delete data.cityFiasId;
  delete data.addressOriginal;
  delete data.createdByFullName;
  delete data.createdById;
  delete data.verifiedByFullName;
  delete data.verifiedById;
  delete data.pointOwner;
  delete data.regionName;
  delete data.source;
  delete data.contractorOwner;
  delete data.extraPhone;
  delete data.extraPhone2;
  delete data.email;
  delete data.contact;
  delete data.phone;
  delete data.phone2;

  return data;
}

export function undecorateDataForCreateAddress(values) {
  const data = { ...undecorateAddress(values) };

  if (data.maxHeightFromGroundInCm) {
    data.maxHeightFromGroundInCm = Math.round(data.maxHeightFromGroundInCm * 100);
  }

  return data;
}

export function decorateAddress(values) {
  const data = { ...values };

  data.verifiedByFullName = data?.verifiedBy?.fullName || '';
  data.verifiedById = data?.verifiedBy?.id || '';

  delete data.verifiedBy;

  data.createdByFullName = data?.createdBy?.fullName || '';
  data.createdById = data?.createdBy?.id || '';

  delete data.createdBy;

  return data;
}

export function toDefaultUnits(address) {
  const data = address;

  const maxHeightFromGroundInCm = data?.maxHeightFromGroundInCm * 100;

  return {
    ...data,
    maxHeightFromGroundInCm,
  }
}

export function toUnDefaultUnits(address) {
  const data = address;

  const maxHeightFromGroundInCm = (data?.maxHeightFromGroundInCm / 100).toFixed(2);
  return {
    ...data,
    maxHeightFromGroundInCm,
  }
}
