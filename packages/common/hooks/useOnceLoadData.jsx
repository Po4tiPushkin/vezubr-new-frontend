import React, { useCallback, useState } from 'react';

export default function (loadFunc) {
  const [tryToLoad, setTryToLoad] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadFunction = useCallback(
    async (loadFunc) => {
      if (tryToLoad) {
        return;
      }

      if (typeof loadFunc !== 'function') {
        throw new Error('load function param is not a function');
      }

      setTryToLoad(true);
      setLoading(true);

      try {
        setData(await loadFunc());
      } catch (e) {
        console.error(e);
      }

      setLoading(false);
    },
    [tryToLoad],
  );

  if (loadFunc) {
    loadFunction(loadFunc);
  }

  return [data, loading, loadFunction];
}
