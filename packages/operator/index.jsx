import { ROUTES } from '@vezubr/controls/infrastructure';
import * as Pages from './pages';
import Bootstrap from './bootstrap';

const OPERATOR_BOOTSTRAP = Bootstrap

const OPERATOR_ROUTES = [
  {
    path: '/contours/add',
    component: Pages.ContourAdd,
  },
  {
    path: '/contours/:id',
    component: Pages.ContourInfo,
  },
  {
    path: '/contours',
    component: Pages.Contours,
  },
  {
    path: '/transports/:id',
    component: Pages.TransportInfo,
  },
  {
    path: '/transports',
    component: Pages.Transports,
  },
  {
    path: `/client${ROUTES.COUNTERPARTY.path}`,
    component: Pages.Counterparty,
    extraProps: ROUTES.COUNTERPARTY
  },
  {
    path: `/producer${ROUTES.COUNTERPARTY.path}`,
    component: Pages.Counterparty,
    extraProps: ROUTES.COUNTERPARTY
  },
  {
    path: '/clients',
    exact: true,
    component: Pages.Clients,
  },
  {
    path: '/producers',
    exact: true,
    component: Pages.Producers,
  },
  {
    component: Pages.DriverInfo,
    extraProps: ROUTES.DRIVER
  },
  {
    path: '/drivers',
    component: Pages.Drivers,
  }
]

export {
  Pages,
  OPERATOR_ROUTES,
  OPERATOR_BOOTSTRAP
};
