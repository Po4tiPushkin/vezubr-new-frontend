import { useObserver } from 'mobx-react';
import moment from 'moment';
import { CLS_PREFIX } from './constant.ts';
import useUpdateByTimer from '@vezubr/common/hooks/useUpdateByTimer';

export const useVehicleLastUpdatedInfo = (vehicle) => {
  const cls = `${CLS_PREFIX}-last-updated`;

  useUpdateByTimer(10000);

  return useObserver(() => {
    const { lastGpsSentAt, lastApiCallAt } = vehicle.data;
    const lastApiCall = lastGpsSentAt || lastApiCallAt;

    const lastApiCallInfo = lastApiCall && {
      items: {
        [`${cls}__name`]: {
          value: 'Обновлено',
        },
        [`${cls}__value`]: {
          value: moment(lastApiCall).fromNow(),
        },
      },
    };

    return {
      ...(lastApiCallInfo ? { [cls]: lastApiCallInfo } : {}),
    };
  });
};
