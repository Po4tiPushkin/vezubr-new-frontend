import Tabs from '../../../../../tabs';
import React, { useContext } from 'react';
import { createRouteWithParams, ROUTE_PARAMS, ROUTES } from '../../../../../infrastructure';
import { Route, Switch } from 'react-router';
import { OrderHistory } from '@vezubr/components';
import { useSelector } from 'react-redux';
import * as VzMap from '@vezubr/map';
import { OrderView } from '@vezubr/order';
const ROUTE_ORDER_MAP = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'map' });
const ROUTE_ORDER_BARGAIN = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'auctions' });
const ROUTE_ORDER_GENERAL = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'general' });
const ROUTE_ORDER_HISTORY = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'history' });
const ROUTE_ORDER_PERPETRATORS = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'perpetrators' });
const ROUTE_ORDER_CARGOPLACE = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'cargo-place' });
const ROUTE_ORDER_CALCULATION = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'calculations' });
const ROUTE_ORDER_DOCUMENTS = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'documents' });

const ROUTE_ORDER_DOCUMENTS_CLIENT = createRouteWithParams(ROUTES.ORDER, {
  [ROUTE_PARAMS.paramOptions]: 'documents-client',
});
const ROUTE_ORDER_DOCUMENTS_PRODUCER = createRouteWithParams(ROUTES.ORDER, {
  [ROUTE_PARAMS.paramOptions]: 'documents-producer',
});
const ROUTE_ORDER_DOCUMENTS_ORDER = createRouteWithParams(ROUTES.ORDER, {
  [ROUTE_PARAMS.paramOptions]: 'documents-order',
});

const getTabs = (id, search, type) => {
  const props = {
    params: { [ROUTE_PARAMS.paramId]: id },
    linkParams: {
      search,
    },
  };

  return {
    attrs: {
      className: 'order-tabs',
    },
    items: [
      {
        title: 'Карта',
        route: ROUTE_ORDER_MAP,
        id: 'order-map',
        ...props,
        additionalRoutesMatch: [
          {
            route: ROUTES.ORDER,
            ...props,
          },
        ],
      },

      {
        title: 'Рейс',
        id: 'order-general',
        route: ROUTE_ORDER_GENERAL,
        ...props,
      },
      {
        title: 'Торги',
        id: 'order-bargain',
        route: ROUTE_ORDER_BARGAIN,
        ...props,
      },
      {
        title: 'Исполнители',
        id: 'order-perpetrators',
        route: ROUTE_ORDER_PERPETRATORS,
        ...props,
      },

      {
        title: 'Грузоместа',
        id: 'order-cargoplace',
        route: ROUTE_ORDER_CARGOPLACE,
        show: type !== 2,
        ...props,
      },

      {
        title: 'Документы ГВ',
        id: APP === 'dispatcher' ? 'order-documents-order' : 'order-documents-order',
        route: APP === 'dispatcher' ? ROUTE_ORDER_DOCUMENTS_ORDER : ROUTE_ORDER_DOCUMENTS,
        ...props,
      },

      {
        title: 'Расчет заказчика',
        id: APP === 'dispatcher' ? 'order-documents-client' : 'order-calculation',
        route: APP === 'dispatcher' ? ROUTE_ORDER_DOCUMENTS_CLIENT : ROUTE_ORDER_CALCULATION,
        show: APP !== 'client',
        ...props,
      },

      {
        title: 'Расчет подрядчика',
        id: APP === 'dispatcher' ? 'order-documents-producer' : 'order-calculation',
        route: APP === 'dispatcher' ? ROUTE_ORDER_DOCUMENTS_PRODUCER : ROUTE_ORDER_CALCULATION,
        show: APP !== 'producer',
        ...props,
      },

      {
        title: 'История рейса',
        id: 'order-history',
        route: ROUTE_ORDER_HISTORY,
        ...props,
      },
    ],
  };
};

const OrderViewRight = (props) => {
  const { order, cargoPlace, reload, map: mapData, parkingList: parkingsList, employees } = props;
  const dictionaries = useSelector((state) => state.dictionaries);

  const getRoutes = () => {
    return (
      <Switch>
        <Route
          {...ROUTE_ORDER_GENERAL}
          render={(props) => (
            <OrderView.OrderGeneral order={order} cargoPlace={cargoPlace} reload={reload} {...props} />
          )}
        />
        <Route
          {...ROUTE_ORDER_BARGAIN}
          render={(props) => <OrderView.Bargains order={order} reload={reload} {...props} />}
        />
        <Route
          {...ROUTE_ORDER_DOCUMENTS_CLIENT}
          render={(props) => <OrderView.OrderViewTabCalculationClient order={order} reload={reload} {...props} />}
        />
        <Route
          {...ROUTE_ORDER_DOCUMENTS_PRODUCER}
          render={(props) => <OrderView.OrderViewTabCalculationProducer order={order} reload={reload} {...props} />}
        />
        <Route
          {...ROUTE_ORDER_CALCULATION}
          render={(props) => (
            APP === 'client'
              ?
              <OrderView.OrderViewTabCalculationProducer order={order} reload={reload} {...props} />
              :
              <OrderView.OrderViewTabCalculationClient order={order} reload={reload} {...props} />
          )
          }
        />
        <Route
          {...ROUTE_ORDER_DOCUMENTS_ORDER}
          render={(props) => <OrderView.Documents order={order} reload={reload} {...props} />}
        />
        <Route
          {...ROUTE_ORDER_DOCUMENTS}
          render={(props) => <OrderView.Documents order={order} reload={reload} {...props} />}
        />
        <Route
          {...ROUTE_ORDER_HISTORY}
          render={(props) => <OrderHistory dictionaries={dictionaries} order={order} employees={employees} {...props} />}
        />
        <Route {...ROUTE_ORDER_PERPETRATORS} render={(props) => <OrderView.Preparators order={order} {...props} />} />
        {order.type !== 2 ? (
          <Route
            {...ROUTE_ORDER_CARGOPLACE}
            render={(props) => <OrderView.CargoPlaces cargoPlace={cargoPlace} order={order} {...props} />}
          />
        ) : null}
        <Route
          {...ROUTES.ORDER}
          render={(props) => (
            <OrderView.OrderMap VzMap={VzMap} order={order} parkingsList={parkingsList} mapData={mapData} {...props} />
          )}
        />
      </Switch>
    );
  };

  return (
    <div className="flexbox size-0_65 column" style={{ maxWidth: '64%', overflowX: 'auto', position: 'relative' }}>
      <div className={'margin-bottom-12'}>
        {order?.id && <Tabs {...getTabs(order?.id, location.search, order?.type)} />}
      </div>
      {order?.id && getRoutes()}
    </div>
  );
};

export default OrderViewRight;
