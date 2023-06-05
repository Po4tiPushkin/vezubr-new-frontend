import React from 'react';
import useGetBackState from '@vezubr/common/hooks/useGetBackState';

export default function (getNavUrl, location, history) {
  const state = useGetBackState(location);
  return React.useCallback(
    (item) => {
      history.push(getNavUrl(item), state);
    },
    [getNavUrl, state],
  );
}
