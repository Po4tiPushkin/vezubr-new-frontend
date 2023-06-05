import { renderToString } from 'react-dom/server';
import React from 'react';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import t from '@vezubr/common/localization';
import { IconDeprecated, ButtonDeprecated } from '@vezubr/elements';
import InputField from '../inputField/inputField';
import DropDown from '../inputField/extensions/dropDown';
import { GeoCoding as GCService } from '@vezubr/services';
import MapDeprecated from '../DEPRECATED/map/map';
import { Utils, Validators } from '@vezubr/common/common';

class SetParking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editAddress: false,
      data: {},
      address: false,
      addressList: props.addresses || [],
      addressAutocomplete: [],
    };
    this.validators = Validators.createEditAddress;
    this.geoCodeData = _debounce(this.geoCodeData, 500);
  }

  async componentWillMount() {
    const { store, editAddress } = this.props;
    const { data } = this.state;

    this.subscriber = store.subscribe(() => {
      const map = store.getState().map;
      if (map && !this.map) {
        try {
          this.map = map;
          if (editAddress) {
            this.drawMarker(editAddress);
            data.addressString = editAddress.fullAddress;
            this.setState({ data });
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  @autobind
  drawMarker(address, index) {
    const { store } = this.props;
    const map = store.getState().map;
    return map.drawMarker([address.coordinates.lat, address.coordinates.lng], {
      icon: L.divIcon({
        className: 'pin-icon',
        html: renderToString(
          <div className={'pin-icon-wrapper'}>
            <IconDeprecated className={'wide big'} name={'pinNumberOrange'} />
          </div>,
        ),
        iconSize: [30, 43],
      }),
    });
  }

  handleChange(type, val, integer) {
    const { data } = this.state;
    const value = val.target ? val.target.value : val;
    data[type] = integer ? parseInt(value) : value;
    this.setState({ data });
  }

  onBlur(type) {
    const { data } = this.state;
  }

  checkPinExists() {
    const { store } = this.props;
    const map = store.getState().map;
    if (this.pin) {
      map.removeMarker(this.pin);
      delete this.pin;
    }
  }

  @autobind
  select() {
    const { address } = this.state;
    const { onSelect } = this.props;
    onSelect(address);
  }

  async geoCodeData(e) {
    const { data } = this.state;
    const r = await GCService.geoCoder(data.addressString);
    this.setState({ addressAutocomplete: r || [] });
  }

  async selectAddress(address, coordinates = []) {
    const { data } = this.state;
    const lat = coordinates.length ? coordinates[0] : address.geometry.coordinates[0];
    const lng = coordinates.length ? coordinates[1] : address.geometry.coordinates[1];
    if (address.fullAddress) {
      data.addressString = address.fullAddress;
    }
    address.coordinates = {
      lat,
      lng,
    };
    await this.setState({ addressAutocomplete: [], address, data });
  }

  @autobind
  async autocompleteSelect(e) {
    const { store, editAddress } = this.props;
    const { addressList } = this.state;
    const map = store.getState().map;
    this.checkPinExists();
    this.pin = map.drawMarker(e.geometry.coordinates, {
      icon: L.divIcon({
        className: 'pin-icon',
        html: renderToString(
          <div className={'pin-icon-wrapper'}>
            <IconDeprecated className={'wide big'} name={'pinNumberOrange'} />
            <span className={'pin-icon-text'}>{editAddress >= 0 ? editAddress + 1 : addressList.length + 1}</span>
          </div>,
        ),
        iconSize: [30, 43],
      }),
    });
    await Utils.setDelay(500);
    map.fitMarkers();
    this.selectAddress(e);
  }

  @autobind
  async handleMapClick(e) {
    const { store, editAddress } = this.props;

    const { addressList } = this.state;
    const map = store.getState().map;
    this.checkPinExists();
    this.pin = map.drawMarker([e.latlng.lng, e.latlng.lat], {
      draggable: true,
      icon: L.divIcon({
        className: 'pin-icon',
        html: renderToString(
          <div className={'pin-icon-wrapper'}>
            <IconDeprecated className={'wide big'} name={'pinNumberOrange'} />
          </div>,
        ),
        iconSize: [30, 43],
      }),
    });
    await Utils.setDelay(500);
    //map.fitMarkers();
    const resp = await GCService.reverseGeoCoder(e.latlng.lat, e.latlng.lng);
    if (resp.length) {
      resp[0].fullAddress = Utils.concatToFullAddress(resp[0]).join(', ');
    }
    this.selectAddress(resp[0], [e.latlng.lat, e.latlng.lng]);
  }

  render() {
    const { data, addressAutocomplete, editAddress } = this.state;
    const { onCancel, store } = this.props;
    return (
      <div>
        <div className={'flexbox'}>
          <div className={'flexbox column size-1'}>
            <div className={'area'} style={{ padding: '0 0 12px' }}>
              <div className={'relative'}>
                <InputField
                  title={t.order('address')}
                  type={'text'}
                  name={'addressString'}
                  shortInfo={{
                    title: t.order('infoAddressTitle'),
                    description: t.order('infoAddressDescr'),
                  }}
                  placeholder={t.order('addOrClickOnMap')}
                  value={data.addressString}
                  onChange={(e) => {
                    this.handleChange('addressString', e);
                    this.geoCodeData();
                  }}
                  onBlur={() => this.onBlur('addressString')}
                />
                {addressAutocomplete.length ? (
                  <DropDown
                    className={'full'}
                    separate={true}
                    geoCoder={true}
                    visible={addressAutocomplete.length}
                    list={addressAutocomplete}
                    onChange={this.autocompleteSelect}
                  />
                ) : null}
              </div>
            </div>
            <div className={'create-edit-map-container-set-parking'}>
              <MapDeprecated store={store} element={'map2'} onClick={this.handleMapClick} provider={'yandex'} />
            </div>
          </div>
        </div>
        <div className={'flexbox'}>
          <div className={'area full-width'}>
            <div className={'flexbox align-right justify-right full-width'}>
              <ButtonDeprecated theme={'secondary'} onClick={() => onCancel()} className={'mid'}>
                {t.order('cancel')}
              </ButtonDeprecated>
              <ButtonDeprecated
                className={'margin-left-15'}
                theme={'primary'}
                onClick={() => this.select()}
                wide={true}
              >
                {t.order(editAddress ? 'editAddress' : 'addAddress')}
              </ButtonDeprecated>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SetParking.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
};

export default SetParking;
