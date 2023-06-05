import React from 'react';

function useGetBackState(locationInput) {
  const location = locationInput || window.location;

  return React.useMemo(
    () => ({
      back: {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
    }),
    [location.pathname, location.search, location.hash],
  );
}

export default useGetBackState;
