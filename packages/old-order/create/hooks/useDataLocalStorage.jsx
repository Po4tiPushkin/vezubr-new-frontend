import React from 'react';
import _omit from 'lodash/omit';
import { setLocalStorageItem } from '@vezubr/common/common/utils';

export default function (key, exclude) {
  const data = React.useMemo(() => {
    let order = undefined;

    try {
      const orderString = localStorage.getItem(key);
      if (orderString) {
        order = JSON.parse(orderString);
      }
    } catch (e) {
      console.error(e);
    }

    if (!order) {
      return order;
    }

    return _omit(order, exclude);
  }, [key, exclude]);

  const remove = React.useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  }, [key]);

  const save = React.useCallback(
    (value) => {
      try {
        setLocalStorageItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(e);
      }
    },
    [key],
  );

  return [data, remove, save];
}
