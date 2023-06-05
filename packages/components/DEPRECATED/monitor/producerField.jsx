import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconDeprecated, NotifyBadge } from '@vezubr/elements';
import moment from 'moment';
import { Orders as OrdersService } from '@vezubr/services';
import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { CustomBoxDeprecated } from '@vezubr/elements';
import Modal from '../modal/modal';
import autobind from 'autobind-decorator';
import connect from 'react-redux/es/connect/connect';
import PublishContourInfo from '../../contour/publishContourInfo';

const executionOrderUiStates = {
  301: 'В пути $dur$ к',
  307: 'Документы оформлены  $dur$,',
  302: 'Остановка, по пути $dur$ к',
  304: 'Прибыл $dur$,',
};

class ProducerField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      data: props.data,
      type: props.type,
    };
  }


  componentDidMount() {
    const { observer } = this.context;
    const { data } = this.state;
    if (this.timeout) clearInterval(this.timeout);
    data.timeElapsed = 0;
    this.timeout = setInterval(() => {
      const { data } = this.state;
      data.timeElapsed++;
      this.setState({ data });
    }, 60000);
    observer.subscribe(`order-${data.id}`, (r) => {
      if (r.type === 'statusChange') {
        data.uiState = r.data.status;
      } else if (r.type === 'problem') {
        if (r.data.problemStatus === 4) {
          data.problem = null;
        }
      }
      this.setState({ data });
    });
  }

  componentWillUnmount() {
    if (this.timeout) clearInterval(this.timeout);
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
    if (['selection', 'execution', 'paperCheck'].some((e) => type === e)) {
      onFieldClick(this.state.data);
    }
  };

  onView = (e) => {
    const { data, type } = this.state;
    const { history } = this.context;
    const redirectionType =
      type === 'selection'
        ? 'map'
        : type === 'paperCheck'
        ? 'documents'
        : type === 'execution'
        ? 'perpetrators'
        : 'map';
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

  @autobind
  onTruckClick() {
    this.props.onTruckClick(this.state.data);
  }

  renderConnectedOrderSection = () => {
    const { connectedOrder } = this.state.data;
    const { dictionaries } = this.props;
    return (
      <div className={'field-content'}>
        <div className="field-desc flexbox">
          <div className={'inline-flex flexbox size-0_1 margin-right-8'}>{connectedOrder.id}</div>
          <div className={'inline-flex flexbox size-0_6'}>
            {connectedOrder.frontend_status
              ? dictionaries?.loadersOrderStatuses[connectedOrder.frontend_status.state] || null
              : null}
          </div>
          <div className={'inline-flex flexbox size-0_2 justify-right'}>12 мин</div>
          <div className={'inline-flex flexbox size-0_2 justify-right'} />
        </div>
        <div className="field-address flexbox">
          <div>{moment(connectedOrder.start_at_local).format('lll').toUpperCase()}</div>
          <div style={{ marginLeft: 8 }}>{connectedOrder.points['1'] ? connectedOrder.points['1'].address : null}</div>
        </div>
      </div>
    );
  };

  renderIcon() {
    let { type, user_notification, problem, problems } = this.state.data;
    let icon = 'pinGrey',
      style = {},
      iconStyle = {};
    problem = problem || Array.isArray(problems) ? problems[0] : null;
    if (problem) {
      icon = 'pinRed';
    }
    /*switch (problem?.type) {
			case 1:
				icon = 'pinOrange';
				break;
			case 2:
				icon = 'pinBlack';
				break;
			case 3:
				icon = 'pinGrey';
				break;
			default:
				icon = 'pinGrey';
				break
		}*/
    /*if (problem) {
			icon = type === 1 ? 'mapPinOrange' : 'mapPinOrange'
		} else if (!problem && user_notification) {
			icon = type === 1 ? 'mapPinOrange' : 'mapPinOrange'
		} else if (!problem && !user_notification) {
			icon = type === 1 ? 'mapPinOrange' : 'mapPinOrange'
		}*/
    if (this.props.type === 'paperCheck' || this.props.type === 'execution') {
      icon = 'truckBlue';
      style = {};
      iconStyle = {};
      if (problem) {
        icon = 'truckRed';
      }
    } else {
      style = {
        width: '30px',
        height: '30px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      };
      iconStyle = { height: '22px', width: 'auto' };
    }
    return (
      <div className="icon-second-border" style={style}>
        <IconDeprecated style={iconStyle} name={icon} />
      </div>
    );
  }

  renderFieldIconSection = () => {
    let { problem, problems } = this.state.data;
    problem = problem || Array.isArray(problems) ? problems[0] : null;
    return (
      <div className="field-icons">
        <div className={'icon-border'}>
          {problem ? (
            <NotifyBadge className={'nav-notify field-attention'} type={'danger'}>
              <span>!</span>
            </NotifyBadge>
          ) : null}
          {this.renderIcon()}
        </div>
      </div>
    );
  };

  renderHoverSection = () => {
    const { type } = this.props;
    const { problem, wasSplitted, uiState } = this.state.data;
    const isInSelection = ['selection', 'selectionEnding'].some((e) => e === type);
    //truckLoaderBlack
    return (
      <div className={'field-hover ' + (problem ? 'bg-white_grad' : 'bg-grey_grad')}>
        {isInSelection && wasSplitted && type !== 'paperCheck' ? (
          <IconDeprecated name={'xBlack'} className={'pointer'} onClick={this.onRemove} />
        ) : null}

        {['selection', 'selectionEnding', 'execution'].some((e) => e === type) && uiState !== 201 ? (
          <IconDeprecated
            name={this.state.data.type === 2 ? 'truckLoaderBlack2' : 'truckBlack'}
            className={'pointer'}
            onClick={type === 'execution' ? this.onLocate : this.onTruckClick}
          />
        ) : null}

        <IconDeprecated name={'eyeBlack'} className={'pointer'} onClick={this.onView} />

        {isInSelection && type !== 'paperCheck' ? (
          <IconDeprecated name={'mappinBlack'} className={'pointer'} onClick={this.onLocate} />
        ) : null}
      </div>
    );
  };

  @autobind
  onModalToggle() {
    this.setState({ showModal: !this.state.showModal });
  }

  formatDate(date) {
    /*if (moment(date).diff(moment()) === 0) {
			return t.common('today')
		}*/
    if (moment().isSame(date, 'day')) {
      return `${t.common('today')}, `;
    }
    return moment(date).format('DD MMM,').toUpperCase().replace('.', '');
  }

  renderAddresses(points) {
    points.sort((a, b) => {
      return a.position - b.position;
    });
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
      requiredContourIds,
    } = this.state.data;

    let { dictionaries, type, user, popupView } = this.props;
    const { showModal } = this.state;
    //const currentPoint = type === 'execution' ? executionOrderUiStates[uiState] || dictionaries?.transportOrderStatuses?.[uiState] : '';
    let currentPoint = dictionaries?.transportOrderStatuses?.[uiState];
    let duration = moment.duration(moment.unix(uiStateEnteredAt).diff(moment())).humanize();
    if (duration === 'день' || duration === 'месяц') duration = `1 ${duration}`;
    let timeout = false;
    let lessOrEqualOne = false;
    let price = null;
    problem = problem || Array.isArray(problems) ? problems[0] : null;
    
    if (type === 'selection' && user['function'] === 2) {
      currentPoint = `${
        executionOrderUiStates[uiState]
          ? executionOrderUiStates[uiState].replace('$dur$', `(${duration})`)
          : `${dictionaries?.loadersOrderStatuses[uiState]}, ${duration}`
      }`;
      if (timeoutSelecting) {
        const deadline = timeoutSelecting;
        const currentTime = moment().unix();
        const diffTime = deadline - currentTime;
        timeout = moment.duration(diffTime).humanize();
        if (timeout === 'день' || timeout === 'минута' || timeout === 'час') timeout = `1 ${timeout}`;
        if (timeout === 'несколько секунд') timeout = `0 мин.`;
        const timeInt = parseInt(timeout.replace(/[^0-9.]/g, ''));
        lessOrEqualOne = timeInt <= 5 && timeout.includes('мин');
      }
    } else {
      if (type === 'execution') {
        //
        currentPoint = `${
          executionOrderUiStates[uiState]
            ? executionOrderUiStates[uiState].replace('$dur$', `${duration}`)
            : `${dictionaries?.transportOrderStatuses?.[uiState]} ${duration}`
        }  ${activeOrderPoint?.addressString || ''}`;
      } else {
        //duration
        currentPoint = `${currentPoint}, ${duration}`;
      }
      if (type === 'selectionEnding') {
        const deadline = timeoutSelecting;
        const currentTime = moment().unix();
        const diffTime = deadline - currentTime;
        timeout = moment.duration(diffTime).humanize();
        if (timeout === 'день' || timeout === 'минута' || timeout === 'час') timeout = `1 ${timeout}`;
        if (timeout === 'несколько секунд') timeout = `0 мин.`;
        const timeInt = parseInt(timeout.replace(/[^0-9.]/g, ''));
        lessOrEqualOne = timeInt <= 5 && timeout.includes('мин');
      }
      if (type === 'paperCheck') {
        price = effectiveCalculation ? Utils.moneyFormat(effectiveCalculation?.cost) : null;
      }
    }

    return (
      <div className="pointer" style={popupView ? { width: '100%' } : {}}>
        <div className={'producer-field-container'} onClick={popupView ? this.onLocate : void 1} style={{ height: 80 }}>
          {!popupView ? this.renderHoverSection() : null}
          {this.renderFieldIconSection()}
          <div className={`field-info ${problem ? 'problem-order' : ''}`} onClick={this.onFieldClick}>
            <div className="field-content">
              <div className="field-desc flexbox">
                <div className={'inline-flex flexbox size-0_1  margin-right-8 title-bold'}>{id}</div>
                <div className={'inline-flex flexbox size-0_7 margin-right-8 title-bold'}>
                  {user['function'] === 2 ? `${orderedLoadersCount} грузч.` : dictionaries?.vehicleTypes[vehicleTypeId]}
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
              <div className={'field-small-desc text-overflow'}>
                <small>{currentPoint}</small>
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
                  {user['function'] === 2 ? this.renderAddress(address) : this.renderAddresses(points)}
                </div>
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
                      marginLeft: 'auto',
                    }}
                  >
                    {price}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <Modal
          title={{
            classnames: 'identificator',
            text: t.common('confirm'),
          }}
          options={{ showModal }}
          size={'small'}
          onClose={this.onModalToggle}
          animation={false}
          showClose={true}
          content={
            <CustomBoxDeprecated
              content={<div>{t.buttons('removeOrder')}</div>}
              buttons={[
                {
                  text: t.common('confirm'),
                  theme: 'primary',
                  event: (e) => this.onRemove(e),
                },
              ]}
            />
          }
        />
      </div>
    );
  }
}

ProducerField.contextTypes = {
  routes: PropTypes.object.isRequired,
  history: PropTypes.object,
  observer: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { user } = state;
  return {
    user,
  };
};

ProducerField.propTypes = {
  data: PropTypes.object.isRequired,
  onLocate: PropTypes.func.isRequired,
  onFieldClick: PropTypes.func.isRequired,
  onFieldRemove: PropTypes.func.isRequired,
  onTruckClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};


export default connect(mapStateToProps)(ProducerField);
