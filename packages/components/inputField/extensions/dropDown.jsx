import React from 'react';
import moment from 'moment';
import _map from 'lodash/map';
import _reduce from 'lodash/reduce';
import _filter from 'lodash/filter';
import _debounce from 'lodash/debounce';
import Utils from '@vezubr/common/common/utils';

class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterVal: '',
      filtered: [],
      startDate: '',
      id: null,
    };
    this.filter = _debounce(this.filter, 50);
  }

  componentWillMount() {
    const id = Date.now();
    const { separate, onChange, isTimePicker } = this.props;
    this.setState({ id });

    if (!separate) {
      this.handleSeparateEvent = (e) => {
        const item = document.getElementById(id);
        //!e.target.parentNode.classList.contains(isTimePicker ? "timePicker" : 'vz-dd')
        if (item && !item.contains(e.target)) {
          onChange('');
        }
      };
      document.body.addEventListener('click', this.handleSeparateEvent);
    }
    let { startDate } = this.props;
    if (isTimePicker) {
      setTimeout(() => {
        const currentDay = moment().format('YYYY-MM-DD');
        let selector = '';
        startDate = Utils.reformatStringDate(startDate);
        if (!startDate) {
          selector = this.roundingTo30();
        } else if (startDate === currentDay) {
          selector = this.roundingTo30();
        } else {
          selector = '08:00';
        }
        let scrollElem = document.getElementsByClassName(`${selector}`)[0];
        let topPos = scrollElem.offsetTop;
        const elem = document.getElementById(`${id}`);
        elem.scrollTop = topPos;
        this.setState({ startDate });
      }, 50);
    }
  }

  componentWillUnmount() {
    if (this.handleSeparateEvent) {
      document.body.removeEventListener('click', this.handleSeparateEvent);
    }
  }

  renderVehicleTypeImage() {
    const { carImage } = this.state;
    if (carImage) {
      return (
        <div className={'vz-vehicle-type-image'}>
          <div className={'text-center margin-bottom-5 vz-image'}>
            <img src={carImage} />
          </div>
        </div>
      );
    }
  }

  renderWithImages(filtered, list) {
    const { onChange, useIdAsKey } = this.props;
    return _map(Object.keys(filtered).length ? filtered : list, (val, key) => {
      let resp = { key: useIdAsKey ? val.id : key, val };
      if (resp.addressString) {
        resp = { key: key + 1, val: resp.addressString };
      }
      return (
        <div
          className={`vz-dropdown-item ${typeof val === 'string' ? val : ''}`}
          key={key}
          onMouseLeave={() => {
            this.setState({ carImage: null });
          }}
          onMouseOver={() => {
            this.setState({ carImage: val.image ? val.image : null });
          }}
          onClick={() => (key !== '99999' ? onChange(resp) : null)}
        >
          <span style={val.style || {}}>{typeof val !== 'string' ? val.title || val.name || val.addressString || val : val}</span>
        </div>
      );
    });
  }

  onChange(resp) {
    resp.checked = !resp.checked;
    this.props.onChange(resp);
  }

  renderMultipleChoice(filtered, list, checked) {
    const { useIdAsKey } = this.props;
    return _map(Object.keys(filtered).length ? filtered : list, (val, key) => {
      let resp = { key: useIdAsKey ? val.id : key, val, checked: checked.includes(key) };
      return (
        <div
          className={`vz-dropdown-item ${typeof val === 'string' ? val : ''}`}
          key={key}
          onClick={() => (key !== '99999' ? this.onChange(resp) : null)}
        >
          <div className={'custom-checkbox ' + (resp.checked ? 'checked' : '')} />
          <span style={val.style || {}}>{typeof val !== 'string' ? val.name || val.addressString || val : val}</span>
        </div>
      );
    });
  }

  filter(e) {
    const { filterVal } = this.state;
    const { list } = this.props;
    const filtered = {};

    for (const prop in list) {
      if ((list[prop]?.name?.toLowerCase() || list[prop].toLowerCase()).includes(filterVal.toLowerCase())) {
        filtered[prop] = list[prop];
      }
    }
    this.setState({ filtered });
  }

  roundingTo30() {
    const start = moment();
    const remainder = 30 - (start.minute() % 30);

    const dateTime = moment(start).add(1, 'hours').add(remainder, 'minutes').format('HH:mm');

    return dateTime;
  }

  render() {
    const {
      list,
      onChange,
      allowFilter,
      geoCoder,
      className,
      isTimePicker,
      useIdAsKey,
      multipleChoice,
      checked,
      forwardedRef,
    } = this.props;
    const { filtered, id } = this.state;
    const items = geoCoder
      ? _reduce(
          list,
          (acc, val, key) => {
            const addr = Utils.concatToFullAddress(val);
            if (addr.length) {
              val.fullAddress = addr.join(', ');
              acc.push(
                <div className={'vz-dropdown-item'} key={key} onClick={() => onChange(val)}>
                  {val.fullAddress}
                </div>,
              );
            }
            return acc;
          },
          [],
        )
      : multipleChoice
      ? this.renderMultipleChoice(filtered, list, checked)
      : this.renderWithImages(filtered, list);

    return typeof allowFilter !== 'undefined' ? (
      <div className={'vz-dropdown-content'}>
        <div id={id} ref={forwardedRef} className={'vz-dropdown-list static'}>
          <div className={`${className || ''} vz-dropdown-item`}>
            <input
              onChange={async (e) => {
                await this.setState({ filterVal: e.target.value });
                this.filter();
              }}
              placeholder={'Поиск...'}
            />
          </div>
          <div className={'vz-dropdown-sub'}>{items}</div>
        </div>
        {this.renderVehicleTypeImage()}
      </div>
    ) : (
      <div id={id} ref={forwardedRef} className={'vz-dropdown-list'}>
        {items}
      </div>
    );
  }
}

export default DropDown;
