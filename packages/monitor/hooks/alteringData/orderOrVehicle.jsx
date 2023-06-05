import React, { useContext } from 'react';
import _intersection from 'lodash/intersection';
import { useObserver } from 'mobx-react';

import { MonitorContext } from '../../context';
import { VEHICLE_BODY_GROUPS, VEHICLE_BODY_GROUPS_BODY_TYPES } from '@vezubr/common/constants/constants';
import { CLS_PREFIX } from './constant.ts';

export const useVehicleInfo = (vehicle, requiredVehicleType, requiredBodyTypes) => {
  const cls = `${CLS_PREFIX}-vehicle-info`;

  const { dictionaries } = useContext(MonitorContext);

  return useObserver(() => {

    if (!vehicle && !requiredBodyTypes && !requiredVehicleType) {
      return {}
    }
    const { vehicleBodies, vehicleTypesList } = dictionaries;
    const {vehicleTypeTitle, bodyType } = vehicle || {};

    let bodyTypeTitle = '';
    if (bodyType) {
      bodyTypeTitle = vehicleBodies.find(el => el.id === bodyType)?.title
    }
    else {
      bodyTypeTitle = requiredBodyTypes.map(item => {
        return  <div key={item} >{vehicleBodies.find(el => el.id === item)?.title}</div> 
      })
    }

    const finalVehicleType = React.useMemo(() => vehicleTypesList?.find((item) => item.id == requiredVehicleType)?.name || vehicleTypeTitle || '-', [requiredVehicleType, vehicleTypeTitle])

    return {
      [cls]: {
        rowClassName: 'last-free',
        items: {
          [`${cls}__type`]: {
            title: 'Тип тс',
            value: finalVehicleType ,
          },
          [`${cls}__body-group`]: {
            title: 'Тип кузова',
            value: bodyTypeTitle,
          },
        },
      },
    };
  });
};
