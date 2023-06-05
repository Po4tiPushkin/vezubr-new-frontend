import React, { Component } from 'react';
import Static from '@vezubr/common/constants/static';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import ModalDeprecated from '../../DEPRECATED/modal/modal';
import { ButtonDeprecated } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import _ from 'lodash';

class AdditionalFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTypes: Static.getFilterTypes(props.type),
      showModal: props.showModal,
      filters: new Set(props.filters),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showModal !== this.state.showModal) {
      this.setState({ showModal: nextProps.showModal });
    }
    if (nextProps.filters !== this.state.filters) {
      this.setState({ filters: new Set(nextProps.filters) });
    }
  }

  @autobind
  addFilters(filter, e) {
    e.target.checked ? this.state.filters.add(filter) : this.state.filters.delete(filter);
    this.setState({
      filters: this.state.filters,
    });
  }

  reset() {
    const { filterTypes } = this.state;
    const { resetState } = this.props;
    const reset = resetState.map((element) => filterTypes[element]);
    this.props.actions.setFilters(reset);
  }

  @autobind
  save() {
    this.props.actions.setFilters(Array.from(this.state.filters));
    this.setState({ showModal: !this.state.showModal });
    this.props.onClose();
  }

  filterList() {
    const { resetState, type, user } = this.props;

    const types = Static.getFilterTypes(type);
    if (user['function'] === 2) {
      delete types.filterVehicleTypeId;
      delete types.filterVehiclePlateNumber;
      delete types.filterLastAddress;
    }
    const typeKeys = _.difference(Object.keys(types), resetState);
    const { filters } = this.state;
    const filteredList = (
      <div className={'flexbox column size-1'}>
        {typeKeys.map((type, key) => {
          return (
            <div className={'flexbox additional-input'} key={key}>
              <label className="additional-container">
                {' '}
                <span className={'text-big additional-title light-bold'}>{types[type].title}</span>
                <input
                  type="checkbox"
                  onChange={this.addFilters.bind(this, types[type])}
                  id={key}
                  checked={filters.has(types[type])}
                />
                <span className="checkmark" />
              </label>
            </div>
          );
        })}
      </div>
    );
    return (
      <div className={'flexbox wrap additional-filters column size-1'}>
        {filteredList}
        <div className={'flexbox'}>
          <div className={'area full-width'}>
            <div className={'flexbox align-right justify-right full-width'}>
              <ButtonDeprecated theme={'secondary'} onClick={() => this.reset()} className={'mid light'}>
                {t.buttons('byDefault')}
              </ButtonDeprecated>
              <ButtonDeprecated className={'margin-left-15'} theme={'primary'} onClick={() => this.save()}>
                {t.buttons('accept')}
              </ButtonDeprecated>
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  renderFilterModal() {
    const { showModal } = this.state;
    const { onClose } = this.props;
    const options = {
      showModal,
      showClose: true,
      modalClassnames: 'no-padding',
      bodyClassnames: 'no-padding-right no-padding-left no-padding-top',
    };
    return (
      <ModalDeprecated
        options={options}
        title={{
          text: 'Дополнительные фильтры',
          classnames: 'small-title no-margin additional-title',
        }}
        size={'small'}
        onClose={onClose}
        content={this.filterList()}
      />
    );
  }

  render() {
    return this.renderFilterModal();
  }
}

AdditionalFilters.propTypes = {
  showModal: PropTypes.bool.isRequired,
  filters: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  resetState: PropTypes.array.isRequired,
};

export default AdditionalFilters;
