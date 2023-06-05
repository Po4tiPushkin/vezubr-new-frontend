import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, IconDeprecated } from '@vezubr/elements';
import autobind from 'autobind-decorator';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';

const StatusNotification = (props) => {
  const { type, title, description, actions, link, connectedLink, className, style = {}, color, data = {} } = props;

  const renderActions = useMemo(() => {
    if (!actions) {
      return null;
    }
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
  }, [actions])

  const contentRenderer = useMemo(() => {
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
                  title={data['address']}
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
                    title={data['deliverAddress']}

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
                  <InputMask readOnly style={{ padding: 0, border: 0 }} mask={'+9 (999) 999-99-99'} value={data?.driverPhone} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [data])

  const contentTypes = useMemo(() => {
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
      case 'connectedOrder':
        content = contentRenderer;
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
  }, [type, description, contentRenderer]);
  
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
        {contentTypes}
        <div className={'pull-right flexbox justify-right'}>{actions ? renderActions : null}</div>
      </div>
    </div>
  );
}

export default StatusNotification