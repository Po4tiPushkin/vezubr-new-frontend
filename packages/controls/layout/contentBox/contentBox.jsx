import React from 'react';
import PropTypes from 'prop-types';
import { IconDeprecated, ButtonDeprecated } from '@vezubr/elements';
import t from '@vezubr/common/localization';

function ContentBox({
  children,
  className,
  isEmpty = true,
  isBlocked = false,
  sub = false,
  theme,
  history = [],
  user = {},
}) {
  let classNames = (className || '').split(' ');
  classNames.unshift('content-box');
  classNames = classNames.join(' ');
  let icon = '';
  switch (theme) {
    case 'monitor':
      icon = 'emptyMonitor';
      break;
    case 'orders':
      icon = 'ordersOrange';
      break;
    case 'invoices':
      icon = 'billsOrange';
      break;
    case 'acts':
      icon = 'actsOrange';
      break;
    case 'transports':
      icon = 'orderTypeDeliveryOrange';
      break;
    case 'documents':
      icon = 'orderTypeDeliveryOrange';
      break;
    case 'loaders':
      icon = 'orderTypeLoad';
      break;
    case 'drivers':
      icon = 'wheelOrange';
      break;
    case 'trailers':
      icon = 'trailerOrange';
      break;
    case 'tractors':
      icon = 'semiTruckOrange';
      break;
    default:
      icon = 'orderTypeDeliveryOrange';
      break;
  }

  return (
    <div className={classNames}>
      <div className={theme === 'monitor' ? 'full-width' : 'container'}>
        {isBlocked ? (
          <div className={'empty-container'}>
            <h2 className={'margin-top-44 text-center'}>Три простых шага для получения рейсов</h2>
            <p className={'margin-top-12 text-center'}></p>
            <div className={'flexbox'} style={{ width: '500px' }}>
              <div className={'complete-steps'}>
                <div className={user.profileFilled ? 'complete-steps_active' : 'complete-steps_item'}>
                  <IconDeprecated name={'checkBlue'} />
                </div>
                <div className={user.driversAdded ? 'complete-steps_active' : 'complete-steps_item'}>
                  <IconDeprecated name={'checkBlue'} />
                </div>
                <div className={user.vehiclesAdded ? 'complete-steps_active' : 'complete-steps_item'}>
                  <IconDeprecated name={'checkBlue'} />
                </div>
              </div>
              <div className={'complete-steps-items'}>
                <div className={'complete-steps-item bold'}>
                  <div className={'bold'}>Заполните профиль</div>
                  <div className={'descr'}>Заполните обязательные поля для завершения регистрации ООО/ИП</div>
                </div>
                <div className={'complete-steps-item'}>
                  <div className={'bold'}>Добавьте водителей</div>
                  <div className={'descr'}>Для отображения и исполнения рейсов необходимо добавить водителя</div>
                </div>
                <div className={'complete-steps-item'}>
                  <div className={'bold'}>Добавьте транспортные средства</div>
                  <div className={'descr'}>
                    Для отображения и исполнения рейсов необходимо добавить ТС. К добавленному ТС необходимо прикрепить
                    водителя
                  </div>
                </div>
              </div>
              <div className={'complete-steps-items-btns'}>
                <div className={'flexbox complete-steps-item'}>
                  {!user.profileFilled && (
                    <ButtonDeprecated
                      theme={'primary'}
                      onClick={() => {
                        history.push('/profile/main');
                      }}
                    >
                      {'Начать'}
                    </ButtonDeprecated>
                  )}
                </div>
                <div className={'flexbox complete-steps-item'}>
                  {!user.driversAdded && (
                    <ButtonDeprecated
                      theme={'primary'}
                      onClick={() => {
                        history.push('/drivers/create');
                      }}
                    >
                      {'Начать'}
                    </ButtonDeprecated>
                  )}
                </div>
                <div className={'flexbox complete-steps-item'}>
                  {!user.vehiclesAdded && (
                    <ButtonDeprecated
                      theme={'primary'}
                      onClick={() => {
                        history.push('/transports/create');
                      }}
                    >
                      {'Начать'}
                    </ButtonDeprecated>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : isEmpty ? (
          <div className={'empty-container'}>
            <div className={'circle'}>
              <IconDeprecated style={{ width: '88px', height: '88px' }} className={'wide big'} name={icon} />
            </div>
            <h2 className={'margin-top-44'}>{t.nav(theme)}</h2>
            <p className={'margin-top-12 text-center'}>{t.nav(`${theme}${sub ? `-${sub}` : ''}-emptyText`)}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

ContentBox.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.string.isRequired,
  isEmpty: PropTypes.bool,
};

export default ContentBox;
