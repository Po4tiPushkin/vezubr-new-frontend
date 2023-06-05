import { store } from '@vezubr/controls/infrastructure';
import { 
  Common as CommonService,
  Profile as ProfileService, 
  User as UserService, 
  Contractor as ContractorService, 
  Vehicle as VehicleService  
} from '@vezubr/services';
import _sortBy from 'lodash/sortBy'
import * as bootstraps from './bootstraps';
import { Utils } from '@vezubr/common/common';

window.APP_VERSION = APP_VERSION;

class Bootstrap {
  static async run(jwt) {
    const dictionaries = await CommonService.dictionaries();
    const contourVehicleTypes = await VehicleService.contourTypes({ category: null, liftingCapacityMin: null });
    const vehicleTypes = await VehicleService.systemTypes({ category: null, liftingCapacityMin: null });

    dictionaries.vehicleTypes = vehicleTypes
    dictionaries.contourVehicleTypes = contourVehicleTypes

    dictionaries.vehicleTypes = _sortBy(dictionaries.vehicleTypes, (d) => d.orderPosition);
    dictionaries.contourVehicleTypes = _sortBy(dictionaries.contourVehicleTypes, (d) => d.orderPosition);
    
    try {
      const byEmployees = await ContractorService.byEmployees();
      store.dispatch({ type: 'SET_BY_EMPLOYEES', byEmployees });
    } catch (e) {
      console.error(e)
    }
    const customTopNav = localStorage.getItem(`topNav${APP}`)?.split(',')
    if (customTopNav) {
      store.dispatch({ type: 'UPDATE_NAV_STATE', topNavState: customTopNav })
    }

    store.dispatch({ type: 'SET_DICTIONARIES', dictionaries });

    let user = await ProfileService.contractor();
    user.isCostWithVat = user.costWithVat
    user.decoded = Utils.decodeJwt(jwt);
    user = {
      ...user,
      requestGroupIds: (await ProfileService.contractorGetUser(user.decoded.userId)).requestGroupIds
    }
    window.IS_ADMIN = user.decoded.employeeRoles.includes(13)
    store.dispatch({ type: 'SET_USER', user: user });

    const userSettingsResponse = await UserService.getInterfaceSettings();
    const settings = userSettingsResponse || {};
    store.dispatch({ type: 'USER_SETTINGS_SET', settings });
    
    const monitorDates = Utils.getMonitorDates();
    store.dispatch({ type: 'SET_MONITOR_DATES_STATE', payload: monitorDates })

    const customProperties = await ProfileService.getCustomPropsList()
    store.dispatch({ type: 'SET_CUSTOM_PROPERTIES', payload: customProperties });

    for (const bootstrapKey of Object.keys(bootstraps)) {
      if (typeof bootstraps[bootstrapKey] === 'function') {
        await bootstraps[bootstrapKey]();
      }
    }
  }
}

export default Bootstrap;
