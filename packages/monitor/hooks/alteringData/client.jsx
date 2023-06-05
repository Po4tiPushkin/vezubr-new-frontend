import React, { useMemo } from 'react';
import MonitorLink from '../../elements/monitor-link';
import { useObserver } from 'mobx-react';
import { CLS_PREFIX } from './constant.ts';

export const useClientNameInfo = (client, history, render = true) => {
  const cls = `${CLS_PREFIX}-client-name-info`;
  const href = `/counterparty/${client?.id}`;

  return useObserver(() => {
    if (!client || !render) {
      return {};
    }

    const clientName = client?.title || `Заказчик, ИНН: ${client.inn}`;

    return {
      [cls]: {
        items: {
          [`${cls}__value`]: {
            title: 'Заказчик',
            value:
              <MonitorLink onAction={history?.push} item={href} target={'_blank'}>
                {clientName}
              </MonitorLink>

          },
        },
      },
    };
  });
};
