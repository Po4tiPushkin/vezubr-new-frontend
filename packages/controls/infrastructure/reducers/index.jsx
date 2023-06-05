import userReducer from './users';
import userSettingsReducer from './userSettings';
import routesReducer from './routes';
import sidebarReducer from './sidebar';
import topNavReducer from './topNav';
import sidebarNavReducer from './sidebarNav';
import dictionariesReducer from './dictionaries';
import mapReducer from './mapReducer';
import filtersReducer from './filtersStore';
import ordersReducer from './orders';
import monitoringReducer from './monitoring';
import driversReducer from './drivers';
import transportsReducer from './transports';
import invoicesReducer from './invoices';
import balanceReducer from './balance';
import tabNotificationsReducer from './tabNotifications';
import auctionsReducer from './auctions';
import activeTabReducer from './activeTab';
import mapActionReducer from './mapAction';
import contractsReducer from './contracts';
import profileCardBindingReducer from './profileCardBinding';
import contractorReducer from './contractor';
import monitorDatesReducer from './monitorDates';
import currentTabReducer from './currentTab';
import notificationsReducer from './notifications';
import customPropertiesReducer from './customProperties';
const allReducers = {
  user: userReducer,
  userSettings: userSettingsReducer,
  routes: routesReducer,
  sidebarState: sidebarReducer,
  topNav: topNavReducer,
  sidebarNav: sidebarNavReducer,
  dictionaries: dictionariesReducer,
  map: mapReducer,
  filters: filtersReducer,
  orders: ordersReducer,
  monitoring: monitoringReducer,
  drivers: driversReducer,
  invoices: invoicesReducer,
  balance: balanceReducer,
  tabNotifications: tabNotificationsReducer,
  auctions: auctionsReducer,
  activeTab: activeTabReducer,
  transports: transportsReducer,
  mapAction: mapActionReducer,
  contracts: contractsReducer,
  profileCardBinding: profileCardBindingReducer,
  contractor: contractorReducer,
  monitorDates: monitorDatesReducer,
  currentTab: currentTabReducer,
  notifications: notificationsReducer,
  customProperties: customPropertiesReducer,
};

export default allReducers;
