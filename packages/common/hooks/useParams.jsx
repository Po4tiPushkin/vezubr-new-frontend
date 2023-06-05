import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Utils from '../common/utils';
import { useSelector } from 'react-redux';
export default function ({ history, location = location, paramsDefault, paramsName }) {
  const [once, setOnce] = useState(false);
  const [forcedUpdate, setForceUpdate] = useState(false);
  const { id } = useSelector(state => state.user);
  const params = useMemo(() => {
    const p = Utils.queryString(location.search);
    if (Object.keys(p).length === 0 && !once) {
      return {
        ...paramsDefault,
        ...Utils.getDefaultParams(paramsName, { id }),  
        ...p,
      };
    }
    return p;
  }, [location.search, forcedUpdate]);

  const pushParams = useCallback(
    (newParamsInput, { currentParams, replace } = { currentParams: params, replace: false }) => {
      const newParams = { ...newParamsInput };

      for (const keyParam of Object.keys(newParams)) {
        if (!newParams[keyParam] || (Array.isArray(newParams[keyParam]) && newParams[keyParam].length === 0)) {
          delete newParams[keyParam];
        }
      }

      // if (Utils.deepEqual(newParams, currentParams)) {
      //   return;
      // }

      const query = Utils.toQueryString(newParams);

      if (!once) {
        setOnce(true);
        if (!query) {
          setForceUpdate(true);
        }
      }
      if (paramsName) {
        Utils.setDefaultParams(paramsName, newParams, id)
      }

      history[replace ? 'replace' : 'push'](query ? query : '#');
    },
    [once, params, forcedUpdate],
  );

  return [params, pushParams];
}
