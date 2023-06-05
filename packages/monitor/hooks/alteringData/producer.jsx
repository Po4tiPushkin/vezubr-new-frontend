import React, { useMemo } from 'react';
import MonitorLink from '../../elements/monitor-link';
import { useObserver } from 'mobx-react';
import { CLS_PREFIX } from './constant.ts';

export const useProducerNameInfo = (producer, history, render = true) => {
  const cls = `${CLS_PREFIX}-producer-name-info`;
  const href = `/counterparty/${producer?.id}`;

  return useObserver(() => {
    if (!producer || !render ) {
      return {};
    }

    const producerName = producer?.title || `Подрядчик, ИНН: ${producer.inn}`;

    return {
      [cls]: {
        items: {
          [`${cls}__value`]: {
            title: 'Подрядчик',
            value:
              <MonitorLink onAction={history?.push} item={href} target={'_blank'}>
                {producerName}
              </MonitorLink>
          },
        },
      },
    };
  });
};
