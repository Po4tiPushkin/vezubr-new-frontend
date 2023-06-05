import React, { Component } from 'react';
import { IconDeprecated } from '@vezubr/elements';
import InputField from '../inputField/inputField';
import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

class TrailersFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trailers: props.trailers,
      filteredList: props.trailers,
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

  onSelect = (trailers) => {
    this.props.onSelect(trailers);
  };

  onInputChange(e) {
    const { target } = e;
    const { value } = target;
    const { trailers } = this.state;
    const filteredList = trailers.filter((trailers) => {
      return (
        trailers?.plateNumber.toLowerCase().includes(value.toLowerCase()) ||
        trailers?.markAndModel.toLowerCase().includes(value.toLowerCase())
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

    return filteredList.map((trailer, key) => {
      const classNames = ['element'];

      return (
        <div className={classNames.join(' ')} key={key} onClick={() => this.onSelect(trailer)}>
          <div className={'flexbox column driver-info'}>
            <div className={'bold driver-name'}>
              {trailer.plateNumber}
            </div>
            <div>
              {trailer.markAndModel}
            </div>
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
        placeholder={'Поиск по всем полуприцепам'}
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

TrailersFilter.propTypes = {
  trailers: PropTypes.array,
  onClose: PropTypes.func,
  classNames: PropTypes.string,
  onSelect: PropTypes.func,
  showPhone: PropTypes.bool,
};

export default TrailersFilter;
