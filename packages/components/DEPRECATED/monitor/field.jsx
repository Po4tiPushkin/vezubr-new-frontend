import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconDeprecated, NotifyBadge, CustomBoxDeprecated } from '@vezubr/elements';
import moment from 'moment';
import { Orders as OrdersService } from '@vezubr/services';
import t from '@vezubr/common/localization';
import Modal from '../modal/modal';
import autobind from 'autobind-decorator';
import Utils from '@vezubr/common/common/utils';
import PublishContourInfo from '../../contour/publishContourInfo';

class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      data: props.data,
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

  componentDidMount() {
    const { data } = this.state;
    const { observer } = this.context;
    if (this.timeout) clearInterval(this.timeout);
    data.timeElapsed = 0;
    this.timeout = setInterval(() => {
      const { data } = this.state;
      data.timeElapsed++;
      this.setState({ data });
    }, 60000);
    observer.subscribe(`order-${data.id}`, (r) => {
      if (r.type === 'statusChange') {
        data.frontend_status.state = r.data.status;
      } else if (r.type === 'problem') {
        if (r.data.problemStatus === 4) {
          data.problem = null;
        } else {
          data.problem = {
            createdAt: r.data.createdAt,
            status: r.data.problemStatus,
            type: r.data.problemType,
          };
        }
      }
      this.setState({ data });
    });
  }

  componentWillUnmount() {
    if (this.timeout) clearInterval(this.timeout);
    const { observer } = this.context;
    const { data } = this.state;
    observer.unsubscribe(`order-${data.id}`);

    // if (this.coTimeout) clearInterval(this.coTimeout);
  }

  onFieldClick = (e) => {
    const { type, onFieldClick } = this.props;
    //if (type === 'paperCheck') {
    this.onView(e);
    //} else if ((['selection', 'execution'].some((e) => type === e))) {
    //	onFieldClick(this.state.data);
    //}
  };

  onView = (e) => {
    const { data } = this.state;
    const { history, type } = this.props;
    let url = `/orders/${data.id}`;
    if (type === 'paperCheck') {
      url += `/documents`;
    } else if (type === 'execution') {
      url += `/perpetrators`;
    } else {
      url += `/map`;
    }
    history.push(url);
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
    let tt = Utils.formatMonitorDateFormat(connectedOrder.frontend_status);
    return (
      <div className={'field-content'}>
        <div className="field-desc flexbox">
          <div className={'inline-flex flexbox size-0_1 margin-right-8'}>{connectedOrder.id}</div>
          <div className={'inline-flex flexbox size-0_7'}>
            {connectedOrder.frontend_status
              ? dictionaries?.loadersOrderStatuses?.[connectedOrder.frontend_status.state] || null
              : null}
          </div>
          <div className={'inline-flex flexbox size-0_2 justify-right'}>{tt}</div>
        </div>
        <div className="field-address flexbox">
          <div>{moment(connectedOrder?.start_at_local).format('DD MMM, HH:mm').toUpperCase().replace('.', '')}</div>
          <div style={{ marginLeft: 8 }}>{connectedOrder.points['1'] ? connectedOrder.points['1'].address : null}</div>
        </div>
      </div>
    );
  };

  renderIcon(co) {
    const {
      type,
      user_notification,
      problem,
      connectedOrder,
      frontend_status,
      start_at_local,
      effectiveCalculation,
    } = this.state.data;
    const { type: monitorType } = this.props;
    const today = moment(start_at_local).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
    let problm = co ? connectedOrder.problem : problem;
    const typ = co ? connectedOrder.type : type;
    let icon;

    if (problm) {
      icon = typ === 1 ? 'truckRed' : type === 3 ? 'truckIntercityRed' : 'truckLoaderRed';
    } else if (!problm && user_notification) {
      icon = typ === 1 ? 'truckYellow' : type === 3 ? 'truckIntercityYellow' : 'truckLoaderYellow';
    } else if (!problm && !user_notification) {
      icon = typ === 1 ? 'truckBlue' : type === 3 ? 'truckIntercityBlue' : 'truckLoaderBlue';
    }

    if (APP === 'client') {
      if (monitorType === 'selection' && !problm) {
        if (frontend_status?.state === 106 || frontend_status?.state === 107 || today) {
          icon = typ === 1 ? 'truckBlack' : type === 3 ? 'truckIntercityBlack' : 'truckLoaderBlack2';
        } else {
          icon = typ === 1 ? 'truckGray' : type === 3 ? 'truckIntercityGray' : 'truckLoaderGrey2';
        }
      }
    }

    return (
      <div className="icon-second-border">
        <IconDeprecated name={icon} />
      </div>
    );
  }

  renderFieldIconSection = () => {
    const { connectedOrder, problem } = this.state.data;
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
    const { type, data } = this.props;
    const { problem, frontend_status } = this.state.data;
    const removeData =
      type === 'selection' ? <IconDeprecated name={'xBlack'} className={'pointer'} onClick={this.onRemove} /> : null;

    return (
      <div className={'field-hover ' + (problem ? 'bg-white_grad' : 'bg-grey_grad')}>
        {data.loaders && data.loaders.length > 0 ? '' : removeData}
        <IconDeprecated name={'eyeBlack'} className={'pointer'} onClick={this.onView} />
        {frontend_status?.state < 400 || frontend_status?.state === 403 ? (
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
    if (moment().isSame(date, 'day')) {
      return `${t.common('today')}, `;
    }
    return moment(date).format('DD MMM,').toUpperCase().replace('.', '');
  }

  render() {
    const {
      request_id,
      id,
      start_at_local,
      required_contour_ids,
      frontend_status,
      vehicle,
      vehicle_type,
      points,
      connectedOrder,
      problem,
      type,
      effectiveCalculation,
      loadersCount,
    } = this.state.data;
    const { showModal } = this.state;
    const { dictionaries } = this.props;
    const keys = Object.keys(points);
    const last = keys[keys.length - 1];
    let tt = Utils.formatMonitorDateFormat(frontend_status);
    let price = null;
    if (this.props.type === 'paperCheck') {
      price = effectiveCalculation ? Utils.moneyFormat(effectiveCalculation?.cost) : null;
    }
    return (
      <div className="pointer">
        <div
          className={'producer-field-container ' + (problem ? 'bg-white' : 'bg-grey_0')}
          style={{ height: connectedOrder ? 140 : 80 }}
        >
          {this.renderHoverSection()}
          {this.renderFieldIconSection()}
          <div className={`field-info ${problem ? 'problem-order' : ''}`} onClick={this.onFieldClick}>
            <div className="field-content">
              <div className="field-desc flexbox">
                <div className={'inline-flex flexbox size-0_1  margin-right-8 title-bold'}>{id}</div>
                <div className={'inline-flex flexbox size-0_7 margin-right-8 title-bold'}>
                  {type === 2 ? `${loadersCount} грузч.` : vehicle ? vehicle?.vehicle_type?.name : vehicle_type?.name}
                  <PublishContourInfo contourIds={required_contour_ids} />
                  {problem && problem.type === 9 ? (
                    <NotifyBadge
                      className={'nav-notify message-badge pointer field-attention margin-left-4 warning'}
                      type={'message'}
                      onClick={this.onMessage}
                    >
                      <span>{problem.data?.dispute_new_messages} сообщения</span>
                    </NotifyBadge>
                  ) : null}
                </div>
                <div className={'inline-flex flexbox size-0_2 date-section title-bold justify-right'}>
                  <div className={'margin-right-4'}>{this.formatDate(start_at_local)}</div>
                  <div>{moment(start_at_local).format('HH:mm').toUpperCase().replace('.', '')}</div>
                </div>
              </div>
              <div className={'field-small-desc text-overflow'}>
                <small>
                  {frontend_status && dictionaries ? (
                    <span>
                      {dictionaries?.transportOrderStatuses?.[frontend_status.state]}, {tt}
                    </span>
                  ) : null}
                </small>
              </div>
              <div className="field-address flexbox line-clamp-1">
                <div>
                  {points['1'] ? points['1'].address : null}
                  {points[last] ? ` - ${points[last].address}` : null}
                </div>
                {price ? (
                  <div
                    className={`align-center justify-right flexbox`}
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
            {connectedOrder ? this.renderConnectedOrderSection() : null}
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

Field.contextTypes = {
  observer: PropTypes.object,
};

Field.propTypes = {
  data: PropTypes.object.isRequired,
  onLocate: PropTypes.func.isRequired,
  onFieldClick: PropTypes.func.isRequired,
  onFieldRemove: PropTypes.func.isRequired,
};

export default Field;
