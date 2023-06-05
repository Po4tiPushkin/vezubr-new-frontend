// import UserClient from './api/client/users';
// import UserProducer from './api/producer/users';
import UserOperator from './api/operator/users';
// import UserDispatcher from './api/dispatcher/users';
// import UserEnter from './api/enter/users';

// import OrdersClient from './api/client/orders';
// import OrdersProducer from './api/producer/orders';
import OrdersOperator from './api/operator/orders';
// import OrdersDispatcher from './api/dispatcher/orders';

// import CommonClient from './api/client/common';
// import CommonProducer from './api/producer/common';
import CommonOperator from './api/operator/common';
// import CommonDispatcher from './api/dispatcher/common';
// import CommonEnter from './api/enter/common';

// import ProfileClient from './api/client/profile';
// import ProfileProducer from './api/producer/profile';
import ProfileOperator from './api/operator/profile';
// import ProfileDispatcher from './api/dispatcher/profile';
// import ProfileEnter from './api/enter/profile';

import RegistriesOperator from './api/operator/registries';
// import RegistriesProducer from './api/producer/registries';
// import RegistriesDispatcher from './api/dispatcher/registries';

import AgentOperator from './api/operator/agent';

// import InvoicesClient from './api/client/bills';
// import InvoicesDispatcher from './api/dispatcher/invoices';
// import GeoCoding from './api/client/geoCoding';
// import DaData from './api/client/dadata';

// import DriversProducer from './api/producer/drivers';
import DriversOperator from './api/operator/drivers';
// import DriversDispatcher from './api/dispatcher/drivers';
// import DriversClient from './api/client/drivers';

// import DocumentsProducer from './api/producer/documents';
// import DocumentsClient from './api/client/documents';
// import DocumentsDispatcher from './api/dispatcher/documents';

// import VehicleProducer from './api/producer/vehicle';
import VehicleOperator from './api/operator/vehicle';
// import VehicleClient from './api/client/vehicle';
// import VehicleDispatcher from './api/dispatcher/vehicle';
// import TariffClient from './api/client/tariff';
// import TariffProducer from './api/producer/tariff';
import TariffOperator from './api/operator/tariff';
// import TariffDispatcher from './api/dispatcher/tariff';

// import CargoPlaceClient from './api/client/cargoPlace';
// import CargoPlaceProducer from './api/producer/cargoPlace';
// import CargoPlaceDispatcher from './api/dispatcher/cargoPlace';

// import BargainsClient from './api/client/bargains';
// import BargainsProducer from './api/producer/bargains';
// import BargainsDispatcher from './api/dispatcher/bargains';

// import TractorProducer from './api/producer/tractor';
// import TractorDispatcher from './api/dispatcher/tractor';

// import TrailerProducer from './api/producer/trailer';
// import TrailerDispatcher from './api/dispatcher/trailer';
// import Cartulary from './api/producer/cartulary';

// import ContractsClient from './api/client/сontracts';
// import ContractsProducer from './api/producer/contracts';
// import ContractsDispatcher from './api/dispatcher/contracts';

// import AddressClient from './api/client/address';
// import AddressProducer from './api/producer/address';
// import AddressDispatcher from './api/dispatcher/address';

// import LoadersProducer from './api/producer/loaders'

// import RegisterDispatcher from './api/dispatcher/register';
import RegisterOperator from './api/operator/register';
// import RegisterEnter from './api/enter/register';
// import RegisterProducer from './api/producer/register';
// import RegisterClient from './api/client/register';

// import ContractorDispatcher from './api/dispatcher/contractor';
// import ContractorClient from './api/client/contractor';
// import ContractorProducer from './api/producer/contractor';

// import OrganizationClient from './api/client/organization';
// import OrganizationProducer from './api/producer/organization';
// import OrganizationDispatcher from './api/dispatcher/organization';
// import OrganizationEnter from './api/enter/organization';

// import OffersClient from './api/client/offers';
// import ProducersClient from './api/client/producers'

// import LoadersClient from './api/client/loaders';

