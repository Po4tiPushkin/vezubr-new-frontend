import { cancelable } from 'cancelable-promise';
import { useCallback } from 'react';
import { useEffect, useRef, useState } from 'react';

const useCancelableLoadData = (functionData, off = false, displayError = true) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const refFunction = useRef(null);

  const refDisplayError = useRef(displayError);
  refDisplayError.current = displayError;

  const cancelPromiseFetch = useCallback(() => {
    if (refFunction.current) {
      refFunction.current.cancel();
      refFunction.current = null;
    }
  }, []);

  useEffect(() => {
    cancelPromiseFetch();

    if (off) {
      return;
    }

    setLoading(true);
    const promiseData = (refFunction.current = cancelable(functionData()));
    promiseData
      .then((data) => {
        setLoading(false);
        setData(data);
      })
      .catch((error) => {
        setLoading(false);
        if (refDisplayError.current) {
          console.error(error);
        }
      });

  }, [functionData, off]);

  useEffect(() => () => {
    cancelPromiseFetch();
  }, []);

  return [data, off ? false : loading];
};

export default useCancelableLoadData;
