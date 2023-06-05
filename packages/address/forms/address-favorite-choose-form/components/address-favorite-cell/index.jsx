import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { observer } from 'mobx-react';

import store from '../../../../store/Favorite';
import AddressFavoriteEditAction from '../actions/address-favorite-edit-action';
import AddressFavoriteRemoveAction from '../actions/address-favorite-remove-action';
import { Ant } from '@vezubr/elements';
import _compact from 'lodash/compact';

function AddressFavoriteCell(props) {
  const { id } = props;

  const { titleForFavourites, addressString, externalId } = store.getDataComputed(id);

  const isDeleting = store.isDeleting(id);
  const isUpdating = store.isUpdating(id);

  const favouritesData = [id, externalId, addressString];

  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const cellRef = React.useRef(null);

  const getPopupContainer = React.useCallback((parentNode) => {
    if (cellRef.current) {
      return cellRef.current.closest('.ant-table-body') || cellRef.current;
    }

    return document.body;
  }, []);

  const popoverProps = {
    getPopupContainer,
    placement: 'topRight',
  };

  return (
    <div
      ref={cellRef}
      className={cn('address-favorite-cell', {
        'address-favorite-cell--active': popoverOpen || isDeleting || isUpdating,
      })}
    >
      <div className={'address-favorite-cell__content'}>
        <div className={'title'}>{titleForFavourites}</div>
        <div className={'address-string'}>{_compact(favouritesData).join(' / ')}</div>
      </div>
      {/* <div className={'address-favorite-cell__actions'}>
        <AddressFavoriteEditAction
          id={id}
          initialValue={titleForFavourites}
          popoverProps={{ ...popoverProps, title: 'Новое имя адреса' }}
          setPopoverOpen={setPopoverOpen}
        >
          <Ant.Icon
            className={'action action--edit'}
            type={isUpdating ? 'loading' : 'edit'}
            title={'Редактировать адрес'}
          />
        </AddressFavoriteEditAction>
        <AddressFavoriteRemoveAction
          id={id}
          popoverProps={{ ...popoverProps, title: 'Удаляем?' }}
          setPopoverOpen={setPopoverOpen}
        >
          <Ant.Icon
            className={'action action--delete'}
            type={isDeleting ? 'loading' : 'delete'}
            title={'Удалить адрес'}
          />
        </AddressFavoriteRemoveAction>
      </div> */}
    </div>
  );
}

AddressFavoriteCell.propTypes = {
  id: PropTypes.number.isRequired,
};

export default observer(AddressFavoriteCell);
