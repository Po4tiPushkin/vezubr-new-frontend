import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function (timer) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const [loadFunction] = useDebouncedCallback(async (fetchFunction) => {
    if (typeof fetchFunction !== 'function') {
      throw new Error('load function param is not a function');
    }
    setData(null);
    setLoading(true);
    try {
      const response = await fetchFunction();
      setData(response);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, timer);

  return [data, loading, loadFunction];
}
