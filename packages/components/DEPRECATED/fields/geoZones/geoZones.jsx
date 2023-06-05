import React from 'react';
import autobind from 'autobind-decorator';
import { IconDeprecated, ButtonDeprecated } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { Utils } from '@vezubr/common/common';
import PropTypes from 'prop-types';

const serilizer = (geoZones) => {
  const arr = [];
  for (const prop of Object.keys(geoZones)) {
    arr.push({
      id: prop,
      title: geoZones[prop],
      selected: false,
    });
  }
  return arr;
};

class Geozones extends React.Component {
  constructor(props) {
    super(props);
    const { store } = this.props;

    const { geozones } = store.getState().dictionaries;
    this.state = {
      geoZones: serilizer(geozones),
    };
  }

  select(key) {
    let { geoZones } = this.state;
    geoZones.map((gz, k) => {
      gz.selected = key === k;
      return gz;
    });
    this.setState({ geoZones });
  }

  @autobind
  submit() {
    const { geoZones } = this.state;
    const { onSelect } = this.props;
    const selected = geoZones.find((a) => a.selected);
    if (!selected) return;
    onSelect(selected);
  }

  render() {
    const { geoZones = [] } = this.state;
    const addressesList = geoZones.map((gz, key) => {
      return (
        <div className={'address-item flexbox'} key={key} onClick={(e) => this.select(key)}>
          <div className={'flexbox center'}>
            <div>
              <IconDeprecated name={gz.selected ? 'radio' : 'radioEmpty'} />
            </div>
            <div className={'margin-left-12'}>
              <h5>{gz.title?.name}</h5>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className={'vz-favorite-addresses'}>
        <div className={'addresses'}>{addressesList}</div>
        <div className={'footer-section flexbox align-center justify-right'}>
          {geoZones.length ? (
            <ButtonDeprecated onClick={this.submit} className={'semi-wide margin-right-12'} theme={'primary'}>
              {t.order('submitSelected')}
            </ButtonDeprecated>
          ) : null}
        </div>
      </div>
    );
  }
}

Geozones.propTypes = {
  store: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default Geozones;
