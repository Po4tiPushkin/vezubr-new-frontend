import React from 'react';
import autobind from 'autobind-decorator';
import _omit from 'lodash/omit';
import _cloneDeep from 'lodash/cloneDeep';
import { IconDeprecated, ButtonDeprecated } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { Utils } from '@vezubr/common/common';
import PropTypes from 'prop-types';
import { Common as CommonService } from '@vezubr/services';

const EXCLUDE_PARAMS = ['selected', 'editable', 'deletable', 'position', 'attachedFiles'];

const serilizer = (addresses, param, addr, value = undefined) => {
  return addresses.map((address) => {
    address[param] = typeof value !== 'undefined' ? value : address.id === addr.id;
    return address;
  });
};

class FavoriteAddresses extends React.Component {
  constructor(props) {
    super(props);
    const { addresses, selectedAddresses } = this.props;
    let filteredAddresses = [];
    if (Array.isArray(addresses)) {
      filteredAddresses = addresses.reduce((acc, val) => {
        const find = selectedAddresses.find((v) => v.id === val.id);
        if (!find) acc.push(val);
        return acc;
      }, []);
    } else {
      for (const val of Object.values(addresses)) {
        const find = selectedAddresses.find((v) => v.id === val.id);
        if (!find) filteredAddresses.push(val);
      }
    }
    this.state = {
      addresses: filteredAddresses,
    };
  }

  componentWillUnmount() {
    let { addresses } = this.state;
    addresses.map((a) => {
      a.selected = false;
      return a;
    });
    this.setState({ addresses });
  }

  @autobind
  filterAddresses(e) {
    const val = e.target.value;
    let { addresses } = this.state;
    addresses = addresses.filter((a) => a.titleForFavourites.includes(val) || a.addressString.includes(val));
    this.setState({ addresses });
  }

  select(addr, key) {
    let { addresses } = this.state;
    addresses = serilizer(addresses, 'selected', addr);
    this.setState({ addresses });
  }

  @autobind
  edit(addr) {
    let { addresses } = this.state;
    addresses = serilizer(addresses, 'editable', addr);
    this.setState({ addresses });
  }

  async submitEdit(addr) {
    try {
      await CommonService.updateFavoriteAddress(_omit(addr, EXCLUDE_PARAMS));
      let { addresses } = this.state;
      addresses = serilizer(addresses, 'editable', addr, false);
      this.setState({ addresses });
    } catch (e) {
      console.error(e);
    }
  }

  changeTitle(addr, e) {
    let { addresses } = this.state;
    addresses = addresses.map((val, key) => {
      val.editable = val.id === addr.id;
      if (val.id === addr.id) val.titleForFavourites = e.target.value;
      return val;
    });
    this.setState({ addresses });
    //titleForFavourites
  }

  @autobind
  delete(addr) {
    let { addresses } = this.state;
    addresses = serilizer(addresses, 'deletable', addr);
    this.setState({ addresses });
  }

  cancelDelete(addr) {
    let { addresses } = this.state;
    addresses = serilizer(addresses, 'deletable', addr, false);
    this.setState({ addresses });
  }

  async submitDelete(addr, key) {
    try {
      let { addresses } = this.state;
      await CommonService.deleteFavoriteAddress({ id: addr.id });
      addresses = serilizer(addresses, 'deleted', addr);
      this.setState({ addresses });
    } catch (e) {
      console.error(e);
    }
  }

  @autobind
  submit() {
    const { addresses } = this.state;
    const { onSelect, store } = this.props;
    const selected = addresses.find((a) => a.selected);
    if (!selected) return;
    const { loadingTypes } = store.getState().dictionaries;
    const address = Utils.reformatAddressData(selected, loadingTypes);
    onSelect(address);
  }

  render() {
    const { addresses } = this.state;
    const addressesList = addresses
      .filter((el) => !el.deleted)
      .map((addr, key) => {
        return (
          <div className={'address-item flexbox'} key={key}>
            {addr.editable ? (
              <div className={'edit-mode flexbox'}>
                <input
                  type={'text'}
                  placeholder={t.order('enterNewName')}
                  onChange={(e) => this.changeTitle(addr, e)}
                />
                <div className={'check-action'} onClick={(e) => this.submitEdit(addr)}>
                  <IconDeprecated name={'checkBlue'} />
                </div>
              </div>
            ) : addr.deletable ? (
              <div className={'flexbox delete-mode align-center'}>
                <div className={'delete-title'}>{t.order('confirmDeleteFilter')}</div>
                <div className={'flexbox align-right justify-right size-1 align-center'}>
                  <ButtonDeprecated theme={'simple'} onClick={() => this.cancelDelete(addr)}>
                    {t.common('no')}
                  </ButtonDeprecated>
                  <ButtonDeprecated theme={'simple'} onClick={() => this.submitDelete(addr, key)}>
                    {t.common('yes')}
                  </ButtonDeprecated>
                </div>
              </div>
            ) : (
              <div className={'flexbox'}>
                <div className={''} onClick={(e) => this.select(addr, key)}>
                  <IconDeprecated name={addr.selected ? 'radio' : 'radioEmpty'} />
                </div>
                <div className={'margin-left-12'}>
                  {addr.titleForFavourites ? <h5>{addr.titleForFavourites}</h5> : null}
                  <p>{addr.addressString}</p>
                </div>
                <div className={'actions'}>
                  <div onClick={(e) => this.edit(addr)}>
                    <IconDeprecated name={'editBlack'} />
                  </div>
                  <div onClick={(e) => this.delete(addr)}>
                    <IconDeprecated name={'trashBinBlack'} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      });

    return (
      <div className={'vz-favorite-addresses'}>
        {addresses.length ? (
          <div className={'favorite-search-wrapper'}>
            <input type={'text'} onChange={this.filterAddresses} className={'favorites-search'} />
            <IconDeprecated name={'searchBlue'} className={'search-icon'} />
          </div>
        ) : null}
        <div className={'addresses'}>{addressesList}</div>
        <div className={'footer-section flexbox align-center justify-right'}>
          {addresses.length ? (
            <ButtonDeprecated onClick={this.submit} className={'semi-wide margin-right-12'} theme={'primary'}>
              {t.order('submitSelected')}
            </ButtonDeprecated>
          ) : null}
        </div>
      </div>
    );
  }
}

FavoriteAddresses.propTypes = {
  addresses: PropTypes.any.isRequired,
  selectedAddresses: PropTypes.any,
  store: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default FavoriteAddresses;
