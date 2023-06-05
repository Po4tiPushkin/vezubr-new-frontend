import { useObserver } from 'mobx-react';
import { CLS_PREFIX } from './constant.ts';

export const useStatusInfo = (status) => {
  const cls = `${CLS_PREFIX}-status`;
  return useObserver(() => {
    const { name, ago } = status;
    const statusInfo = name &&
      ago && {
        items: {
          [`${cls}__name`]: {
            value: name,
          },
          [`${cls}__value`]: {
            value: ago,
          },
        },
      };
    return {
      ...(statusInfo ? { [cls]: statusInfo } : {}),
    };
  });
};
