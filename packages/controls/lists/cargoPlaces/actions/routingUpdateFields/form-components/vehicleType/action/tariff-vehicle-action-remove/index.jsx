import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';

function TariffVehicleActionRemove(props) {
  const { vehicle } = props;

  const [visible, setVisible] = React.useState(false);

  const popoverClose = React.useCallback(() => {
    setVisible(false);
  }, []);

  const handleVisibleChange = React.useCallback((visible) => {
    setVisible(visible);
  }, []);

  const remove = React.useCallback(() => {
    vehicle.remove();
    popoverClose();
  }, [vehicle]);

  if (!vehicle.vehicleTypeId) {
    return null;
  }

  return (
    <Ant.Popover
      placement="topLeft"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      trigger="click"
      title="Удалить машину?"
      content={
        <div className={'tariff-action-items-inline'}>
          <Ant.Button size={'small'} type={'primary'} onClick={remove}>
            Да
          </Ant.Button>
          <Ant.Button size={'small'} onClick={popoverClose}>
            Нет
          </Ant.Button>
        </div>
      }
    >
      <Ant.Icon
        className={'icon-action icon-action--left'}
        type="delete"
        style={{ color: 'red' }}
        title={'Удалить машину'}
      />
    </Ant.Popover>
  );
}

TariffVehicleActionRemove.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default observer(TariffVehicleActionRemove);
