import { store } from '@vezubr/controls/infrastructure';
import { contractsRoute as contracts } from '@vezubr/controls/infrastructure/reducers/defaultStore';
import { Common as CommonService } from '@vezubr/services';

function BootstrapContracts() {
  // Делаем неблокирующую подгрузку для бутстрапа
  (async function () {
    await store.dispatch({ type: 'CONTRACTS_SET_LOADING_DOCS', payload: true });

    // const responseData = await CommonService.getContractList();
    // const documents =
    //   (responseData.documents && responseData.documents.length > 0 && responseData.documents) ||
    //   contracts.sub.map((subMenu) => {
    //     const splitUrl = subMenu.url.split('/');
    //     const typeIdMenu = parseInt(splitUrl[splitUrl.length - 1], 10);
    //     return {
    //       type: typeIdMenu,
    //       files: [],
    //     };
    //   });

    const routesInput = store.getState().routes;

    const routes = {
      ...routesInput,
      contracts,
    };

    // const payload = documents;

    await store.dispatch({ type: 'SET_ROUTES', routes });
    // await store.dispatch({ type: 'CONTRACTS_SET_DOCUMENTS', payload });
    await store.dispatch({ type: 'CONTRACTS_SET_LOADING_DOCS', payload: false });
  })();
}

export default BootstrapContracts;
