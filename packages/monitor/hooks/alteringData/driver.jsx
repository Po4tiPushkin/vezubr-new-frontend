import { parsePhoneNumberFromString } from 'libphonenumber-js';
import React, { useMemo } from 'react';
import { useObserver } from 'mobx-react';
import { CLS_PREFIX } from './constant.ts';
import MonitorLink from '../../elements/monitor-link';

export const useDriverNamePhoneInfo = (driver, history, render = true) => {

  const clsDriverName = `${CLS_PREFIX}-driver-name`;
  const clsDriverPhone = `${CLS_PREFIX}-driver-phone`;
  const href = `/drivers/${driver?.id}`;
  return useObserver(() => {
    if (!driver || !render) {
      return {}
    }
    const driverName = driver && {
      items: {
        [`${clsDriverName}__value`]: {
          title: 'Водитель',
          value: 
          <MonitorLink onAction={history?.push} item={href}>
            {`${driver?.name} ${driver?.surname} ${driver?.patronymic || ''}`},
          </MonitorLink>

        },
      },
    };

    const contactPhone = driver?.applicationPhone || driver?.contactPhone;
    const phoneNumber = contactPhone && parsePhoneNumberFromString(contactPhone.replace(/^7/gi, '+7'), 'RU');
    const driverPhone = phoneNumber && {
      items: {
        [`${clsDriverPhone}__value`]: {
          title: 'Телефон водителя',
          value: phoneNumber.formatInternational(),
        },
      },
    };

    return {
      ...(driverName ? { [clsDriverName]: driverName } : {}),
      ...(driverPhone ? { [clsDriverPhone]: driverPhone } : {}),
    };
  });
};
