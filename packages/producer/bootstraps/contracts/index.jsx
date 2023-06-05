import { store } from '@vezubr/controls/infrastructure';
import { contractsRoute } from '@vezubr/controls/infrastructure/reducers/defaultStore';
import { Common as CommonService } from '@vezubr/services';

function BootstrapContracts() {
  // Делаем неблокирующую подгрузку для бутстрапа
  (async function () {
    await store.dispatch({ type: 'CONTRACTS_SET_LOADING_DOCS', payload: true });

    // const responseData = await CommonService.getContractList();
    // const documents = responseData.documents || [];

    const routesInput = store.getState().routes;

    // const accessTypes = {};

    // for (const docType of documents) {
    //   accessTypes[docType.type] = true;
    // }

    // const sub = [];

    // for (const subMenu of contractsRoute.sub) {
    //   const splitUrl = subMenu.url.split('/');
    //   const typeIdMenu = parseInt(splitUrl[splitUrl.length - 1], 10);
    //   if (accessTypes[typeIdMenu]) {
    //     sub.push(subMenu);
    //   }
    // }

    const routes = {
      ...routesInput,
      contractsRoute
    };

    // const payload = documents;

    await store.dispatch({ type: 'SET_ROUTES', routes });
    // await store.dispatch({ type: 'CONTRACTS_SET_DOCUMENTS', payload });
    await store.dispatch({ type: 'CONTRACTS_SET_LOADING_DOCS', payload: false });
  })();
}

export default BootstrapContracts;
