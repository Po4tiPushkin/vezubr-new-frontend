import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant, showError } from '@vezubr/elements';
import useActionProcessing from '../../../hooks/useActionProcessing';
import OfferItem from '../../../store/OfferItem';
const ACTION_NAME = 'accept';

function BargainActionAccept(props) {
  const { offer, onAction } = props;

  const { hasAccepted } = offer.store;
  const { status } = offer.data;

  const [loading, disabled, actionApply] = useActionProcessing(offer, ACTION_NAME);

  const onAccept = React.useCallback(async () => {
    const result = await actionApply(onAction);
    if (result.status === 'done' && result.value) {
      offer.updateDirtyData(result.value);
    }
  }, [actionApply, onAction]);

  return (
    <span className={'bargain-action bargain-action-accept'}>
      {status === 2 && (
        <Ant.Tag color={'volcano'}>
          <Ant.Icon type={'check'} /> <span>Принято</span>
        </Ant.Tag>
      )}

      {status !== 2 && (
        <Ant.Button
          icon={'check'}
          size={'small'}
          title={'Принять ставку'}
          loading={loading}
          disabled={disabled || hasAccepted || status === 4}
          onClick={onAccept}
        >
          Принять
        </Ant.Button>
      )}
    </span>
  );
}

BargainActionAccept.propTypes = {
  offer: PropTypes.instanceOf(OfferItem),
  onAction: PropTypes.func,
};

export default observer(BargainActionAccept);
