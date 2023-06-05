import React, { Fragment } from 'react';
import { IconDeprecated, Loader, VehicleAndDriver } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import PropTypes from 'prop-types';
import ModalDeprecated from '../../DEPRECATED/modal/modal';
import { Vehicle as TransportServiceProducer } from '@vezubr/services/index.producer';
import { Vehicle as TransportServiceOperator } from '@vezubr/services/index.operator';

class TransportReplacement extends React.Component {
  state = {
    showModal: false,
    drivers: [],
    loading: true,
    vehicles: [],
  };

  async componentDidMount() {
    const { orderId } = this.props;
    let vehicles;
    if (APP === 'operator') {
      vehicles = (await TransportServiceOperator.listCompatibleForTransportOrder({ orderId })).data.vehicles;
    } else {
      vehicles = (await TransportServiceProducer.listCompatibleForTransportOrder({ orderId })).data.vehicles;
    }
    for (const vehicle of vehicles) {
      const drivers = vehicle.linkedDrivers;
      const selectedDriver = drivers.find((d) => d.isOnVehicle) || drivers[0];
      vehicle.driver = selectedDriver;
    }
    //const drivers = (await DriverService.getListForVehicles({orderId})).data.drivers;
    this.setState({ drivers: [], vehicles, loading: false });
  }

  componentWillReceiveProps(nextProp) {
    const { showActionButton, openTrigger } = nextProp;
    if (!showActionButton && openTrigger) {
      this.open();
    }
  }

  open() {
    this.setState({
      showModal: true,
    });
  }

  selectVehicle(vehicle) {
    const { onSelect } = this.props;
    this.setState({ showModal: false });
    onSelect(vehicle);
  }

  assignDriverToVehicle(driver, vehicleIndex) {
    const { drivers, vehicles } = this.state;
    const driverIndex = drivers.findIndex((d) => d.driver.id === driver.driver.id);
    drivers[driverIndex].assigned = true;
    vehicles[vehicleIndex].driver = drivers[driverIndex];
    this.setState({ vehicles, drivers });
  }

  render() {
    const { className, showActionButton = true, isAppointment, onClose } = this.props;
    let classNames = (className || '').split(' ');
    classNames.push('assign-driver doc-upload flexbox file-input-wrapper input-doc');
    classNames = classNames.join(' ');

    const { showModal, vehicles, drivers, loading } = this.state;
    const list = vehicles.map((d, key) => (
      <VehicleAndDriver
        key={key}
        indx={key}
        drivers={drivers}
        onSelectDriver={(driverIndex) => this.assignDriverToVehicle(driverIndex, key)}
        onSelect={(trailer) => this.selectVehicle(trailer, key)}
        vehicle={d}
      />
    ));

    return (
      <div className={classNames}>
        {showActionButton ? (
          <div className={'flexbox'}>
            <div className={'empty-attach-input'} onClick={() => this.open()}>
              <IconDeprecated name={'plusOrange'} />
            </div>
            <div className={'flexbox column align-left justify-center margin-left-16'}>
              <a onClick={() => this.open()}>{t.order('addTrailer')}</a>
              <div className={'support-format'}> {t.order('selectFromList')}</div>
            </div>
          </div>
        ) : null}

        <ModalDeprecated
          title={{
            classnames: 'identificator',
            text: isAppointment ? `Назначить ТС и водителя` : `Замена водителя и ТС`,
          }}
          options={{ showModal, modalClassnames: 'driver-vehicle-selection' }}
          size={'lg'}
          onClose={() => {
            onClose ? onClose() : null;
            this.setState({ showModal: false });
          }}
          animation={false}
          showClose={true}
          bodyStyle={{
            backgroundColor: '#DEE3E8',
            borderRadius: 0,
            margin: 0,
            padding: 0,
          }}
          content={
            <div className={'alert-box flexbox align-left padding-5'}>
              {list.length ? (
                <div className={'size-1'}>{list}</div>
              ) : (
                <div className={'flexbox center align-center no-info text-center'}>
                  {loading ? (
                    <Fragment>
                      <Loader />
                    </Fragment>
                  ) : (
                    <Fragment>
                      {isAppointment
                        ? `У вас отсутствуют подходящие под требования в рейсе зарегистрированные ТС в системе.
													  Вы сможете перейти к принятию рейса после создания и одобрения соответствующих ТС.`
                        : `Вы сможете выбрать Транспорт и водителя после их создания/регистрации в системе.`}
                    </Fragment>
                  )}
                </div>
              )}
            </div>
          }
        />
      </div>
    );
  }
}

TransportReplacement.propTypes = {
  onSelect: PropTypes.func.isRequired,
  assignedDrivers: PropTypes.array,
  drivers: PropTypes.array,
  orderId: PropTypes.any,
  showActionButton: PropTypes.bool,
};

export default TransportReplacement;
