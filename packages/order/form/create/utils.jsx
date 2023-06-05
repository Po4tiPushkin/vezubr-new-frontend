import { CargoPlace as CargoPlaceService } from "@vezubr/services";

export const countCargoPlacesInAddress = (address, index, addresses, cargoPlaces) => {
  const cargoInfo = {
    departure: 0,
    arrival: 0,
    trueAddress: false,
  };

  if (cargoPlaces.length === 0) {
    cargoInfo.trueAddress = true;
    return cargoInfo;
  }

  if (address.isNew) {
    return cargoInfo;
  }

  let position = index + 1;

  for (let i = index; i > -1; i--) {
    if (addresses?.[i]?.isNew) {
      position -= 1;
      break;
    }
  }

  return cargoPlaces.reduce((cargoInfo, item) => {
    if (position === item.departurePointPosition) {
      cargoInfo.departure = cargoInfo.departure + 1;
    }

    if (position === item.arrivalPointPosition) {
      cargoInfo.arrival = cargoInfo.arrival + 1;
    }

    cargoInfo.trueAddress = true;
    cargoInfo.position = index;

    return cargoInfo;
  }, cargoInfo);
};



export const isEmptyAddresses = (values) => {
  let countEmptyAddresses = 0;
  const addresses = values.addresses;
  addresses.forEach((address, index) => {
    const { trueAddress, arrival, departure } = countCargoPlacesInAddress(address, index, addresses, values.cargoPlaces);
    if (trueAddress) {
      if (!arrival && !departure) {
        countEmptyAddresses++;
      }
    }
  });

  return countEmptyAddresses > 0;
}

export const getAllCargoPlace = async () => {
  let result = [];
  let countCargoPlace = 0;
  let countCargoPlaceMax = 0;
  let page = 1;

  do {
    const cargoPlaceData = (await CargoPlaceService.listForOrder({
      itemsPerPage: 4000,
      page: +page,
    }));

    if (cargoPlaceData?.data.length === 0) {
      break;
    }

    countCargoPlace = cargoPlaceData?.data.length;
    countCargoPlaceMax = cargoPlaceData?.itemsCount;
    page += 1;
    result = [...result, ...cargoPlaceData?.data];
  } while (countCargoPlace <= countCargoPlaceMax);

  return result;
}