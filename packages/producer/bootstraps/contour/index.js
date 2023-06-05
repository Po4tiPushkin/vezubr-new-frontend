import { store } from '@vezubr/controls/infrastructure';
import { Utils } from '@vezubr/common/common';
import _concat from 'lodash/concat';

async function BootstrapContour() {
  const user = store.getState().user;

  const routesInput = store.getState().routes;
  const sidebarNavInput = store.getState().sidebarNav;

  const routes = { ...routesInput };
  let sidebarNav = [...sidebarNavInput];

  await store.dispatch({ type: 'SET_ROUTES', routes });
  await store.dispatch({ type: 'SET_SIDEBAR_NAV', sidebarNav });
}

export default BootstrapContour;
