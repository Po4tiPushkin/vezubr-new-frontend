import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { CargoContextView } from '../../context';


const CargoViewTitle = ({id}) => {
  const { store } = useContext(CargoContextView);
  // const { id } = store;
  const { order } = store.data;

  return (
    <>
      <strong>
        {t.order('cargo')} № {id}
      </strong>
      {order?.toStartAtDate && (
        <span>
          {' '}
          {t.order('from')} {Utils.formatDate(order.toStartAtDate)}
        </span>
      )}
    </>
  );
};

export default observer(CargoViewTitle);