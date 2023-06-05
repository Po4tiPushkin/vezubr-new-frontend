import React from 'react';
import { getPosition } from '../utils';

export default function useGetPosition(value) {
  return React.useMemo(() => getPosition(value), [value]);
}
