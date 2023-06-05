import { store } from '@vezubr/controls/infrastructure';
import { Common as CommonService } from '@vezubr/services';
import { LOADERS_SYSTEM_STATE } from '@vezubr/common/constants/constants';
import { Utils } from '@vezubr/common/common';

window.APP_VERSION = APP_VERSION;

class Bootstrap {
  static async run(jwt) {
    // TODO dictionaries & startupData

    const dictionaries = await CommonService.dictionaries();
    const newDictionaries = await CommonService.glossary();
    const managers = await CommonService.getManagers();

    store.dispatch({ type: 'SET_USER', user: Utils.decodeJwt(jwt) });

    Object.assign(dictionaries.data, { managers: managers.data, loadersSystemState: {} });
    for (const prop of Object.keys(dictionaries.data.employeeSystemStates)) {
      dictionaries.data.loadersSystemState[prop] = LOADERS_SYSTEM_STATE[dictionaries.data.employeeSystemStates[prop]];
    }
    store.dispatch({ type: 'SET_DICTIONARIES', dictionaries: {...dictionaries.data, ...newDictionaries} });

    document.getElementById('loader').style.display = 'none';

    return true;
  }
}

export default Bootstrap;
