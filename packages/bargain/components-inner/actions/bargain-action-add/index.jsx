import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant, showError } from '@vezubr/elements';
import OfferItem from '../../../store/OfferItem';
import useActionProcessing from '../../../hooks/useActionProcessing';
import BargainOfferRate from '../../offer/fields/bargain-offer-rate';

const ACTION_NAME = 'add';

function BargainActionAdd(props) {
  const { offer, onAction, title, onPostAction, size = 'small' } = props;

  const [editing, setEditing] = React.useState(false);

  const { isActive } = offer.store;

  const [sum, setSum] = React.useState(offer.data.sum);

  const toggleEditor = React.useCallback(() => {
    setEditing(!editing);
  }, [editing]);

  const [loading, disabled, actionApply] = useActionProcessing(offer, ACTION_NAME);

  const onEdit = React.useCallback(async () => {
    if (!sum) {
      Ant.message.error('Поле не должно быть пустым');
      return;
    }

    const result = await actionApply(onAction, { ...offer.dirtyData, sum });

    if (result.status === 'done') {
      if (result.value) {
        offer.addToStore();
      }

      toggleEditor();

      if (onPostAction) {
        onPostAction(offer, result);
      }
    }
  }, [actionApply, onAction, offer, sum, toggleEditor, onPostAction]);

  return (
    <span className={'bargain-action bargain-action-add'}>
      {editing && (
        <BargainOfferRate
          title={title}
          size={size}
          offer={offer}
          hasError={!sum}
          editing={!loading}
          onChange={setSum}
        />
      )}

      {editing && (
        <>
          <Ant.Button
            icon={'check'}
            type={'primary'}
            loading={loading}
            size={size}
            onClick={onEdit}
            title={'Добавить'}
            disabled={disabled || !isActive}
          />
          <Ant.Button icon={'stop'} title={'Отменить'} onClick={toggleEditor} size={size} />
        </>
      )}

      {!editing && (
        <Ant.Button icon={'plus'} type={'primary'} title={'Добавить предложение'} onClick={toggleEditor} size={size}>
          Добавить предложение
        </Ant.Button>
      )}
    </span>
  );
}

BargainActionAdd.propTypes = {
  title: PropTypes.node,
  offer: PropTypes.instanceOf(OfferItem),
  onAction: PropTypes.func,
  onPostAction: PropTypes.func,
  size: PropTypes.string,
};

export default observer(BargainActionAdd);
