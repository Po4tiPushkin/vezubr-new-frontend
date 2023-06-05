import React from 'react';
import { useObserver } from 'mobx-react';
import { showError } from '@vezubr/elements';

export default function useActionProcessing(offer, name) {
  const { processing, isHasProcessing } = useObserver(() => {
    const { processing, isHasProcessing } = offer;
    return {
      processing,
      isHasProcessing,
    };
  });

  const actionApply = React.useCallback(
    async (onAction, data) => {
      if (isHasProcessing) {
        return {
          status: 'notReady',
          value: null,
        };
      }

      let returnValue;

      offer.setProcessing(name);

      try {
        const value = await onAction(offer, data);
        returnValue = {
          status: 'done',
          value,
        };
      } catch (e) {
        returnValue = {
          status: 'error',
          value: null,
        };
        showError(e);
      }

      offer.clearProcessing();

      return returnValue;
    },
    [processing, name, isHasProcessing],
  );

  return [processing === name, isHasProcessing && processing !== name, actionApply];
}
