import React from 'react';
import { divIcon, Icon } from 'leaflet';
import { IconDeprecated as IconVZ } from '@vezubr/elements';
import { renderToString } from 'react-dom/server';

import * as pinImages from './divIconImages';

import iconDefault from '../../common/assets/img/map/marker-icon.png';
import iconDefault2x from '../../common/assets/img/map/marker-icon-2x.png';
import iconDefaultShadow from '../../common/assets/img/map/marker-shadow.png';
import useCreateClusterIconFunc from '../hooks/useCreateClusterIconFunc';

export const PinIconDefault = new Icon({
  iconUrl: iconDefault,
  iconRetinaUrl: iconDefault2x,
  shadowUrl: iconDefaultShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export function pinDivIcon({ text, pinName, alt }) {
  return divIcon({
    className: 'pin-icon-marker',
    html: renderToString(
      <div className={'pin-wrapper'}>
        <img src={pinImages[pinName]} width={30} height={43} alt={alt} />
        {typeof text !== 'undefined' && <span className={'pin-content'}>{text}</span>}
      </div>,
    ),
    iconSize: [30, 43],
    iconAnchor: [15, 43],
    popupAnchor: [1, -34],
    tooltipAnchor: [15, -28],
  });
}

export function pinDivBgIcon({ iconName, bgName }) {
  return divIcon({
    className: 'pin-icon-marker-bg',
    html: renderToString(
      <div className={'pin-wrapper'}>
        <div className="pin-bg">
          <IconVZ style={{ width: '56px', height: '56px' }} className={'wide big'} name={bgName} />
        </div>
        <div className="pin-content">
          <IconVZ className={'wide big'} style={{ width: '36px', height: '36px' }} name={iconName} />
        </div>
      </div>,
    ),
    iconSize: [40, 48],
    iconAnchor: [20, 1],
    popupAnchor: [0, 10],
    tooltipAnchor: [20, 24],
  });
}

export { pinImages, useCreateClusterIconFunc };
