import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant, showError } from '@vezubr/elements';
import OfferItem from '../../../store/OfferItem';
import useActionProcessing from '../../../hooks/useActionProcessing';
import useGetPopupContainer from '../../../hooks/useGetPopupContainer';

const ACTION_NAME = 'delete';

function BargainActionDelete(props) {
  const { offer, onAction } = props;

  const { isActive } = offer.store;

  const { status } = offer.data;

  const isDeleted = status === 4;

  const [loading, disabled, actionApply] = useActionProcessing(offer, ACTION_NAME);

  const [popoverVisible, setPopoverVisible] = React.useState(false);

  const togglePopover = React.useCallback(() => {
    setPopoverVisible(!popoverVisible);
  }, [popoverVisible]);

  const getPopupContainer = useGetPopupContainer();

  const onDelete = React.useCallback(async () => {
    togglePopover();
    const result = await actionApply(onAction);
    if (result.status === 'done' && result.value) {
      offer.delete();
    }
  }, [actionApply, onAction, togglePopover]);

  return (
    <span className={'bargain-action bargain-action-delete'}>
      <Ant.Popover
        overlayClassName="bargain-action__popover bargain-action-delete__popover"
        placement="top"
        title={'Удаляем?'}
        content={
          <div className={'bargain-action__actions'}>
            <Ant.Button onClick={onDelete} size={'small'} disabled={!isActive || isDeleted}>
              Да
            </Ant.Button>

            <Ant.Button onClick={togglePopover} size={'small'}>
              Нет
            </Ant.Button>
          </div>
        }
        getPopupContainer={getPopupContainer}
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
        trigger="click"
      >
        <Ant.Button
          icon={'delete'}
          size={'small'}
          title={'Отменить ставку'}
          loading={loading}
          disabled={disabled || !isActive || isDeleted}
        >
          Отменить ставку
        </Ant.Button>
      </Ant.Popover>
    </span>
  );
}

BargainActionDelete.propTypes = {
  offer: PropTypes.instanceOf(OfferItem),
  onAction: PropTypes.func,
};

export default observer(BargainActionDelete);
