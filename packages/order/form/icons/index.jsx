import { IconDeprecated } from '@vezubr/elements';
import React from 'react';

export function getGreyBitmapIconNameTruck(orderType) {
  let truckName = 'truckUnknownGray';

  switch (orderType) {
    case 1:
      truckName = 'truckGray';
      break;
    case 2:
      truckName = 'truckLoaderGrey2';
      break;
    case 3:
      truckName = 'truckIntercityGray';
      break;
  }

  return truckName;
}
export function renderGreyBitmapIconTruck(orderType, orderCategory) {
  return <IconDeprecated name={
    orderCategory
      ? orderType !== 2
        ? `orderCategory${orderCategory}Black`
        : `truckLoaderBlack2`
      : getBlackBitmapIconNameTruck(orderType)
  } />;
}

export function getBlackBitmapIconNameTruck(orderType) {
  let truckName = 'truckUnknownBlack';

  switch (orderType) {
    case 1:
      truckName = 'truckBlack';
      break;
    case 2:
      truckName = 'truckLoaderBlack2';
      break;
    case 3:
      truckName = 'truckIntercityBlack';
      break;
  }

  return truckName;
}
export function renderBlackBitmapIconTruck(orderType, orderCategory) {
  return (
    <IconDeprecated
      name={
        orderCategory
          ? orderType !== 2
            ? `orderCategory${orderCategory}Black`
            : `truckLoaderBlack2`
          : getBlackBitmapIconNameTruck(orderType)
      }
    />
  );
}

export function getBlueBitmapIconNameTruck(orderType) {
  let truckName = 'truckUnknownBlack';

  switch (orderType) {
    case 1:
      truckName = 'truckBlue';
      break;
    case 2:
      truckName = 'truckLoaderBlue';
      break;
    case 3:
      truckName = 'truckIntercityBlue';
      break;
  }

  return truckName;
}
export function renderBlueBitmapIconTruck(orderType, orderCategory) {
  return (
    <IconDeprecated
      name={
        orderCategory
          ? orderType !== 2
            ? `orderCategory${orderCategory}Blue`
            : `truckLoaderBlue`
          : getBlueBitmapIconNameTruck(orderType)
      }
    />
  );
}

export function getBitmapIconNameTruck(orderType, hasProblem, notification, defaultColor = 'Blue') {
  let truckName = 'truckUnknown';

  switch (orderType) {
    case 1:
      truckName = 'truck';
      break;
    case 2:
      truckName = 'truckLoader';
      break;
    case 3:
      truckName = 'truckIntercity';
      break;
  }

  const status = notification ? 'Yellow' : hasProblem ? 'Red' : defaultColor;

  return `${truckName}${status}`;
}
export function renderBitmapIconTruck(orderType, orderCategory, hasProblem, notification) {
  return (
    <IconDeprecated
      name={
        orderCategory
          ? orderType !== 2
            ? `orderCategory${orderCategory}${hasProblem ? 'Red' : 'Blue'}`
            : `truckLoader${hasProblem ? 'Red' : 'Blue'}`
          : getBitmapIconNameTruck(orderType, hasProblem, notification)
      }
    />
  );
}

export function getBitmapIconBgNameTruck(orderProblem, notification) {
  return orderProblem ? 'truckBgRed' : notification ? 'truckBgYellow' : 'truckBgGray';
}
