import React from 'react';
import moment from 'moment';
import { useObserver } from 'mobx-react';
import { CLS_PREFIX } from './constant.ts';
import { formatDateTime } from '../../utils';
import useUpdateByTimer from '@vezubr/common/hooks/useUpdateByTimer';
import t from '@vezubr/common/localization';

export const useOrderLoadersInfo = (order, dictionaries) => {
  const cls = `${CLS_PREFIX}-loaders-info`;

  return useObserver(() => {
    const { requiredLoaderSpecialities, orderType } = order.data;

    if (typeof requiredLoaderSpecialities === 'undefined' || orderType !== 2) {
      return {};
    }

    return {
      [cls]: {
        items: {
          [`${cls}__value`]: {
            title: 'Требуемые специалисты:',
            value: Object.entries(requiredLoaderSpecialities || {}).map(([key, value]) => (
              <div className=''>
                <span >
                  {dictionaries?.loaderSpecialities?.find((item) => item.id == key)?.title + ': ' + value}
                </span>
              </div>
            )),
          },
        },
      },
    };
  });
};

export const useOrderStartAddressDateTimeInfo = (order) => {
  const clsDate = `${CLS_PREFIX}-date-time`;
  const clsAddress = `${CLS_PREFIX}-address`;

  return useObserver(() => {
    const { startAtLocal, firstPoint } = order.data;

    const dateTime = formatDateTime(startAtLocal);

    if (!firstPoint) {
      return {}
    }

    return {
      [clsDate]: {
        rowClassName: 'free',
        items: {
          [`${clsDate}_date`]: {
            title: 'Дата и время подачи',
            value: `${dateTime.date} ${dateTime.time}`,
          },
        },
      },

      [clsAddress]: {
        items: {
          [`${clsAddress}__first-point`]: {
            title: 'Адрес подачи',
            value: firstPoint.addressString,
          },
        },
      },
    };
  });
};

export const useOrderLastUpdatedInfo = (order) => {
  const cls = `${CLS_PREFIX}-last-updated`;

  useUpdateByTimer(10000);

  const lastApiCall = useObserver(() => {
    const { vehicle, lastApiCallAt } = order.data;
    return vehicle?.lastGpsSentAt || vehicle?.lastApiCallAt || lastApiCallAt;
  });

  const lastApiCallInfo = lastApiCall && {
    items: {
      [`${cls}__name`]: {
        value: 'Обновлено',
      },
      [`${cls}__value`]: {
        value: moment.unix(lastApiCall).fromNow(),
      },
    },
  };

  return {
    ...(lastApiCallInfo ? { [cls]: lastApiCallInfo } : {}),
  };
};

export const useOrderRequirements = (order) => {
  const cls = `${CLS_PREFIX}-loaders-info`;

  return useObserver(() => {
    const { requirements } = order;
    if (!Array.isArray(requirements) || !requirements.length) {
      return {};
    }

    return {
      [cls]: {
        items: {
          [`${cls}__value`]: {
            title: 'Дополнительные требования:',
            value: requirements.map(el => t.order(`requirements.${el}`)).join(', '),
          },
        },
      },
    };
  });
};