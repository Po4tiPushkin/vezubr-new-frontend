import React from 'react';
import autobind from 'autobind-decorator';
import { IconDeprecated, ButtonDeprecated } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { Utils } from '@vezubr/common/common';
import PropTypes from 'prop-types';

const serilizer = (contracts, selectedContracts) => {
  const arr = [];
  for (const prop of Object.keys(contracts)) {
    const id = parseInt(prop);
    const exists = selectedContracts.find((c) => c.type === id);
    if (!exists) {
      arr.push({
        id,
        title: contracts[prop],
        selected: false,
      });
    }
  }
  return arr;
};

class ContractTypes extends React.Component {
  constructor(props) {
    super(props);
    const { store } = this.props;

    const { contractorContract } = store.getState().dictionaries;
    this.state = {
      contracts: serilizer(contractorContract, props.selectedContracts),
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { selectedContracts } = this.props;

    if (nextProps.selectedContracts !== selectedContracts) {
      const { contractorContract } = store.getState().dictionaries;
      const contracts = serilizer(contractorContract, nextProps.selectedContracts);
      this.setState({ contracts });
    }
  }

  select(key) {
    let { contracts } = this.state;
    contracts.map((gz, k) => {
      gz.selected = key === k;
      return gz;
    });
    this.setState({ contracts });
  }

  @autobind
  submit() {
    const { contracts } = this.state;
    const { onSelect, contourId } = this.props;
    const selected = contracts.find((a) => a.selected);
    if (!selected) return;
    onSelect({ type: selected.id, rate: 0, contourId });
  }

  render() {
    const { contracts = [] } = this.state;
    const addressesList = contracts.map((gz, key) => {
      return (
        <div className={'address-item flexbox'} key={key} onClick={(e) => this.select(key)}>
          <div className={'flexbox center'}>
            <div>
              <IconDeprecated name={gz.selected ? 'radio' : 'radioEmpty'} />
            </div>
            <div className={'margin-left-12'}>
              <h5>{gz.title}</h5>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className={'vz-favorite-addresses'}>
        <div className={'addresses'}>{addressesList}</div>
        <div className={'footer-section flexbox align-center justify-right'}>
          {contracts.length ? (
            <ButtonDeprecated onClick={this.submit} className={'semi-wide margin-right-12'} theme={'primary'}>
              {t.order('submitSelected')}
            </ButtonDeprecated>
          ) : null}
        </div>
      </div>
    );
  }
}

ContractTypes.propTypes = {
  store: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ContractTypes;
