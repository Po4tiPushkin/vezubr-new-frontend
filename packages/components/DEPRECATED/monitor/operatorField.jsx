import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconDeprecated, NotifyBadge } from '@vezubr/elements';
import moment from 'moment';
import { Orders as OrdersService } from '@vezubr/services';
import t from '@vezubr/common/localization';

import autobind from 'autobind-decorator';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import PublishContourInfo from '../../contour/publishContourInfo';

class OperatorField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      data: props.data,
      type: props.type,
    };
  }

  onRemove = async (e) => {
    e.stopPropagation();
    if (!this.state.showModal) return this.onModalToggle();
    try {
      await OrdersService.cancelRequest(this.state.data.request_id);
      this.props.onFieldRemove(this.state.data);
      this.onModalToggle();
    } catch (e) {
      // this.props.onFieldRemove(this.state.data);
      this.onModalToggle();
    }
  };

  onFieldClick = () => {
    const { type, onFieldClick } = this.props;
    if (['selection', 'execution'].some((e) => type === e)) {
      onFieldClick(this.state.data);
    }
  };

  onView = (e) => {
    const { data, type } = this.state;
    const { history } = this.context;
    const redirectionType = type === 'selection' ? 'map' : type === 'paperCheck' ? 'documents' : 'map';
    history.push(`/orders/${data.id}/${redirectionType}`);
    e.stopPropagation();
  };

  onLocate = (e) => {
    e.stopPropagation();
    this.props.onLocate(this.state.data);
  };

  onMessage = (e) => {
    e.stopPropagation();
  };

  renderConnectedOrderSection = () => {
    const { connectedOrder } = this.state.data;
    const { dictionaries } = this.props;
    return (
      <div className={'field-content'}>
        <div className="field-desc flexbox">
          <div className={'inline-flex flexbox size-0_1 margin-right-8'}>{connectedOrder.id}</div>
          <div className={'inline-flex flexbox size-0_7'}>
            {connectedOrder.uiState ? dictionaries?.loadersOrderStatuses[connectedOrder.uiState] || null : null}
          </div>
          <div className={'inline-flex flexbox size-0_2 justify-right'}>12 мин</div>
        </div>
        <div className="field-address flexbox">
          {/*
				<div>{moment(connectedOrder.startAtLocal).format('lll').toUpperCase()}</div>
*/}
          <div>{connectedOrder?.firstPoint?.addressString || null}</div>
        </div>
      </div>
    );
  };

  renderIcon(co) {
    let { type, problem, problems, connectedOrder } = this.state.data;
    let icon = 'pinGrey';
    problem = co ? connectedOrder.problem : problem || Array.isArray(problems) ? problems[0] : null;
    if (!co) {
      icon = type === 2 ? (problem ? 'truckLoaderRed' : 'truckLoaderGrey2') : problem ? 'truckRed' : 'truckGray';
    } else if (co) {
      icon = problem ? 'truckLoaderRed' : 'truckLoaderGrey2';
    }

    const style = {
      width: '30px',
      height: '30px',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    };
    const iconStyle = { height: '33px', width: 'auto' };
    return (
      <div className="icon-second-border" style={style}>
        <IconDeprecated style={iconStyle} name={icon} />
      </div>
    );
  }

  renderFieldIconSection = () => {
    const { problem, connectedOrder } = this.state.data;
    return (
      <div className="field-icons">
        <div className={connectedOrder ? 'border-down icon-border ' : 'icon-border'}>
          {problem ? (
            <NotifyBadge className={'nav-notify field-attention'} type={'danger'}>
              <span>!</span>
            </NotifyBadge>
          ) : null}
          {this.renderIcon()}
        </div>
        {connectedOrder ? (
          <div className="icon-border" style={{ position: 'relative' }}>
            {connectedOrder.problem ? (
              <NotifyBadge className={'nav-notify field-attention'} type={'danger'}>
                <span>!</span>
              </NotifyBadge>
            ) : null}
            {this.renderIcon(true)}
          </div>
        ) : null}
      </div>
    );
  };

  renderHoverSection = () => {
    const { type } = this.props;
    const { problem } = this.state.data;
    return (
      <div className={'field-hover ' + (problem ? 'bg-white_grad' : 'bg-grey_grad')}>
        <IconDeprecated name={'arbeitenBlack'} className={'pointer'} onClick={this.onView} />
        <IconDeprecated name={'mappinBlack'} className={'pointer'} onClick={this.onLocate} />
      </div>
    );
  };

  @autobind
  onTruckClick() {
    this.props.onTruckClick(this.state.data);
  }

  @autobind
  onModalToggle() {
    this.setState({ showModal: !this.state.showModal });
  }

  formatDate(date) {
    if (moment(date).diff(moment(new Date())) === 0) {
      return t.common('today');
    }
    return moment(date).format('MMM DD').toUpperCase();
  }

  renderAddresses(points) {
    return points ? (
      <span>
        {points['0'].addressString} - {points[points.length - 1].addressString}
      </span>
    ) : null;
  }

  renderAddress(address) {
    return address ? <span>{address.addressString}</span> : null;
  }

  render() {
    let {
      requestId,
      activeOrderPoint,
      id,
      timeoutSelecting,
      isDriverLoaderRequired,
      uiStateEnteredAt,
      uiState,
      loadersCount,
      problem,
      problems,
      points,
      address,
      startAtLocal,
      toStartAtLocal,
      toStartAtTime,
      vehicleTypeId,
      orderedLoadersCount,
      effectiveCalculation,
      type,
      loaders = [],
      firstPoint,
      connectedOrder,
      requiredContourIds,
    } = this.state.data;
    let timeout = false;
    let price = null;
    let lessOrEqualOne = false;
    let { dictionaries, user, popupView } = this.props;
    const { showModal } = this.state;
    let duration = moment.duration(moment.unix(uiStateEnteredAt).diff(moment())).humanize();
    if (duration === 'день' || duration === 'месяц' || duration === 'час') duration = `1 ${duration}`;
    let currentPoint = `${
      dictionaries[type === 1 ? 'transportOrderStatuses' : 'loadersOrderStatuses'][uiState] || 'Статус неизвестен'
    }, ${duration}`;
    const deadline = timeoutSelecting;
    const currentTime = moment().unix();
    const diffTime = deadline - currentTime;
    /*timeout = moment.duration(diffTime).humanize();
		if (timeout === 'день' || timeout === 'минута' || timeout === 'час') timeout = `1 ${timeout}`;
		if(timeout === 'несколько секунд') timeout = `0 мин.`;
		const timeInt = parseInt(timeout.replace(/[^0-9.]/g, ""));
		lessOrEqualOne = timeInt <=5 && timeout.includes('мин');*/
    return (
      <div className="pointer" style={popupView ? { width: '100%' } : {}}>
        <div
          className={'producer-field-container'}
          onClick={popupView ? this.onLocate : void 1}
          style={{ height: connectedOrder ? 120 : 80 }}
        >
          {!popupView ? this.renderHoverSection() : null}
          {this.renderFieldIconSection()}
          <div className={`field-info ${problem ? 'problem-order' : ''}`} onClick={this.onFieldClick}>
            <div className={connectedOrder ? 'field-content field-content-border-bottom' : 'field-content'}>
              <div className="field-desc flexbox">
                <div className={'inline-flex flexbox size-0_1  margin-right-8 title-bold'}>{id}</div>
                <div className={'inline-flex flexbox size-0_7 margin-right-8 title-bold'}>
                  {type === 2 ? `${loadersCount || loaders.length} грузч.` : dictionaries?.vehicleTypes[vehicleTypeId]}
                  <PublishContourInfo contourIds={requiredContourIds} />
                </div>
                <div className={'inline-flex flexbox size-0_2 date-section title-bold justify-right'}>
                  <div className={'margin-right-4'}>{this.formatDate(startAtLocal || toStartAtLocal)}</div>
                  <div>{toStartAtTime}</div>
                  {/*
								{type === 'paperCheck' ? <div>{toStartAtTime}</div> : null}
								*/}
                </div>
              </div>
              <div className={'field-small-desc flexbox'}>
                {<small>{currentPoint}</small>}
                {timeout ? (
                  <div
                    className={`align-center justify-right flexbox size-1`}
                    style={{
                      fontSize: '16px',
                      color: lessOrEqualOne ? '#BC1A46' : '#000',
                    }}
                  >
                    {timeout}
                  </div>
                ) : null}
                {price ? (
                  <div
                    className={`align-center justify-right flexbox size-1`}
                    style={{
                      fontSize: '16px',
                      color: '#000',
                    }}
                  >
                    {price}
                  </div>
                ) : null}
              </div>
              <div className="field-address flexbox line-clamp-1">
                {isDriverLoaderRequired ? (
                  <IconDeprecated
                    name={'truckLoaderGrey'}
                    style={{ width: '14px', height: '14px', marginRight: '4px' }}
                  />
                ) : null}
                <div>
                  {isDriverLoaderRequired && !loadersCount ? `X1 ` : null}
                  {type === 2 ? this.renderAddress(firstPoint) : this.renderAddresses(points)}
                </div>
              </div>
            </div>
            {connectedOrder ? this.renderConnectedOrderSection() : null}
          </div>
        </div>
        {/*<Modal title={{
				classnames: 'identificator',
				text: t.common('confirm')
			}}
				   options={{showModal}}
				   size={"small"}
				   onClose={this.onModalToggle}
				   animation={false}
				   showClose={true}
				   content={<CustomBox
					   content={<div>{t.buttons('removeOrder')}</div>}
					   buttons={[
						   {
							   text: t.common('confirm'),
							   theme: 'primary',
							   event: (e) => this.onRemove(e)
						   }
					   ]}
				   />}
			/>*/}
      </div>
    );
  }
}

OperatorField.contextTypes = {
  routes: PropTypes.object.isRequired,
  history: PropTypes.object,
  observer: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { user, dictionaries } = state;
  return {
    user,
    dictionaries,
  };
};

OperatorField.propTypes = {
  data: PropTypes.object.isRequired,
  onLocate: PropTypes.func.isRequired,
  onFieldClick: PropTypes.func.isRequired,
  onFieldRemove: PropTypes.func.isRequired,
  onTruckClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(OperatorField);
