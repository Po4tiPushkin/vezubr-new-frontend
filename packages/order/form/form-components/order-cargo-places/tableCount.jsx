import React, { useContext } from 'react';
import { CLS_ROOT } from './constant';
import { OrderCargoPlacesContext, OrderContext } from '../../context';
import cn from 'classnames';
import { observer } from 'mobx-react';

const CLS = `${CLS_ROOT}__count`;

function TableCount(props) {
  const { count } = props;
  const { fieldNameValue } = useContext(
    OrderCargoPlacesContext,
  );

  const { store } = useContext(OrderContext);

  const placesLength = store.data[fieldNameValue].length;

  return (
    <div className={cn(`${CLS}`)}>
      <div className={cn(`${CLS}__item`)}>
        <span className={cn(`${CLS}__title`)}>Всего строк:</span>
        <span className={cn(`${CLS}__value`)}>{count}</span>
      </div>
      <div className={cn(`${CLS}__item`)}>
        <span className={cn(`${CLS}__title`)}>Прикреплено ГМ:</span>
        <span className={cn(`${CLS}__value`)}>{placesLength}</span>
      </div>
    </div>

  );
}

export default observer(TableCount);
