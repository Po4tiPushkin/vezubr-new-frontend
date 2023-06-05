import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/button';
import Icon from '../icon/icon';
import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import moment from 'moment';
import InputMask from 'react-input-mask';
const execution = [301, 302, 303, 304, 305, 306, 307, 803, 804, 403];

class MapPopup extends React.Component {
  state = {
    data: {},
  };

  componentWillMount() {
    const { keyProp, onAssignClick, onArrowClick, observer, ...other } = this.props;
    const { data } = other;
    this.setState({ data });
    setTimeout(() => {
      const arrow = document.getElementById(`arrowClick${keyProp}`);
      const button = document.getElementById(`assignButton${keyProp}`);
      if (arrow) {
        arrow.addEventListener('click', () => {
          onArrowClick(data);
        });
      }
      if (button) {
        button.addEventListener('click', () => {
          onAssignClick(data);
        });
      }
    }, 0);

    observer.subscribe(`order_${data.id}`, (d) => {
      const { data } = this.state;
      try {
        data.vehicle.lastGpsSentAt = moment(d.createdAt.date).local().format('X');
      } catch (e) {}
      //this.setState({data});
      //data?.vehicle?.lastGpsSentAt
    });
  }

  componentWillUnmount() {
    const { data } = this.state;
    const { observer } = this.context;
    observer.off(`order_${data.id}`);
  }

