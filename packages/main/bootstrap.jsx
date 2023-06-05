import { store } from '@vezubr/controls/infrastructure';
import { 
  Common as CommonService, 
  Profile as ProfileService, 
  Contractor as ContractorService, 
  User as UserService,
  Vehicle as VehicleService,
} from '@vezubr/services';
import { LOADERS_SYSTEM_STATE } from '@vezubr/common/constants/constants';
import { Utils } from '@vezubr/common/common';
import _sortBy from "lodash/sortBy";

window.APP_VERSION = APP_VERSION;

class Bootstrap {
  static async run(jwt) {
    // TODO dictionaries & startupData
    const dictionaries = await CommonService.dictionaries();
    try {
      const byEmployees = await ContractorService.byEmployees();
      store.dispatch({ type: 'SET_BY_EMPLOYEES', byEmployees })
    } catch (e) {
      console.error(e)
    }

    const contourVehicleTypes = await VehicleService.contourTypes({ category: null, liftingCapacityMin: null });
    const vehicleTypes = await VehicleService.systemTypes({ category: null, liftingCapacityMin: null });

    dictionaries.vehicleTypes = vehicleTypes
    dictionaries.contourVehicleTypes = contourVehicleTypes

    dictionaries.vehicleTypes = _sortBy(dictionaries.vehicleTypes, (d) => d.orderPosition);
    dictionaries.contourVehicleTypes = _sortBy(dictionaries.contourVehicleTypes, (d) => d.orderPosition);
    
    store.dispatch({ type: 'SET_DICTIONARIES', dictionaries });
    const customTopNav = localStorage.getItem(`topNav${APP}`)?.split(',')
    if (customTopNav) {
      store.dispatch({ type: 'UPDATE_NAV_STATE', topNavState: customTopNav })
    }

    let user = await ProfileService.contractor();
    user.isCostWithVat = user.costWithVat
    user.decoded = Utils.decodeJwt(jwt);
    user = {
      ...user,
      requestGroupIds: (await ProfileService.contractorGetUser(user.decoded.userId)).requestGroupIds
    }
    store.dispatch({ type: 'SET_USER', user: user });

    const userSettingsResponse = await UserService.getInterfaceSettings();
    const settings = userSettingsResponse || {};
    store.dispatch({ type: 'USER_SETTINGS_SET', settings });

    const monitorDates = Utils.getMonitorDates();
    store.dispatch({ type: 'SET_MONITOR_DATES_STATE', payload: monitorDates })

    const customProperties = await ProfileService.getCustomPropsList()
    store.dispatch({ type: 'SET_CUSTOM_PROPERTIES', payload: customProperties });

    document.getElementById('loader').style.display = 'none';

    return true;
  }
}

export default Bootstrap;
