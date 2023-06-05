import React, { Component } from 'react';
import { IconDeprecated } from '@vezubr/elements';
import InputField from '../inputField/inputField';
import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

class DriversFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drivers: props.drivers,
      filteredList: props.drivers,
      search: '',
    };
  }

  componentWillMount() {
    const id = `df_${Date.now()}`;
    this.setState({ id });
    document.body.addEventListener('click', (e) => {
      const item = document.getElementById(id);
      //!e.target.parentNode.classList.contains(isTimePicker ? "timePicker" : 'vz-dd')
      if (item && !item.contains(e.target)) {
        this.props.onClose();
      }
    });
  }

  onSelect = (driver) => {
    this.props.onSelect(driver);
  };

  onInputChange(e) {
    const { target } = e;
    const { value } = target;
    const { drivers } = this.state;
    const filteredList = drivers.filter((driver) => {
      return (
        driver.driver.name.toLowerCase().includes(value.toLowerCase()) ||
        driver.driver.surname.toLowerCase().includes(value.toLowerCase()) ||
        driver.driver?.patronymic?.toLowerCase().includes(value.toLowerCase())
      );
    });
    this.setState({
      filteredList,
      search: value,
    });
  }

  @autobind
  renderElements() {
    const { filteredList } = this.state;
    //const driversList = filteredList.map((driver) => driver.driver);

    const { showPhone, newApi = false } = this.props;

    return filteredList.map((driver, key) => {
      const classNames = ['element'];

      const willBePhone = !!(showPhone && driver?.driver?.contactPhone);
      let driverPhoto;
      driverPhoto = driver?.driver?.photoFile?.imageFilesPreviewModel[1];
      return (
        <div className={classNames.join(' ')} key={key} onClick={() => this.onSelect(driver)}>
          <div className={'flexbox'}>
            <div className={'driver-image'}>
              <img
                src={`${window.API_CONFIGS[APP].host}${driverPhoto?.downloadUrl.replace(
                  '/',
                  '',
                )}`}
                alt=""
              />
            </div>
          </div>
          <div className={'flexbox column driver-info'}>
            <div className={'bold driver-name'}>
              {driver?.driver?.name} {driver?.driver?.patronymic} {driver?.driver?.surname}
            </div>
            <span className={'driver-status'}>{Utils.driverStatus(driver)}</span>
            {willBePhone && (
              <span className="driver-phone">
                {parsePhoneNumberFromString(`+${driver?.driver?.contactPhone}`)?.format('INTERNATIONAL') || ''}
              </span>
            )}
          </div>
        </div>
      );
    });
  }
  renderInput() {
    const { search } = this.state;
    return (
      <InputField
        withIcon={<IconDeprecated name={'searchBlue'} />}
        withBorder={true}
        placeholder={'Поиск по всем водителям'}
        type={'text'}
        style={{}}
        size={'small'}
        name={'search'}
        value={search}
        className={'margin-right-8 margin-left-8'}
        onChange={(e) => this.onInputChange(e)}
      />
    );
  }
  render() {
    const { id } = this.state;
    return (
      <div className={'drivers-filter'} id={id}>
        <div className={'drivers-search'}>{this.renderInput()}</div>
        <div className={'drivers-elements'}>{this.renderElements()}</div>
      </div>
    );
  }
}

DriversFilter.propTypes = {
  drivers: PropTypes.array,
  onClose: PropTypes.func,
  classNames: PropTypes.string,
  onSelect: PropTypes.func,
  showPhone: PropTypes.bool,
};

export default DriversFilter;