import UserLk from './api/lk/users';
import OrdersLk from './api/lk/orders';
import DocumentsLk from './api/lk/documents';
import CommonLk from './api/lk/common';
import ProfileLk from './api/lk/profile';
import VehicleLk from './api/lk/vehicle';
import RegistriesLk from './api/lk/registries';
import DriversLk from './api/lk/drivers';
import TariffLk from './api/lk/tariff';
import LoadersLk from './api/lk/loaders';
import BargainsLk from './api/lk/bargains';
import ContractsLk from './api/lk/contracts';
import CargoPlaceLk from './api/lk/cargoPlace';
import AddressLk from './api/lk/address';
import RegisterLk from './api/lk/register';
import ContractorLk from './api/lk/contractor';
import OrganizationLk from './api/lk/organization';
import TractorLk from './api/lk/tractor';
import TrailerLk from './api/lk/trailer';
import InvoicesLk from './api/lk/invoices';
import ProducersLk from './api/lk/producers';
import OffersLk from './api/lk/offers';
import CartularyLk from './api/lk/cartulary';
import GeoCodingLk from './api/lk/geoCoding';
import UnitLk from './api/lk/unit';
import InsurersLk from './api/lk/insurers';
import EmployeesLk from './api/lk/employees';
import CancellationReasonLk from './api/lk/cancellation-reason';
import RequestsLk from './api/lk/requests';
const modules = {
  UserLk,
  UserOperator,
  OrdersLk,
  OrdersOperator,
  DocumentsLk,
  CommonLk,
  CommonOperator,
  ProfileLk,
  ProfileOperator,
  VehicleLk,
  VehicleOperator,
  RegistriesOperator,
  RegistriesLk,
  AgentOperator,
  DriversLk,
  DriversOperator,
  TariffLk,
  TariffOperator,
  BargainsLk,
  LoadersLk,
  ContractsLk,
  CargoPlaceLk,
  AddressLk,
  RegisterOperator,
  RegisterLk,
  ContractorLk,
  OrganizationLk,
  TractorLk,
  TrailerLk,
  InvoicesLk,
  OffersLk,
  ProducersLk,
  CartularyLk,
  GeoCodingLk,
  UnitLk,
  InsurersLk,
  EmployeesLk,
  CancellationReasonLk,
  RequestsLk,
  app: APP.charAt(0).toUpperCase() + APP.slice(1),
  get: function (module) {
    if (this.app === 'Operator') {
      return this[module + this.app];
    }
    else {
      return this[module + 'Lk']
    }
  },
};

const User = modules.get('User');
const Common = modules.get('Common');
const Profile = modules.get('Profile');
const Orders = modules.get('Orders');
const Documents = modules.get('Documents');
const Bargains = modules.get('Bargains');
const Vehicle = modules.get('Vehicle');
const Registries = modules.get('Registries');
const Agent = modules.get('Agent');
const Drivers = modules.get('Drivers');
const Tariff = modules.get('Tariff');
const Contracts = modules.get('Contracts');
const CargoPlace = modules.get('CargoPlace');
const Address = modules.get('Address');
const Register = modules.get('Register');
const Contractor = modules.get('Contractor');
const Organization = modules.get('Organization');
const Tractor = modules.get('Tractor');
const Trailer = modules.get('Trailer');
const Invoices = modules.get('Invoices');
const Offers = modules.get('Offers');
const Producers = modules.get('Producers');
const Loaders = modules.get('Loaders');
const Cartulary = modules.get('Cartulary');
const GeoCoding = modules.get('GeoCoding');
const Unit = modules.get('Unit');
const Insurers = modules.get('Insurers');
const Employees = modules.get('Employees');
const CancellationReason = modules.get('CancellationReason');
const Requests = modules.get('Requests');

export {
  User,
  Orders,
  Bargains,
  Common,
  Profile,
  GeoCoding,
  Invoices,
  Drivers,
  Vehicle,
  Tractor,
  Registries,
  Documents,
  Trailer,
  Loaders,
  Cartulary,
  Agent,
  Tariff,
  Contracts,
  CargoPlace,
  Address,
  Register,
  Contractor,
  Organization,
  Offers,
  Producers,
  Unit,
  Insurers,
  Employees,
  CancellationReason,
  Requests
};
