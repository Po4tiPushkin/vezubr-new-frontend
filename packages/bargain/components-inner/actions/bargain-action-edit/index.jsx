import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant, showError } from '@vezubr/elements';
import OfferItem from '../../../store/OfferItem';
import useActionProcessing from '../../../hooks/useActionProcessing';
import BargainOfferRate from '../../offer/fields/bargain-offer-rate';

const ACTION_NAME = 'edit';

function BargainActionEdit(props) {
  const { offer, onAction, title, size = 'small' } = props;

  const { isActive } = offer.store;

  const [editing, setEditing] = React.useState(false);

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
        offer.updateDirtyData(result.value);
      }
      toggleEditor();
    }
  }, [actionApply, onAction, offer, sum, toggleEditor]);

  return (
    <span className={'bargain-action bargain-action-edit'}>
      <BargainOfferRate
        title={title}
        offer={offer}
        size={size}
        hasError={!sum}
        editing={editing && !loading}
        onChange={setSum}
      />

      {editing && (
        <>
          <Ant.Button
            icon={'check'}
            type={'primary'}
            loading={loading}
            onClick={onEdit}
            title={'Применить ставку'}
            disabled={disabled || !isActive}
            size={size}
          />
          <Ant.Button icon={'stop'} title={'Отменить редактирование'} onClick={toggleEditor} size={size} />
        </>
      )}

      {!editing && (
        <Ant.Button
          icon={'edit'}
          title={'Редактировать ставку'}
          disabled={!isActive}
          onClick={toggleEditor}
          size={size}
        />
      )}
    </span>
  );
}

BargainActionEdit.propTypes = {
  offer: PropTypes.instanceOf(OfferItem),
  title: PropTypes.node,
  editable: PropTypes.bool,
  onAction: PropTypes.func,
  size: PropTypes.string,
};

export default observer(BargainActionEdit);
