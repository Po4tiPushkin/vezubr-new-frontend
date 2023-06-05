import { store } from '@vezubr/controls/infrastructure';
import {Common as CommonService, Profile as ProfileService} from '@vezubr/services';
import { LOADERS_SYSTEM_STATE } from '@vezubr/common/constants/constants';
import * as bootstraps from './bootstraps';
import { Utils } from '@vezubr/common/common';

window.APP_VERSION = APP_VERSION;

class Bootstrap {
  static async run(jwt) {
    // TODO dictionaries & startupData

    const oldDictionaries = await CommonService.dictionaries();
    const glossary = await CommonService.glossary();

    const dictionaries = {...oldDictionaries, ...glossary};
    store.dispatch({ type: 'SET_DICTIONARIES', dictionaries });


    const user = await ProfileService.contractor();
    user.isCostWithVat = user.costWithVat
    user.decoded = Utils.decodeJwt(jwt);
    store.dispatch({ type: 'SET_USER', user: user });

    for (const bootstrapKey of Object.keys(bootstraps)) {
      if (typeof bootstraps[bootstrapKey] === 'function') {
        await bootstraps[bootstrapKey]();
      }
    }

    document.getElementById('loader').style.display = 'none';

    return true;
  }
}

export default Bootstrap;
