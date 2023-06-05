import { useEffect, useState } from 'react';

export default function (timer) {
  const [, updateState] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      updateState(Date.now());
    }, timer);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);
}
