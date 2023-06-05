import React from 'react';
import PropTypes from 'prop-types';
import OrderSidebarInfos from '../orderSidebarInfos/orderSidebarInfos';
import { ButtonDeprecated } from '@vezubr/elements';
import { useHistory } from 'react-router-dom';
function getButtonTitle(toProfile) {
  switch (toProfile) {
    case 'driver':
      return 'На страницу водителя';
    case 'transport':
      return 'На страницу ТС';
    case 'client':
      return 'В карточку заказчика';
    case 'producer':
      return 'В карточку подрядчика';
    default:
      return 'На страницу';
  }
}

function PreparatorsSingle({ ...props }) {
  const { data } = props;
  const history = useHistory();
  return (
    <div className={'preparators-single'}>
      <div className={'flexbox'}>
        {data.image ? (
          <div className={'img-wrapper'}>
            <img src={`${window.API_CONFIGS[APP].host}${data.image.replace('/', '')}`} />
          </div>
        ) : null}
        <OrderSidebarInfos className={'left-padding'} data={data.info} />
      </div>
      {data.toProfile && data.id ? (
        <ButtonDeprecated
          className={'semi-wide pull-right'}
          theme={'secondary'}
          onClick={() => {
            history.push(`/profile/${data.toProfile}/${data.id}`)
          }}
        >
          {getButtonTitle(data.toProfile)}
        </ButtonDeprecated>
      ) : 
      data.type && data.id ? 
        <ButtonDeprecated
          className={'semi-wide pull-right'}
          theme={'secondary'}
          onClick={() => {
            history.replace({
              pathname: `/${data.type}/${data.id}`,
              state: {
                back: {
                  pathname: history.location.pathname,
                }
              }
            })
          }}
        >
          {data.title}
        </ButtonDeprecated>
        : null
      }
    </div>
  );
}

PreparatorsSingle.propTypes = {
  data: PropTypes.object.isRequired,
};

export default PreparatorsSingle;
