import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { TariffContext } from '../../../context';

function BaseWorkRemoveDropdownContent(props) {
  const { store } = React.useContext(TariffContext);
  const { baseWorkData, confirm } = props;

  const { hoursWork, hoursInnings } = baseWorkData;

  const del = React.useCallback(() => {
    store.removeBaseWork(baseWorkData);
    confirm();
  }, [baseWorkData]);

  return (
    <div className={'tariff-base-work-remove'}>
      <p>
        Удаляем {hoursWork} + {hoursInnings} ?
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

BaseWorkRemoveDropdownContent.propTypes = {
  confirm: PropTypes.func.isRequired,
  baseWorkData: PropTypes.shape({
    hoursWork: PropTypes.number.isRequired,
    hoursInnings: PropTypes.number.isRequired,
  }).isRequired,
};

export default observer(BaseWorkRemoveDropdownContent);
