import React, { Component } from 'react';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, IconDeprecated } from '@vezubr/elements';
import autobind from 'autobind-decorator';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';

/**
 * Status notification creation example
 * Alert Notification
 * {<StatusNotification
 * 				type={'info'}
				action={{
					title: t.buttons('setAction'),
					method: () => {
					}
				}}
				title={'Необходимо принять решение'} color={'red'} description={'Необходимо принять решение'}/>}
 order details Notification
 //TODO need to add buttons parameters (color, action, size)
 {<StatusNotification color={'blue'}
 								type={'order'}
								 actions={{
									 action1: () => {
									 },
									 action2: () => {
									 },
									 action3: () => {
									 }
								 }}
								 data={{value: '12 АПР 2018, 18:30', value1: '12 АПР 2018, 18:30'}}
								 title={<p className={'small-title title-bold status-title no-margin'}>Рейс № 000312 от
									 15 июля 2017г</p>}/>}

 connected order notification
 {<StatusNotification
				type={'connectedOrder'}
				actions={[
					{
						title: 'Title',
						method: () => {}
					}
				]}
				title={'Необходимо принять решение'} color={'orange2'} description={'Необходимо принять решение'}/>}

 cancelled order notification
 {<StatusNotification
				type={'cancelled'}
				title={<p className={'small-title title-bold status-title no-margin title-grey'} style={{padding: 26}}>Связаный Рейс № 000313 отменен</p>}
				color={'grey'}
			/>}
 */

/**
 * @types
 * [info, order,connectedOrder,canceled]
 */
class StatusNotification extends Component {
  @autobind
  switchTypes() {
    const { type, description, action } = this.props;
    let content = null;
    switch (type) {
      case 'info':
        content = (
          <div className={'text-big status-description no-margin flexbox'}>
            <span className={'size-1'}>{description}</span>
          </div>
        );
        break;
      case 'order':
        content = this.renderDataTable();
        break;
      case 'connectedOrder':
        content = this.renderConnectedTable();
        break;
      case 'default':
        content = (
          <div className={'text-big status-description no-margin flexbox'}>
            <span className={'size-1'}>{description}</span>
          </div>
        );
        break;
      case 'dropdown':
        content = (
          <div className={'text-big status-description no-margin flexbox'}>
            <span className={'size-1'}>{description}</span>
          </div>
        );
        break;
      default:
        content = null;
        break;
    }
    return content;
  }

  renderActions(actions) {
    const margin = actions.length >= 2 ? 'margin-top-4' : '';
    return (
      <div>
        {actions.map((action, key) => {
          const { theme = 'primary', title, method, icon, className } = action;
          return (
            <ButtonDeprecated
              key={key}
              icon={icon}
              className={`margin-right-16 margin-bottom-16 ${margin} ${className}`}
              theme={theme}
              onClick={method}
            >
              {title}
            </ButtonDeprecated>
          );
        })}
      </div>
    );
  }

  @autobind
  renderDataTable() {
    const { data } = this.props;
    return this.contentRenderer(data);
  }

  contentRenderer(data) {
    return (
      <div className={'full-width'}>
        <div className={'flexbox status-order full-width'}>
          <div className="flexbox status-order-section full-width">
            <div className="flexbox column full-width">
              <div className={'status-order-section-element text-big'}>
                <span>{t.order('orderAndDeliverDate')}</span>
              </div>
              <div className={'status-order-section-element text-big'}>
                <span>{t.order('pickUpAddress')}</span>
              </div>
              {data.type !== 2 ? (
                <div className={'status-order-section-element text-big'}>
                  <span>{t.order('deliverAddress')}</span>
                </div>
              ) : null}
              <div className={'status-order-section-element text-big'}>
                <span>{data.type === 2 ? t.order('Тип рейса') : t.order('vehicleType')}</span>
              </div>
            </div>
            <div className="flexbox column full-width  margin-left-10">
              <div className={'status-order-section-element text-big'}>
                <span className={'title-bold'}>{data['startAt']}</span>
              </div>
              <div className={'status-order-section-element text-big'}>
                <span
                  className={'title-bold'}
                  style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: '268px',
                    display: 'block',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {data['address']}
                </span>
              </div>
              {data.type !== 2 ? (
                <div className={'status-order-section-element text-big'}>
                  <span
                    className={'title-bold'}
                    style={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      maxWidth: '268px',
                      display: 'block',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {data['deliverAddress']}
                  </span>
                </div>
              ) : null}
              <div className={'status-order-section-element text-big'}>
                <span className={'title-bold'}>{data.type === 2 ? 'Специалисты' : data['vehicleType']}</span>
              </div>
            </div>
          </div>
          <div className="flexbox status-order-section full-width">
            <div className="flexbox column full-width">
              {data.type !== 2 ? (
                <div className={'status-order-section-element text-big'}>
                  <span>{t.order('vehicleNumbers')}</span>
                </div>
              ) : null}
              <div className={'status-order-section-element text-big'}>
                <span>{t.order('contractor')}</span>
              </div>
              <div className={'status-order-section-element text-big'}>
                <span>{t.order(data.type === 2 ? 'Бригадир' : 'driver')}</span>
              </div>
              <div className={'status-order-section-element text-big'}>
                <span>{t.order(data.type === 2 ? 'Телефон бригадира' : 'driverTel')}</span>
              </div>
            </div>
            <div className="flexbox column full-width margin-left-10">
              {data.type !== 2 ? (
                <div className={'status-order-section-element text-big'}>
                  <span className={'title-bold'}>{data['plateNumber']}</span>
                </div>
              ) : null}
              <div className={'status-order-section-element text-big'}>
                <span className={'title-bold'}>{data['producer']}</span>
              </div>
              <div className={'status-order-section-element text-big'}>
                <span className={'title-bold'}>{data['driverName']}</span>
              </div>
              <div className={'status-order-section-element text-big'}>
                <span className={'title-bold'}>
                  <InputMask style={{ padding: 0, border: 0 }} mask={'+9 (999) 999-99-99'} value={data?.driverPhone} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  renderConnectedTable() {
    const { actions, data } = this.props;
    return this.contentRenderer(data, actions);
  }

  render() {
    const { actions, title, color, type, link, connectedLink, className, style = {} } = this.props;
    const content = this.switchTypes();
    return (
      <div
        style={style}
        className={
          `flexbox column white-container margin-bottom-12 status-notification status-color ${color} ` +
          (className ? className : '')
        }
      >
        <div className="flexbox space-between align-center">
          {typeof title === 'string' ? (
            <p className={'small-title title-bold status-title no-margin'}>{title}</p>
          ) : (
            title
          )}
          {['order', 'connectedOrder'].some((t) => t === type) ? (
            <Link to={type === 'connectedOrder' ? connectedLink : link || '/'}>
              <IconDeprecated name={'chevronRightOrange'} />
            </Link>
          ) : null}
        </div>
        {type !== 'cancelled' ? <hr /> : null}
        <div className="flexbox space-between column">
          {content}
          <div className={'pull-right flexbox justify-right'}>{actions ? this.renderActions(actions) : null}</div>
        </div>
      </div>
    );
  }
}

StatusNotification.propTypes = {
  title: PropTypes.any,
  description: PropTypes.any,
  type: PropTypes.string.isRequired,
  action: PropTypes.any,
  actions: PropTypes.array,
  data: PropTypes.object,
};

export default StatusNotification;
