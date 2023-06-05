import React from 'react';
import { createAsyncRules } from '../utils';

export default function (validators) {
  return React.useMemo(() => createAsyncRules(validators), [validators]);
}
