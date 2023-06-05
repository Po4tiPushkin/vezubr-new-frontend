import { useCallback } from 'react';

function useGoBack({ history }) {
  return useCallback(() => {
    return history.goBack()
  }, []);
}

export default useGoBack;
