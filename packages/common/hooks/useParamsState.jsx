import React, { useCallback, useState } from 'react';
import Utils from '../common/utils';

export default function ({ paramsDefault = {} } = {}) {
  const [params, setParams] = useState(paramsDefault);

  const pushParams = useCallback(
    (newParamsInput, { currentParams } = { currentParams: params }) => {
      const newParams = { ...newParamsInput };

      for (const keyParam of Object.keys(newParams)) {
        if (!newParams[keyParam] || (Array.isArray(newParams[keyParam]) && newParams[keyParam].length === 0)) {
          delete newParams[keyParam];
        }
      }

      if (Utils.deepEqual(newParams, currentParams)) {
        return;
      }


      setParams(newParams);
    },
    [params],
  );

  return [params, pushParams];
}
