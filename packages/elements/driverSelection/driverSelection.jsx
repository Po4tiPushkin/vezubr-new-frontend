import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { IconDeprecated } from '../index';

class DriverSelection extends React.PureComponent {
  state = {
    dropDown: false,
    drivers: [],
  };

  triggerDropdown() {
    const { dropDown } = this.state;
    this.setState({ dropDown: !dropDown });
  }

  componentDidMount() {
    const { drivers } = this.props;

    this.setState({ driversOrigin: drivers, drivers });
    document.addEventListener('click', this.onOutsideClick);
  }

  filter(e) {
    const { drivers, driversOrigin } = this.state;
    const filtered = e.target.value
      ? drivers.filter((d) => {
          return (
            d.driver.name.toLowerCase().includes(e.target.value) ||
            d.driver.surname.toLowerCase().includes(e.target.value)
          );
        })
      : driversOrigin;
    this.setState({ drivers: filtered });
    e.preventDefault();
    e.stopPropagation();
  }

  @autobind
  onOutsideClick(e) {
    const { indx } = this.props;
    const elem = document.getElementById(`driver-selection-${indx}`);
    if (elem) {
      const contains = elem.parentElement.contains(e.target);
      if (!contains) {
        this.setState({ dropDown: false });
      }
    }
  }

  render() {
    const { selected, onSelect, indx } = this.props;
    const { dropDown, drivers } = this.state;
    const mappedDrivers = drivers.map((val, key) => {
      const driver = val.driver;
      return (
        <div
          className={`flexbox driver-item align-center padding-8 pointer ${indx >= 1 ? 'margin-top-8' : ''}`}
          onClick={() => {
            this.triggerDropdown();
            onSelect(val, key);
          }}
          key={key}
        >
          <div className={'driver-selection-img-wrapper'}>
            {driver.photoFile ? (
              <img
                style={{ maxWidth: '100%' }}
                src={`${window.API_CONFIGS[APP].host}${driver.photoFile.downloadUrl.replace('/', '')}`}
              />
            ) : null}
          </div>
          <div className={'margin-left-8'}>
            {driver.name} {driver.surname}
          </div>
        </div>
      );
    });
    return (
      <div className={`flexbox driver-selection-wrapper`} style={{ position: 'relative' }}>
        <div
          className={'flexbox center pointer'}
          id={`driver-selection-${indx}`}
          onClick={() => this.triggerDropdown()}
        >
          <div className={'driver-selection-img-wrapper'}>
            {selected && selected.driver.photoFile ? (
              <img
                style={{ maxWidth: '100%' }}
                src={`${window.API_CONFIGS[APP].host}${selected.driver.photoFile.downloadUrl.replace('/', '')}`}
              />
            ) : (
              <IconDeprecated name={'driverGrey'} />
            )}
          </div>
          <div className={'margin-left-8'}>
            {selected ? `${selected?.driver?.name || ''} ${selected?.driver?.surname || ''}` : 'Выберите водителя'}
          </div>
          <div>
            <IconDeprecated name={'chevronDownBlue'} />
          </div>
        </div>
        {dropDown ? (
          <div className={'driver-selection-tooltip'}>
            <div className={`flexbox driver-search padding-8`}>
              <input
                className={'padding-8'}
                onChange={async (e) => {
                  this.filter(e);
                }}
                placeholder={'Поиск...'}
              />
            </div>
            {mappedDrivers}
          </div>
        ) : null}
      </div>
    );
  }
}

DriverSelection.propTypes = {
  selected: PropTypes.object,
  drivers: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
};

export default DriverSelection;
