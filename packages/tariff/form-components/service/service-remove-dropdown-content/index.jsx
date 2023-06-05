import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { TariffContext } from '../../../context';

function ServiceRemoveDropdownContent(props) {
  const { store } = React.useContext(TariffContext);
  const { serviceData, confirm } = props;

  const { article } = serviceData;

  const del = React.useCallback(() => {
    store.removeService(serviceData);
    confirm();
  }, [serviceData]);

  return (
    <div className={'tariff-service-remove'}>
      <p>
        Удаляем {store.orderServices[article]?.name} ?
      </p>
      <div className={'tariff-action-items-inline'}>
        <Ant.Button size={'small'} type={'primary'} onClick={del}>
          Да
        </Ant.Button>
        <Ant.Button
          size={'small'}
          onClick={() => {
            confirm();
          }}
        >
          Нет
        </Ant.Button>
      </div>
    </div>
  );
}

export default observer(ServiceRemoveDropdownContent);
