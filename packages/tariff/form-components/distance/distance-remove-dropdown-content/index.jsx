import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { TariffContext } from '../../../context';

function DistanceRemoveDropdownContent(props) {
  const { store } = React.useContext(TariffContext);
  const { distanceData, confirm } = props;

  const { distance } = distanceData;

  const del = React.useCallback(() => {
    store.removeDistance(distanceData);
    confirm();
  }, [distanceData]);

  return (
    <div className={'tariff-base-work-remove'}>
      <p>
        Удаляем {distance} ?
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

export default observer(DistanceRemoveDropdownContent);