  assignTransportOperator(data) {
    return (
      <div>
        <div className={'margin-bottom-12 flexbox'}>
          <div className={'size-1 '}>
            <div className={'popup-sub-reg'}>{`${data.currentDriver?.name || ''} ${data.currentDriver?.surname || ''} ${
              data.currentDriver?.patronymic || ''
            }`}</div>
            <div
              className={'popup-sub-reg'}
              style={{
                marginTop: '5px',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              {data?.currentDriver?.applicationPhone ? (
                <InputMask
                  style={{ padding: 0, border: 0 }}
                  mask={'+9 (999) 999-99-99'}
                  value={data?.currentDriver?.applicationPhone}
                />
              ) : null}
            </div>
          </div>
        </div>
        <hr className={'margin-top-5 margin-bottom-5'} />
        {data?.vehicle?.lastApiCallAt || data?.lastApiCallAt ? (
          <div className={'margin-bottom-12 flexbox'}>
            <div className={'size-1 '}>
              <div className={'size-1 margin-top-4'}>
                <div className={'popup-status-last-update'}>
                  Обновлено {moment.unix(data?.vehicle?.lastApiCallAt || data?.lastApiCallAt).fromNow()}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  assignOrderOpearator(data) {
    const { dictionaries } = this.props;
    const exec = execution.includes(data.uiState);
    return (
      <div>
        {!exec ? (
          <Fragment>
            <div className={'margin-bottom-12 flexbox'}>
              <div className={`size-1`}>
                <div className={'popup-sub-title'}>{t.order('orderDate')}</div>
                <div className={'popup-sub-reg'}>{Utils.formatDate(data.toStartAtDate, 'DD MMM YYYY')}</div>
              </div>
              <div>
                <div className={'popup-sub-title'}>{t.order('orderTime')}</div>
                <div className={'popup-sub-reg'}>{data.toStartAtTime}</div>
              </div>
            </div>
            <div className={'margin-bottom-12 flexbox column'}>
              <div className={'popup-sub-title'}>{t.order('pickUpAddress')}</div>
              <div className={'popup-sub-reg'}>{this.getAddress(data)}</div>
            </div>
          </Fragment>
        ) : null}
        <div className={'margin-bottom-12 flexbox column'}>
          <div className={'popup-sub-title'}>{t.order('Заказчик')}</div>
          <div className={'popup-sub-reg'}>{data?.client?.companyShortName}</div>
        </div>
        {exec ? (
          <Fragment>
            <div className={'margin-bottom-12 flexbox column'}>
              <div className={'popup-sub-title'}>{t.order('Подрядчик')}</div>
              <div className={'popup-sub-reg'}>{`${data?.producer?.companyShortName}`}</div>
            </div>
            <div className={'margin-bottom-12 flexbox column'}>
              <div className={'popup-sub-title'}>{t.order('Водитель')}</div>
              <div className={'popup-sub-reg'}>{`${data.driver?.surname || ''} ${data.driver?.name || ''} ${
                data.currentDriver?.patronymic || ''
              }`}</div>
            </div>
          </Fragment>
        ) : null}
        <hr className={'margin-top-5 margin-bottom-0'} />
        <div>
          <div className={'flexbox row padding-left-15 padding-right-15 padding-top-10 padding-bottom-10'}>
            <div className={'popup-sub-reg popup-status-info margin-right-10'} style={{ fontSiz: '16px' }}>
              {dictionaries[data?.type === 1 ? 'transportOrderStatuses' : 'loaderOrderStatuses'][data.uiState]}
            </div>
            <div className={'popup-status-info-time'}>{moment.unix(data.uiStateEnteredAt).fromNow()}</div>
          </div>
          {data?.vehicle?.lastGpsSentAt ? (
            <div className={'size-1 margin-top-4'}>
              <div className={'popup-status-last-update'}>
                Обновлено {moment.unix(data?.vehicle?.lastGpsSentAt).fromNow()}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  getAddress(data) {
    if (data.points) {
      if (Array.isArray(data.points)) {
        return data.points[0].addressString || data.points[0].address;
      } else {
        return data.points[1].addressString || data.points[1].address;
      }
    }
    if (data.address) {
      return data.address.addressString;
    }
    if (data.firstPoint) {
      return data.firstPoint.addressString;
    }
  }

  render() {
    const {
      children,
      className,
      keyProp,
      type = 'order',
      dictionaries,
      onAssignClick,
      onArrowClick,
      ...other
    } = this.props;
    let classNames = (className || '').split(' ');

    classNames.push(type || '');

    classNames = classNames.join(' ');

    const { data } = this.state;

    //todo move all functions form render to component class:
    const createIcon = () => {
      let iconType = 'truckBlack';
      if (other.popupType === 'execution') {
        iconType = null;
        return; //<div className='margin-left-15 flexbox align-left'/>
      }
      if (data.urgency) {
        switch (data.urgency) {
          case 1:
            iconType = 'truckBlack';
            break;
          case 2:
            iconType = 'truckBlack';
            break;
          case 3:
            iconType = 'truckBlack';
            break;
          default:
            iconType = 'truckBlack';
        }
        return (
          <div className={'flexbox align-left'}>
            <Icon style={{ width: '35px', height: '35px' }} name={iconType} />
          </div>
        );
      }
    };

    const createTitle = () => {
      if (other.popupType === 'execution') {
        return `${plateNumber} ${data?.vehicle?.markAndModel}`;
      }
      if (data.plate_number) {
        return dictionaries?.vehicleTypes[data?.vehicleTypeId]?.name;
      }
      return `Рейс № ${data?.id}`;
    };

    const getAddress = () => {
      if (data.points) {
        if (Array.isArray(data.points)) {
          return data.points[0].addressString || data.points[0].address;
        } else {
          return data.points[1].addressString || data.points[1].address;
        }
      }
      if (data.address) {
        return data.address.addressString;
      }
    };

    const assignTransport = () => {
      return (
        <div>
          <div className={'margin-bottom-12 flexbox'}>
            <div className={`${data.type === 2 ? 'size-1' : 'size-0_5'}`}>
              <div className={'popup-sub-title'}>{t.order('orderDate')}</div>
              <div className={'popup-sub-reg'}>{Utils.formatDate(data.toStartAtDate, 'DD MMM YYYY')}</div>
            </div>
            <div>
              <div className={'popup-sub-title'}>{t.order('orderTime')}</div>
              <div className={'popup-sub-reg'}>{data.toStartAtTime}</div>
            </div>
          </div>
          <div className={'margin-bottom-12 flexbox column'}>
            <div className={'popup-sub-title'}>{t.order('pickUpAddress')}</div>
            <div className={'popup-sub-reg'}>{getAddress()}</div>
          </div>
          <hr className={'margin-top-5 margin-bottom-0'} />
          <div className={'margin-bottom-12 flexbox'} id={`assignButton${keyProp}`}>
            <Button theme={'primary'} className={'margin-top-16 margin-bottom-4'} style={{ width: '100%' }}>
              {data.type === 2 ? t.order('assignLoaders') : t.order('assignTransport')}
            </Button>
          </div>
        </div>
      );
    };

    const assignOrder = () => {
      return (
        <div>
          <div className={'margin-bottom-12 flexbox'}>
            <div className={'size-1 '}>
              <div
                className={'popup-sub-reg'}
              >{`${data.driver?.name} ${data.driver?.surname} ${data.driver?.patronymic}`}</div>
              <div
                className={'popup-sub-reg'}
                style={{
                  marginTop: '5px',
                  fontWeight: 'bold',
                  fontSize: '17px',
                }}
              >
                {data?.driver?.applicationPhone ? (
                  <InputMask
                    style={{ padding: 0, border: 0 }}
                    mask={'+9 (999) 999-99-99'}
                    value={data?.driver?.applicationPhone}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <hr className={'margin-top-5 margin-bottom-5'} />
          {data?.vehicle?.lastApiCallAt || data?.lastApiCallAt ? (
            <div className={'margin-bottom-12 flexbox'}>
              <div className={'size-1 '}>
                <div className={'size-1 margin-top-4'}>
                  <div className={'popup-status-last-update'}>
                    Местоположение Обновлено{' '}
                    {moment.unix(data?.vehicle?.lastApiCallAt || data?.lastApiCallAt).fromNow()}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {data.driver || data.vehicle
            ? null
            : {
                /*<div className={'margin-bottom-12 flexbox'} id={`assignButton${keyProp}`}>
						<Button theme={'primary'}
								className={'margin-top-16 margin-bottom-4'}
								style={{width: '100%'}}>{t.order('assignOrder')}</Button>
					</div>*/
              }}
        </div>
      );
    };

    const clientOrder = () => {
      const enteredAt = moment
        .unix(data?.vehicle?.uiStateEnteredAt || data?.frontend_status?.state_entered_at)
        .fromNow();
      const date = moment.unix(data.start_at);
      return (
        <div>
          <div className={'margin-bottom-12 flexbox'}>
            <div className={`size-0_5`}>
              <div className={'popup-sub-title'}>{t.order('orderDate')}</div>
              <div className={'popup-sub-reg'}>{date.format('DD MMM YYYY')}</div>
            </div>
            <div>
              <div className={'popup-sub-title'}>{t.order('orderTime')}</div>
              <div className={'popup-sub-reg'}>{date.format('HH:MM')}</div>
            </div>
          </div>
          <div className={'margin-bottom-12 flexbox column'}>
            <div className={'popup-sub-title'}>{t.order('pickUpAddress')}</div>
            <div className={'popup-sub-reg'}>{getAddress()}</div>
            <div
              className={'popup-sub-reg'}
              style={{
                marginTop: '5px',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              {data?.vehicle?.driver?.applicationPhone ? (
                <InputMask
                  style={{ padding: 0, border: 0 }}
                  mask={'+9 (999) 999-99-99'}
                  value={data?.vehicle?.driver?.applicationPhone}
                />
              ) : null}
            </div>
          </div>
          <hr className={'margin-top-5 margin-bottom-5'} />
          <div className={'margin-bottom-12 flexbox column'}>
            <div className={'size-1 flexbox'}>
              <div className={'popup-sub-reg popup-status-info flexbox size-1'}>
                {dictionaries?.transportOrderStatuses?.[data.frontend_status.state]}
              </div>
              <div
                style={{ textAlign: 'right' }}
                className={'popup-status-info-time margin-left-10 size-0_7 justify-right flexbox'}
              >
                {enteredAt}
              </div>
            </div>
            {data.vehicle?.last_api_call_at ? (
              <div className={'size-1'}>
                <div className={'popup-status-last-update'}>
                  Обновлено{' '}
                  {data.vehicle?.last_api_call_at ? moment.unix(data.vehicle?.last_api_call_at).fromNow() : ''}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    };

    const producerOrder = () => {
      return (
        <div>
          <div className={'margin-bottom-12 flexbox'}>
            <div className={'size-1 '}>
              <div
                className={'popup-sub-reg'}
              >{`${data.driver?.name} ${data.driver?.surname} ${data.driver?.patronymic}`}</div>
              <div
                className={'popup-sub-reg'}
                style={{
                  marginTop: '5px',
                  fontWeight: 'bold',
                  fontSize: '17px',
                }}
              >
                {data?.driver?.applicationPhone ? (
                  <InputMask
                    style={{ padding: 0, border: 0 }}
                    mask={'+9 (999) 999-99-99'}
                    value={data?.driver?.applicationPhone}
                  />
                ) : null}
              </div>
              {/*<div*/}
              {/*className={'popup-sub-reg'}>{driver}</div>*/}
            </div>
          </div>
          <hr className={'margin-top-5 margin-bottom-5'} />
          <div className={'margin-bottom-12 flexbox'}>
            <div className={'size-1 '}>
              <p className={'popup-order-number'}>Рейс № {data.id} </p>
              <div className={'flexbox row padding-left-15 padding-right-15'}>
                <div className={'popup-sub-reg popup-status-info margin-right-10'}>
                  {dictionaries?.transportOrderStatuses?.[data.uiState]}
                </div>
                <div className={'popup-status-info-time'}>{moment.unix(data.uiStateEnteredAt).fromNow()}</div>
              </div>
              <div className={'size-1 margin-top-4'}>
                <div className={'popup-status-last-update'}>
                  Обновлено {moment.unix(data?.vehicle?.lastGpsSentAt).fromNow()}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const mainInfo = () => {
      return (
        <Fragment>
          {showVehicleInfo ? (
            <div className={'margin-bottom-12 flexbox'}>
              <div className={'size-1 '}>
                <div className={'popup-sub-title'}>{t.order('vehicleType')}</div>
                <div className={'popup-sub-reg'}>
                  {data.vehicle?.vehicle_type?.name ||
                    dictionaries?.vehicleTypes?.[data.vehicleTypeId] ||
                    data.vehicle_type?.name}
                </div>
              </div>
              <div>
                <div className={'popup-sub-title'}>{t.order('Тип кузова')}</div>
                <div className={'popup-sub-reg'}>
                  {bodyTypes[data?.vehicle?.bodyType || data?.bodyType || data?.body_type || data?.type]}
                </div>
              </div>
            </div>
          ) : null}
          {showLoaderInfo ? (
            <div className={'margin-bottom-12 flexbox'}>
              <div className={'size-1 '}>
                <div className={'popup-sub-reg'}>{`${data.orderedLoadersCount || data.loadersCount} грузч.`}</div>
              </div>
            </div>
          ) : null}
        </Fragment>
      );
    };

    const operatorMainInfo = () => {
      return (
        <Fragment>
          {showVehicleInfo ? (
            <div className={'margin-bottom-12 flexbox'}>
              <div className={'size-1 '}>
                <div className={'popup-sub-title'}>{t.order('vehicleType')}</div>
                <div className={'popup-sub-reg'}>
                  {data.vehicle?.vehicle_type?.name ||
                    dictionaries?.vehicleTypes?.[data.vehicleTypeId] ||
                    data.vehicle_type?.name}
                </div>
              </div>
              {data?.connectedOrder ? (
                <div className={'flexbox center'}>
                  <Icon name={'truckLoaderGrey2'} />
                  <span
                    style={{
                      fontSize: '16px',
                      top: '2px',
                      left: '-5px',
                      position: 'relative',
                    }}
                  >
                    x{data?.connectedOrder?.loaders?.length}
                  </span>
                </div>
              ) : (
                <div>
                  <div className={'popup-sub-title'}>{t.order('Тип кузова')}</div>
                  <div className={'popup-sub-reg'}>
                    {bodyTypes[data?.vehicle?.bodyType || data?.bodyType || data?.body_type || data?.type]}
                  </div>
                </div>
              )}
            </div>
          ) : null}
          {showLoaderInfo ? (
            <div className={'margin-bottom-12 flexbox'}>
              <div className={'size-1 '}>
                <div className={'popup-sub-reg'}>{`${data.loadersCount || data.orderedLoadersCount} грузч.`}</div>
              </div>
            </div>
          ) : null}
        </Fragment>
      );
    };

    let content;
    const plateNumber =
      data?.plate_number || data?.plateNumber || data?.vehicle?.plateNumber || data?.vehicle?.plate_number || '';
    const bodyTypes = dictionaries?.vehicleBodyTypes || dictionaries?.vehicleBodies;
    let title = createTitle(plateNumber);
    let showVehicleInfo = true;
    let showLoaderInfo = false;
    if (APP === 'client') {
      content = clientOrder();

      if (data.type === 2) {
        //content = clientLoaderOrder();
        showVehicleInfo = false;
        showLoaderInfo = true;
      } else {
        content = clientOrder();
      }
    } else if (APP === 'operator') {
      showVehicleInfo = data.type !== 2;
      showLoaderInfo = data.type === 2;
      if (other.popupType === 'transport') {
        title = data.activeOrder ? `Рейс № ${data.activeOrder}` : `${plateNumber} ${data.markAndModel}`;
        content = this.assignTransportOperator(data);
      } else {
        content = this.assignOrderOpearator(data);
      }
    } else {
      showVehicleInfo = data.type !== 2;
      showLoaderInfo = data.type === 2;
      if (other.popupType === 'transport') {
        title = `${plateNumber} ${data.markAndModel}`;
        content = assignOrder();
      } else if (other.popupType === 'execution') {
        content = producerOrder();
      } else if (!data.vehicle) {
        content = assignTransport();
      } else if (data.vehicle && data.driver) {
        content = assignOrder();
      }
    }

    return (
      <div className={`${classNames} vz-map-popup`}>
        <div className="popup-head flexbox align-center" style={{ padding: '0 5px' }}>
          {createIcon()}
          <div className={'flexbox align-left size-1'}>{title}</div>
          <div className={'flexbox align-right'} id={`arrowClick${keyProp}`}>
            <Icon style={{ width: '35px', height: '35px' }} name={'chevronRightOrange'} />
          </div>
        </div>
        <div className={'popup-content'}>
          {APP === 'operator' ? operatorMainInfo() : mainInfo()}
          {content}
        </div>
      </div>
    );
  }
}

MapPopup.defaultProps = {
  type: 'warning',
};

MapPopup.propTypes = {
  type: PropTypes.string,
  history: PropTypes.object,
  keyProp: PropTypes.number,
  onAssignClick: PropTypes.func,
  observer: PropTypes.object,
};

export default MapPopup;
