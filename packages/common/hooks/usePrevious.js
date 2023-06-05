import { useEffect, useRef } from 'react';

export default function usePrevious(obj) {
  const prevRef = useRef();

  useEffect(() => {
    prevRef.current = obj;
  });

  return prevRef.current;
}
