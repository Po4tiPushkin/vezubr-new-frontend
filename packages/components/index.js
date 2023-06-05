import RegisterStep1 from './registrationSteps/step1';
import RegisterStep2 from './registrationSteps/step2';
import RegClientStep3 from './registrationSteps/step3';
import RegProdStep3 from './registrationSteps/step3Producer';
import RegOperatorStep3 from './registrationSteps/step3Operator';
import PasswordStrength from './DEPRECATED/fields/passwordStrength/passwordStrength';
import FileAttachDeprecated from './DEPRECATED/fileAttach/fileAttach';
import OrderSidebarInfos from './orderSidebarInfos/orderSidebarInfos';
import PreparatorsSingle from './preparatorsSingle/preparatorsSingle';
import InputField from './inputField/inputField';
import Profile from './profile/profile';
import ContourLinks from './contour/contourLinks';
import TableActions from './tableActions';
import TabsDeprecated from './DEPRECATED/tabs/tabs';
import ProfileUsersSelectList from './profileUsersSelectList';
import MapDeprecated from './DEPRECATED/map/map';
import Field from './DEPRECATED/monitor/field';
import ProducerField from './DEPRECATED/monitor/producerField';
import OperatorField from './DEPRECATED/monitor/operatorField';
import ModalDeprecated from './DEPRECATED/modal/modal';
import AdditionalFilters from './orders/additionalFilters/additionalFilters';
import SavedFilters from './orders/saved/savedFilters';
import StatusNotification from './statusNotification/statusNotification';
import ResetStep1 from './resetSteps/resetStep1';
import ResetStep2 from './resetSteps/resetStep2';
import FavoriteAddresses from './DEPRECATED/fields/favoriteAddresses/favoriteAddresses';
import CreateEditUser from './DEPRECATED/fields/createEditUsers/createEditUser';
import CreateEditUserProducer from './DEPRECATED/fields/createEditUsersProducer/createEditUser';
import CreateEditUserOperator from './DEPRECATED/fields/createEditUsersOperator/createEditUser';
import ProfileDocUpload from './DEPRECATED/fields/profileDocUpload/profileDocUpload';
import DeferredOrderCard from './orders/deferredOrderCard/index';
import OrdersFiltersSection from './orders/ordersFilterSection/index';
import StatusesModalContent from './statusesModalContent/statusesModalContent';
import setModalError from './DEPRECATED/setModalError';
import DocUpload from './DEPRECATED/fields/docUpload/docUpload';
import AssignDriver from './assign/assignDriver/assignDriver';
import AssignDriverNew from './assign/assignDriverNew';
import SetParking from './setParking/setParking';
import AssignTransportNew from './assign/assignTransportNew';
import AssignTransportToOrder from './assign/assignTransportToOrder';
import AssignLoadersToOrder from './assign/assignLoadersToOrder/assignLoadersToOrder';
import AssignTractor from './assign/assignTractor/assignTractor';
import AssignTrailer from './assign/assignTrailer/assignTrailer';
import AssignAgreementToContract from './assign/assignAgreementToContract';
import Alert from './DEPRECATED/alert';
import Confirm from './confirm';
import GeoZones from './DEPRECATED/fields/geoZones/geoZones';
import TransportReplacement from './assign/transportReplacment/transportReplacement';
import Holding from './holding/holding';
import CheckTable from './DEPRECATED/checkTable/checkTable';
import ContractTypes from './contractTypes/contractTypes';
import DelegateAction from './delegateAction/delegateAction';
import * as VzTableFiltered from './tableFiltered';
import LinkWithBack from './link/linkWithBack';
import LinkGoBackRenderProps from './link/linkGoBackRenderProps';
import AssignTransportToOrderNew from './assign/assignTransportToOrderNew';
import TopNavControl from './topNavControl';
import LoginView from './loginView';
import RegisterView from './registration';
import MonitorDateRange from './monitorDateRange';
import ResponsibleEmployees from './responsibleEmployees';
import StatusesModalContentNew from './statusesModalContentNew';
import StatusNotificationNew from './statusNotificationNew';
import AssignTrailerNew from './assign/assignTrailerNew';
import AssignTractorNew from './assign/assignTractorNew';
import AssignLoadersToOrderNew from './assign/assignLoadersToOrderNew';
import MultiSelect from './multiSelect';
import ForgotPassword from './forgotPassword';
import Rotator from './rotator';
import CustomPropertiesForm from './custom-props-form';
import * as Import from './import';
import CryptoPro from './crypto-pro';
import ContourJoin from './contourJoin';

const RegisterStep3 = APP === 'producer' ? RegProdStep3 : APP === 'operator' ? RegOperatorStep3 : RegClientStep3;

export {
  RegisterStep1,
  RegisterStep2,
  RegisterStep3,
  ResetStep1,
  ResetStep2,
  PasswordStrength,
  OrderSidebarInfos,
  PreparatorsSingle,
  Profile,
  TabsDeprecated,
  Import,
  TableActions,
  FileAttachDeprecated,
  InputField,
  MapDeprecated,
  Field,
  ModalDeprecated,
  AdditionalFilters,
  SavedFilters,
  setModalError,
  StatusNotification,
  FavoriteAddresses,
  CreateEditUser,
  ProfileDocUpload,
  DeferredOrderCard,
  OrdersFiltersSection,
  StatusesModalContent,
  LinkWithBack,
  LinkGoBackRenderProps,
  ProducerField,
  OperatorField,
  DocUpload,
  AssignDriver,
  SetParking,
  AssignAgreementToContract,
  AssignTractor,
  AssignTrailer,
  Alert,
  ContourLinks,
  Confirm,
  GeoZones,
  TransportReplacement,
  AssignTransportToOrder,
  CreateEditUserProducer,
  AssignLoadersToOrder,
  Holding,
  CreateEditUserOperator,
  CheckTable,
  ContractTypes,
  DelegateAction,
  VzTableFiltered,
  AssignTransportToOrderNew,
  TopNavControl,
  LoginView,
  RegisterView,
  MonitorDateRange,
  ResponsibleEmployees,
  StatusesModalContentNew,
  StatusNotificationNew,
  AssignTransportNew,
  AssignDriverNew,
  AssignTrailerNew,
  AssignTractorNew,
  AssignLoadersToOrderNew,
  MultiSelect,
  ForgotPassword,
  Rotator,
  CustomPropertiesForm,
  ProfileUsersSelectList,
  CryptoPro,
  ContourJoin
};
