import React from 'react';
import PropTypes from 'prop-types';
import { Ant, showError } from '@vezubr/elements';
import store from '../../../../../store/Favorite';
import compose from '@vezubr/common/hoc/compose';
import withAddressFavoriteCellAction from '../../../hoc/withAddressFavoriteCellAction';

function AddressFavoriteRemoveAction(props) {
  const { id, popoverClose } = props;

  const remove = React.useCallback(() => {
    store.remove(id).catch((e) => {
      showError(e);
    });
    popoverClose();
  }, [id]);

  return (
    <div className={'address-favorite-remove-action'}>
      <Ant.Button size={'small'} type={'primary'} onClick={remove}>
        Да
      </Ant.Button>
      <Ant.Button size={'small'} onClick={popoverClose}>
        Нет
      </Ant.Button>
    </div>
  );
}

AddressFavoriteRemoveAction.propTypes = {
  id: PropTypes.number.isRequired,
  popoverClose: PropTypes.func,
};

export default compose([withAddressFavoriteCellAction])(AddressFavoriteRemoveAction);
