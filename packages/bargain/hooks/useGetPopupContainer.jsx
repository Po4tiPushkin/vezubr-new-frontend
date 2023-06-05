import React from 'react';

export default function useGetPopupContainer() {
  return React.useCallback((parentNode) => {
    return parentNode.closest('.bargain-list__wrapper') || document.body;
  }, []);
}
