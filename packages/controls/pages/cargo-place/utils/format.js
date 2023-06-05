
function operationMToCm(value) {
  return value * 100;
}

function operationCmToM(value) {
  return (value / 100).toFixed(2)
}

function operationM3ToCm3(value) {
  return value * 10 ** 6;
}

function operationCm3ToM3(value) {
  return (value / 10 ** 6).toFixed(6)
}

function operationKgToG(value) {
  return value * 1000;
}

function operationGrToKg(value) {
  return (value / 1000).toFixed(3)
}

function setOperation(value, funcOperation) {
  if (!value) {
    return value
  }

  return funcOperation(value);
}

export function undecorateUnits(cargo) {
  const data = { ...cargo };

  data.length = setOperation(data.length, operationMToCm);
  data.width = setOperation(data.width, operationMToCm);
  data.height = setOperation(data.height, operationMToCm);
  data.volume = setOperation(data.volume, operationM3ToCm3);
  data.weight = setOperation(data.weight, operationKgToG);

  return data;
}

export function decorateUnits(data) {

  const length = setOperation(data.length, operationCmToM);
  const width = setOperation(data.width, operationCmToM);
  const height = setOperation(data.height, operationCmToM);
  const volume = setOperation(data.volume, operationCm3ToM3);
  const weight = setOperation(data.weight, operationGrToKg);

  return { ...data, length, width, height, volume, weight };
}


export function decorateCargoPlace(orderInput) {
  let data = { ...orderInput };
  data = decorateUnits(data);

  return data;
}
export function undecorateCargoPlace(cargoInfo) {
  let data = { ...cargoInfo };

  data = undecorateUnits(data);

  data.departureAddress = data.departurePoint.id.toString();
  delete data.departurePoint;

  data.deliveryAddress = data.deliveryPoint.id.toString();
  delete data.deliveryPoint;

  if (data.statusAddress?.id === '') {
    delete data.statusAddress;
  } else {
    data.statusAddress = data.statusAddress.id.toString();
  }

  if (data.deliveryIntervalBegin) {
    data.deliveryIntervalBegin = moment(data.deliveryIntervalBegin).format('YYYY-MM-DD');
  }

  if (data.deliveryIntervalEnd) {
    data.deliveryIntervalEnd = moment(data.deliveryIntervalEnd).format('YYYY-MM-DD');
  }

  if (data.contractorOwner && APP === 'client') {
    data.contractorOwner = data.contractorOwner?.id;
  }


  delete data.createdAt;
  delete data.isDeleted;

  return data;
}