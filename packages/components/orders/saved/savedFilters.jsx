import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import ModalDeprecated from '../../DEPRECATED/modal/modal';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, IconDeprecated } from '@vezubr/elements';
import InputField from '../../inputField/inputField';

const saved = [
  {
    title: 'Сохраненный фильтр 1',
    desc: "12 АПР 2018 - 12 МАЯ 2018, ул. Русаковская, д. 31, ТЦ 'Сокольники'– ул. Бахр…",
  },
  {
    title: 'Сохраненный фильтр 2',
    desc: "12 АПР 2018 - 12 МАЯ 2018, ул. Русаковская, д. 31, ТЦ 'Сокольники'– ул. Бахр…",
  },
];

class SavedFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
    Object.assign(this.state, props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showModal !== this.state.showModal) {
      this.setState({ showModal: nextProps.showModal });
    }
    if (nextProps.saved !== this.state.saved) {
      this.setState({ saved: new Set(nextProps.saved) });
    }
  }

  reset() {
    this.setState({
      selected: false,
      removeElement: false,
      editElement: false,
    });
  }

  save() {
    this.setState({ showModal: !this.state.showModal });
    this.props.onClose(this.state.selected);
  }

  renderEdit() {
    return (
      <div className={'flexbox additional-remove center'}>
        <div className={'text-big flexbox'}>
          <InputField withBorder={true} placeholder={'Введите новое название'} size={'small'} type={'text'} />
        </div>
        <div className={'text-big flexbox text-right'}>
          <span onClick={() => this.onEdit('edit')} className={'text-middle pointer margin-left-24'}>
            <IconDeprecated name={'checkBlue'} />
          </span>
        </div>
      </div>
    );
  }

  renderRemove(type) {
    return (
      <div className={'flexbox additional-remove center'}>
        <div className={'text-big flexbox'}>{t.buttons('removeFilter')}</div>
        <div className={'text-big flexbox text-right'}>
          <span className={'text-middle pointer'} onClick={() => this.onRemove('reset')}>
            {t.buttons('no')}
          </span>
          <span onClick={() => this.onRemove('remove')} className={'text-middle pointer margin-left-24'}>
            {t.buttons('yes')}
          </span>
        </div>
      </div>
    );
  }

  selectFilter(type, e) {
    this.setState({ selected: type });
  }

  onEdit(type) {
    switch (type) {
      case 'edit':
        this.setState({ editElement: false });
        break;
      default:
        this.setState({
          editElement: type,
        });
    }
  }

  @autobind
  onClose() {
    this.reset();
    this.props.onClose();
  }

  onRemove(type) {
    switch (type) {
      case 'remove':
        this.setState({ removeElement: false });
        break;
      case 'reset':
        this.setState({ removeElement: false });
        break;
      default:
        this.setState({
          removeElement: type,
        });
    }
  }

  renderElement(type) {
    const { selected } = this.state;
    return (
      <div>
        <div className={'additional-hover bg-white_grad'}>
          <IconDeprecated name={'editBlack'} className={'pointer'} onClick={this.onEdit.bind(this, type)} />
          <IconDeprecated name={'trashBinBlack'} className={'pointer'} onClick={this.onRemove.bind(this, type)} />
        </div>
        <label className="additional-container">
          {' '}
          <span className={'text-big additional-title light-bold'}>
            {type.title}
            <small className={'line-clamp-1 margin-top-4'}>{type.desc}</small>
          </span>
          <input type="radio" onChange={this.selectFilter.bind(this, type)} checked={selected === type} />
          <span className="checkmark-radio" />
        </label>
      </div>
    );
  }

  filterList() {
    const { removeElement, editElement } = this.state;
    const filteredList = (
      <div className={'flexbox column size-1'}>
        {saved.map((type, key) => {
          return (
            <div className={'flexbox additional-input ' + (removeElement || editElement ? 'bg-white' : '')} key={key}>
              {removeElement === type
                ? this.renderRemove(type)
                : editElement === type
                ? this.renderEdit(type)
                : this.renderElement(type)}
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
              <ButtonDeprecated
                className={'margin-left-15'}
                theme={'primary'}
                disabled={removeElement || editElement}
                onClick={() => this.save()}
              >
                {t.buttons('setSelected')}
              </ButtonDeprecated>
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  renderModal() {
    const { showModal } = this.state;
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
          text: 'Сохраненные фильтры',
          classnames: 'small-title no-margin',
        }}
        size={'small'}
        onClose={this.onClose.bind(this)}
        content={this.filterList()}
      />
    );
  }

  render() {
    return this.renderModal();
  }
}

SavedFilters.propTypes = {
  showModal: PropTypes.bool.isRequired,
  saved: PropTypes.array,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({}, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedFilters);
