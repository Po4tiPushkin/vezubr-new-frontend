import { useEffect, useRef } from 'react';

const useUnmountedFlag = () => {
  const unmountedRef = useRef(false);
  useEffect(
    () => () => {
      {
        unmountedRef.current = true;
      }
    },
    [],
  );

  return unmountedRef.current;
};

export default useUnmountedFlag;
