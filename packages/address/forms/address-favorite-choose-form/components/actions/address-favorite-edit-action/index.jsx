import React from 'react';
import PropTypes from 'prop-types';
import { Ant, showError } from '@vezubr/elements';
import cn from 'classnames';
import store from '../../../../../store/Favorite';
import withAddressFavoriteCellAction from '../../../hoc/withAddressFavoriteCellAction';
import compose from '@vezubr/common/hoc/compose';

function getError(value) {
  if (!value.trim()) {
    return 'Поле не должно быть пустым';
  }

  return null;
}

function AddressFavoriteEditAction(props) {
  const { id, popoverClose, initialValue } = props;

  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState(null);

  const onChange = React.useCallback((e) => {
    const value = e.target.value;
    setError(getError(value));
    setValue(value);
  }, []);

  const save = React.useCallback(() => {
    const error = getError(value);

    if (error) {
      setError(error);
      Ant.message.error(error);
      return;
    }

    store
      .update(id, {
        titleForFavourites: value,
      })
      .catch((e) => {
        showError(e);
      });

    popoverClose();
  }, [value, popoverClose, id]);

  return (
    <div className={'address-favorite-edit-action'}>
      <div className={cn({ 'has-error': error })}>
        <Ant.Input size={'small'} placeholder={'Имя адреса'} value={value} onChange={onChange} />
      </div>

      <Ant.Button type={'primary'} size={'small'} onClick={save}>
        Сохранить
      </Ant.Button>
    </div>
  );
}

AddressFavoriteEditAction.propTypes = {
  id: PropTypes.number.isRequired,
  popoverClose: PropTypes.func,
  initialValue: PropTypes.string,
};

export default compose([withAddressFavoriteCellAction])(AddressFavoriteEditAction);
