import NotFound from '@vezubr/controls/pages/notFound';
import Producers from '@vezubr/controls/lists/producers';
import Clients from '@vezubr/controls/lists/clients';
import CargoPlaceList from '@vezubr/controls/lists/cargoPlaces';
import Addresses from '@vezubr/controls/lists/addresses';
import CargoPlaceAdd from '@vezubr/controls/pages/cargo-place/cargo-place-add';
import CargoPlaceView from '@vezubr/controls/pages/cargo-place/cargo-place-view';
import AddressesAdd from '@vezubr/controls/pages/address/create';
import AddressCard from '@vezubr/controls/pages/address/detail';

import DriversList from '@vezubr/controls/lists/drivers';
import DriverCreate from '@vezubr/controls/pages/driver/create';
import DriverEdit from '@vezubr/controls/pages/driver/edit';
import DriverView from '@vezubr/controls/pages/driver/detail';

import Transports from '@vezubr/controls/lists/transports';
import TransportCreate from '@vezubr/controls/pages/transport/create';
import TransportEdit from '@vezubr/controls/pages/transport/edit';
import { TransportProfile as TransportView } from '@vezubr/controls';
import Auctions from '@vezubr/controls/lists/auctions';

import Orders from '@vezubr/controls/lists/orders';
import OrderView from '@vezubr/order/detail';
import OrderAddLoader from '@vezubr/order/form/create/pages/loader/order-add-loader';
import OrderAddIntercity from '@vezubr/order/form/create/pages/cityIntercity/order-add';
import OrderAddCity from '@vezubr/order/form/create/pages/cityIntercity/order-add';
import OrderAddBindLoader from '@vezubr/order/form/create/pages/loader/order-add-transport-related';
import OrderEditIntercity from '@vezubr/order/form/create/pages/cityIntercity/order-edit';
import OrderEditCity from '@vezubr/order/form/create/pages/cityIntercity/order-edit';
import OrderEditLoader from '@vezubr/order/form/create/pages/loader/order-edit-loader';
import OrderAddFromCity from '@vezubr/order/form/create/pages/cityIntercity/order-add-from';
import OrderAddFromIntercity from '@vezubr/order/form/create/pages/cityIntercity/order-add-from';
import OrderAddFromLoader from '@vezubr/order/form/create/pages/loader/order-add-from-loader';
import OrderRepublish from '@vezubr/order/form/create/pages/republish';

import TariffList from '@vezubr/controls/lists/tariffs';
import Profile from '@vezubr/controls/pages/profile';
import TariffAdd from '@vezubr/tariff/view/pages/add';
import TariffInfoEdit from '@vezubr/tariff/view/pages/info-edit';
import TariffClone from '@vezubr/tariff/view/pages/clone';
import TariffCopy from '@vezubr/tariff/view/pages/copy';
import Monitor from '@vezubr/monitor/view';

import AddAgreement from '@vezubr/controls/pages/agreement/create';

import Counterparty from '@vezubr/controls/pages/counterparty';
import Contract from '@vezubr/controls/pages/contract/detail';
import ContractEdit from '@vezubr/controls/pages/contract/edit';
import ContractAdd from '@vezubr/controls/pages/contract/create';
import DeferredOrders from '@vezubr/controls/lists/deferredOrders';

import TractorDetail from '@vezubr/controls/pages/tractor/detail';
import Tractors from '@vezubr/controls/lists/tractors';
import TractorCreate from '@vezubr/controls/pages/tractor/create';
import TractorEdit from '@vezubr/controls/pages/tractor/edit';

import Trailers from '@vezubr/controls/lists/trailers';
import TrailerCreate from '@vezubr/controls/pages/trailer/create';
import TrailerEdit from '@vezubr/controls/pages/trailer/edit';
import { TrailerProfle as Trailer } from '@vezubr/controls/pages/trailer';

import RegistriesProducer from '@vezubr/controls/lists/registries/producer/list';
import RegistriesClient from '@vezubr/controls/lists/registries/client/list';
import RegistriesCreate from '@vezubr/controls/lists/registries/producer/create'
import RegistryClient from '@vezubr/controls/lists/registries/client/detail';
import RegistryProducer from '@vezubr/controls/lists/registries/producer/detail';

import Documents from '@vezubr/controls/lists/documents';

import RegularOrderCreate from '@vezubr/order/form/create/pages/regular/create';
import RegularOrderEdit from '@vezubr/order/form/create/pages/regular/edit';
import RegularOrderList from '@vezubr/controls/lists/regularOrders'

import { Settings } from '@vezubr/controls'

import AgreementCard from '@vezubr/controls/pages/agreement/detail';

import LoadersList from '@vezubr/controls/lists/loaders';
import LoaderProfile from '@vezubr/controls/pages/loader/detail';
import LoaderCreate from '@vezubr/controls/pages/loader/create';
import LoaderEdit from '@vezubr/controls/pages/loader/edit';

import { TemplatePreview } from '@vezubr/controls'
import { Rotator } from '@vezubr/components'

import Insurers from '@vezubr/controls/lists/insurers'
import InsurerCard from '@vezubr/controls/pages/insurer/detail';
import InsurerContractAdd from '@vezubr/controls/pages/insurer/contract/create';
import InsurerContractInfo from '@vezubr/controls/pages/insurer/contract/info';

import DocumentsFlow from '@vezubr/controls/lists/documentsFlow';
import EdmOrder from '@vezubr/controls/pages/edm';

import Requests from '@vezubr/controls/lists/requests/all';
import RequestsAuction from '@vezubr/controls/lists/requests/auction';
import RequestsActive from '@vezubr/controls/lists/requests/active';

import CounterpartyCreateChild from '@vezubr/controls/pages/counterparty/create-child';
import CryptoProTest from '@vezubr/controls/pages/crypto-pro-test';
export {
  Rotator,
  TariffList,
  TariffAdd,
  TariffInfoEdit,
  TariffClone,
  TariffCopy,
  NotFound,
  Producers,
  Clients,
  CargoPlaceList,
  Addresses,
  CargoPlaceAdd,
  CargoPlaceView,
  AddressesAdd,
  AddressCard,
  Orders,
  Profile,
  Settings,
  AddAgreement,
  Counterparty,
  Contract,
  ContractEdit,
  ContractAdd,
  Monitor,
  OrderAddIntercity,
  OrderAddCity,
  OrderAddLoader,
  OrderEditIntercity,
  OrderEditCity,
  OrderEditLoader,
  OrderAddFromCity,
  OrderAddFromIntercity,
  OrderAddFromLoader,
  OrderRepublish,
  OrderView,
  DeferredOrders,
  Tractors,
  TractorCreate,
  TractorEdit,
  Trailers,
  Trailer,
  TrailerCreate,
  TrailerEdit,
  DriversList,
  DriverEdit,
  DriverCreate,
  DriverView,
  Transports,
  TransportView,
  TransportCreate,
  TransportEdit,
  RegistriesProducer,
  RegistriesClient,
  RegistriesCreate,
  RegistryClient,
  RegistryProducer,
  Auctions,
  Documents,
  RegularOrderList,
  RegularOrderCreate,
  RegularOrderEdit,
  AgreementCard,
  TractorDetail,
  LoaderCreate,
  LoadersList,
  LoaderEdit,
  LoaderProfile,
  TemplatePreview,
  Insurers,
  InsurerCard,
  InsurerContractAdd,
  InsurerContractInfo,
  DocumentsFlow,
  EdmOrder,
  Requests,
  OrderAddBindLoader,
  RequestsAuction,
  RequestsActive,
  CounterpartyCreateChild,
  CryptoProTest
};
