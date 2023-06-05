import React from 'react';
import { dictionaryConvertToGeneralView } from '../utils';

export default function useConvertDictionaries({ dictionaries }) {
  return React.useMemo(() => {
    return dictionaryConvertToGeneralView({ dictionaries });
  }, [dictionaries]);
}
