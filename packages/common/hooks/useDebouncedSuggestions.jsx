import React from 'react';
import useDebouncedLoadData from './useDebouncedLoadData';

export default function (searchLoader, timer = 1000) {
  const [dataSource, loading, loadFunction] = useDebouncedLoadData(timer);

  const loader = React.useRef(searchLoader);
  loader.current = searchLoader;

  const onSearch = React.useCallback(
    (search) => {
      const searchString = search.trim();

      loadFunction(async () => {
        if (!searchString) {
          return null;
        }

        try {
          return await loader.current(searchString);
        } catch (e) {
          console.error(e);
        }

        return null;
      });
    },
    [loadFunction],
  );

  return [dataSource, loading, onSearch];
}
