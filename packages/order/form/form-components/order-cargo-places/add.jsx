import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Ant } from '@vezubr/elements';
import { OrderContext } from '../../context';
import { CLS_ROOT } from './constant';

const CLS = CLS_ROOT;

function OrderCargoPlacesAdd(props) {
  const { onClick, fieldNameValue, children, ...otherProps } = props;

  const { store } = useContext(OrderContext);
  const placesLength = store.data[fieldNameValue].length;

  return (
    <Ant.Button type={'primary'} icon={'plus'} size={'large'}  {...otherProps} className={cn(`${CLS}__add`)} onClick={onClick}>
      {children}
      <Ant.Badge overflowCount={10000} className={cn(`${CLS}__add__badge`)} count={placesLength} />
    </Ant.Button>
  );
}

OrderCargoPlacesAdd.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  fieldNameValue: PropTypes.string.isRequired,
};

export default observer(OrderCargoPlacesAdd);
