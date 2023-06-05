import Tabs from '@vezubr/components/tabs';
import React, { useContext } from 'react';
import { createRouteWithParams, ROUTE_PARAMS, ROUTES } from '@vezubr/common/routing';
import { Route, Switch } from 'react-router';
import {
  OrderViewBargains,
  OrderViewCargoPlace,
  OrderViewDocuments,
  OrderViewGeneral,
  OrderViewExecutors,
  OrderViewHistory,
  OrderViewMap,
  OrderViewCalculationClient,
  OrderViewCalculationProducer
} from '../../tabs';
import OrderViewContext from '../../context';
const ROUTE_ORDER_MAP = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'map' });
const ROUTE_ORDER_BARGAIN = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'auctions' });
const ROUTE_ORDER_GENERAL = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'general' });
const ROUTE_ORDER_HISTORY = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'history' });
const ROUTE_ORDER_EXECUTORS = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'executors' });
const ROUTE_ORDER_CARGOPLACE = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'cargo-place' });
const ROUTE_ORDER_CALCULATION = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'calculations' });
const ROUTE_ORDER_DOCUMENTS = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'documents' });
const ROUTE_ORDER_PERPETRATORS = createRouteWithParams(ROUTES.ORDER, { [ROUTE_PARAMS.paramOptions]: 'perpetrators' });

const ROUTE_ORDER_DOCUMENTS_CLIENT = createRouteWithParams(ROUTES.ORDER, {
  [ROUTE_PARAMS.paramOptions]: 'documents-client',
});
const ROUTE_ORDER_DOCUMENTS_PRODUCER = createRouteWithParams(ROUTES.ORDER, {
  [ROUTE_PARAMS.paramOptions]: 'documents-producer',
});
const ROUTE_ORDER_DOCUMENTS_ORDER = createRouteWithParams(ROUTES.ORDER, {
  [ROUTE_PARAMS.paramOptions]: 'documents-order',
});

const OrderViewRight = (props) => {
  const { order } = useContext(OrderViewContext);

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
          title: 'Заявка',
          id: 'order-general',
          route: ROUTE_ORDER_GENERAL,
          ...props,
          additionalRoutesMatch: [
            {
              route: ROUTES.ORDER,
              ...props,
            },
          ],
        },
        {
          title: 'Карта',
          route: ROUTE_ORDER_MAP,
          id: 'order-map',
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
          id: 'order-executors',
          route: ROUTE_ORDER_EXECUTORS,
          additionalRoutesMatch: [
            {
              route: ROUTE_ORDER_PERPETRATORS,
              ...props,
            },
          ],
          show: order?.orderUiState?.state > 102,
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
          show: order?.orderUiState?.state > 102,
          ...props,
        },

        {
          title: 'Расчет заказчика',
          id: APP === 'dispatcher' ? 'order-documents-client' : 'order-calculation',
          route: APP === 'dispatcher' ? ROUTE_ORDER_DOCUMENTS_CLIENT : ROUTE_ORDER_CALCULATION,
          show: APP !== 'client' && order?.orderUiState?.state > 102,
          ...props,
        },

        {
          title: 'Расчет подрядчика',
          id: APP === 'dispatcher' ? 'order-documents-producer' : 'order-calculation',
          route: APP === 'dispatcher' ? ROUTE_ORDER_DOCUMENTS_PRODUCER : ROUTE_ORDER_CALCULATION,
          show: APP !== 'producer' && order?.orderUiState?.state > 102,
          ...props,
        },

        {
          title: `История ${order?.orderUiState?.state <= 102 ? 'заявки' : 'рейса'}`,
          id: 'order-history',
          route: ROUTE_ORDER_HISTORY,
          ...props,
        },
      ],
    };
  };

  const getRoutes = () => {
    return (
      <Switch>
        <Route
          {...ROUTE_ORDER_BARGAIN}
          render={(props) => <OrderViewBargains />}
        />
        <Route
          {...ROUTE_ORDER_DOCUMENTS_CLIENT}
          render={(props) => <OrderViewCalculationClient />}
        />
        <Route
          {...ROUTE_ORDER_DOCUMENTS_PRODUCER}
          render={(props) => <OrderViewCalculationProducer />}
        />
        <Route
          {...ROUTE_ORDER_CALCULATION}
          render={(props) => (
            APP === 'client'
              ?
              <OrderViewCalculationProducer />
              :
              <OrderViewCalculationClient />
          )
          }
        />
        <Route
          {...ROUTE_ORDER_DOCUMENTS_ORDER}
          render={(props) => <OrderViewDocuments />}
        />
        <Route
          {...ROUTE_ORDER_DOCUMENTS}
          render={(props) => <OrderViewDocuments />}
        />
        <Route
          {...ROUTE_ORDER_HISTORY}
          render={(props) => <OrderViewHistory />}
        />
        <Route {...ROUTE_ORDER_EXECUTORS} render={(props) => <OrderViewExecutors />} />
        <Route {...ROUTE_ORDER_PERPETRATORS} render={(props) => <OrderViewExecutors />} />
        {order.type !== 2 ? (
          <Route
            {...ROUTE_ORDER_CARGOPLACE}
            render={(props) => <OrderViewCargoPlace />}
          />
        ) : null}
        <Route
          {...ROUTE_ORDER_MAP}
          render={(props) => (
            <OrderViewMap />
          )}
        />
        <Route
          {...ROUTE_ORDER_GENERAL}
          render={(props) => (
            <OrderViewGeneral />
          )}
        />
        <Route
          {...ROUTES.ORDER}
          render={(props) => (
            <OrderViewGeneral />
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
