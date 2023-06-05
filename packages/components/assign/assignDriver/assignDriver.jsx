import React from 'react';
import { IconDeprecated, Driver, ButtonDeprecated, showError } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import PropTypes from 'prop-types';
import ModalDeprecated from '../../DEPRECATED/modal/modal';
import { Drivers as DriversServiceProducer } from '@vezubr/services/index.producer';
import { Drivers as DriversServiceOperator } from '@vezubr/services/index.operator';
import { Drivers as DriversService } from '@vezubr/services/index';
class AssignDriver extends React.Component {
  state = {
    showModal: false,
    driversOrigin: [],
    drivers: [],
    selected: [],
    loading: false,
  };

  async componentWillReceiveProps(nextProp) {
    const { showActionButton, openTrigger } = nextProp;
    if ((!showActionButton && openTrigger)  ) {
      this.setState({ showModal: true })
      await this.getDrivers();
      this.open();
    }
  }

  async getDrivers() {
    let { newApi = false, userId } = this.props;
    let { drivers } = this.state;
    try {
        this.setState({ loading: true });
        if (!drivers || !drivers.length) {
          if (newApi) {
            const response = await DriversService.shortList({ producer: userId });
            drivers = response.drivers;
          }
          else if (APP === 'operator') {
            const response = await DriversServiceOperator.list();
            drivers = response.data.drivers;
          } else {
            const response = await DriversServiceProducer.list();
            drivers = response.data.drivers;
          }
        } 
        this.setState({ drivers, driversOrigin: drivers.slice(0), loading: false });

    } catch (e) {
      console.error(e);
      showError(e);
      this.setState({ loading: false });
    }

  }

  async open() {
    const { assignedDrivers = [], noTrigger = false } = this.props;
    this.setState({
      showModal: true,
    });
    if (noTrigger) {
      await this.getDrivers();
    }
    const { selected, drivers } = this.state;

    if (!selected.length && assignedDrivers.length) {
      for (const [index, driver] of drivers.entries()) {
        const assigned = assignedDrivers.find((d) => d.id === driver.id);
        if (assigned) {
          this.selectDriver(driver, index);
        }
      }
    } else if (assignedDrivers.length) {
      for (const [index, selectedDriver] of selected.entries()) {
        const assigned = assignedDrivers.find((d) => d.id === selectedDriver.id);
        if (!assigned) {
          this.removeDriver(selectedDriver, index);
        }
      }
    }

  }

  submit() {
    const { onSelect } = this.props;
    const { selected } = this.state;
    this.setState({ showModal: false });
    onSelect(selected);
  }

  selectDriver(driver, index) {
    const { selected, drivers } = this.state;
    const driversBeforeSelectedItem = drivers.slice(0, index);
    const driversAfterSelectedItem = drivers.slice(index + 1, drivers.length);
    const newDrivers = [...driversBeforeSelectedItem, ...driversAfterSelectedItem];

    const newSelected = [...selected, ...[driver]];

    this.setState({ drivers: newDrivers, selected: newSelected });
  }

  removeDriver(driver, index) {
    const { selected, drivers } = this.state;
    const beforeSelectedItem = selected.slice(0, index);
    const afterSelectedItem = selected.slice(index + 1, selected.length);
    const newSelected = [...beforeSelectedItem, ...afterSelectedItem];
    const newDrivers = [...drivers, ...[driver]];

    this.setState({ drivers: newDrivers, selected: newSelected });
  }

  filter(val) {
    val = val.toLowerCase();
    const { driversOrigin } = this.state;
    const filtered = driversOrigin.filter((driver) => {
      const condition = driver.patronymic ?
        driver.name.toLowerCase().includes(val) ||
        driver.surname.toLowerCase().includes(val) ||
        driver.patronymic.toLowerCase().includes(val) :
        driver.name.toLowerCase().includes(val) ||
        driver.surname.toLowerCase().includes(val);

      return (
        condition
      );
    });
    this.setState({ drivers: val ? filtered : driversOrigin });
  }

  render() {
    const { className, showActionButton = true, onClose } = this.props;
    const { store } = this.context;
    const dictionaries = store.getState().dictionaries;
    let classNames = (className || '').split(' ');
    classNames.push('assign-driver doc-upload flexbox file-input-wrapper input-doc');
    classNames = classNames.join(' ');

    const { showModal, drivers, selected, driversOrigin, loading } = this.state;
    const list = drivers.map((d, key) => (
      <Driver
        key={key}
        indx={key}
        uiState={dictionaries?.driverUiStates}
        onSelect={(driver) => this.selectDriver(driver, key)}
        data={d}
      />
    ));

    const selectedList = selected.map((d, key) => (
      <Driver
        key={key}
        uiState={dictionaries?.driverUiStates}
        indx={key}
        onRemove={(driver) => this.removeDriver(driver, key)}
        data={d}
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
              <a onClick={() => this.open()}>{t.order('addDriver')}</a>
              <div className={'support-format'}> {t.order('selectFromList')}</div>
            </div>
          </div>
        ) : null}

        <ModalDeprecated
          title={{
            classnames: 'identificator',
            text: t.order('addingDrivers'),
          }}
          options={{ showModal }}
          size={'lg'}
          onClose={() => {
            onClose ? onClose() : null;
            this.setState({ showModal: false });
          }}
          animation={false}
          showClose={true}
          footer={
            driversOrigin.length ? (
              <ButtonDeprecated theme={'primary'} className={`mid`} onClick={(e) => this.submit(e)}>
                {t.order('addSelected')}
              </ButtonDeprecated>
            ) : null
          }
          bodyStyle={{
            backgroundColor: '#DEE3E8',
            borderRadius: 0,
            margin: 0,
            padding: 0,
          }}
          content={
            <div className={'alert-box flexbox align-left padding-5'}>
              {driversOrigin.length ? (
                <div className={'flexbox full-width'}>
                  <div className={'selection-left size-0_5'}>
                    <div className={'driver-search'}>
                      <input
                        onChange={async (e) => {
                          this.filter(e.target.value);
                        }}
                        placeholder={'Поиск по ФИО'}
                      />
                      <IconDeprecated style={{ position: 'absolute', right: '0', top: '-3px' }} name={'searchBlue'} />
                    </div>
                    <div className={'drivers-list'}>{list}</div>
                  </div>
                  <div className={'selection-right size-0_5'}>
                    <div className={'drivers-list'}>{selectedList}</div>
                  </div>
                </div>
              ) : (
                loading ? 
                <div className={'flexbox center align-center no-info'}>Идет загрузка списка водителей. Пожалуйста подождите</div>
                :
                <div className={'flexbox center align-center no-info'}>
                  Вы сможете выбрать водителей после их создания/регистрации в системе.
                </div>
              )}
            </div>
          }
        />
      </div>
    );
  }
}

AssignDriver.contextTypes = {
  store: PropTypes.object,
};

AssignDriver.propTypes = {
  onSelect: PropTypes.func.isRequired,
  assignedDrivers: PropTypes.array,
  drivers: PropTypes.array,
  showActionButton: PropTypes.bool,
  newApi: PropTypes.bool,
  userId: PropTypes.number,
};

export default AssignDriver;
