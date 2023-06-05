import t from '../localization';

const TABLE_HEADERS = {
  orders: [
    {
      name: t.order('table.number'),
      key: 'order_id',
      sortable: true,
    },
    {
      name: t.order('table.type'),
      key: 'order_type',
      sortable: true,
    },
    {
      name: t.order('table.connectedNumber'),
      sortable: true,
    },
    {
      name: t.order('table.status'),
      key: 'frontend_client_status',
      sortable: true,
    },
    {
      name: t.order('table.k'),
      sortable: true,
    },
    {
      name: t.order('table.data_time'),
      key: 'to_start_at',
      sortable: true,
    },
    {
      name: t.order('table.transportType'),
      key: 'vehicle_type_id',
      sortable: true,
    },
    {
      name: t.order('table.plateNumber'),
      key: 'plate_number',
      sortable: false,
    },
    {
      name: t.order('table.producer'),
      key: 'producer_name',
      sortable: false,
    },
    {
      name: t.order('table.executor'),
      key: 'executor_surname',
      sortable: false,
    },
    {
      name: t.order('table.firstAddress'),
      key: 'first_address',
      sortable: true,
    },
    {
      name: t.order('table.lastAddress'),
      key: 'last_address',
      sortable: true,
    },
  ],
  invoices: [
    {
      name: t.bills('table.billNumber').toUpperCase(),
      key: 'id',
      sortable: true,
    },
    {
      name: t.bills('table.billData').toUpperCase(),
      key: '1c_id',
      sortable: true,
    },
    {
      name: t.bills('table.status').toUpperCase(),
      key: 'payment_state',
      sortable: true,
    },
    {
      name: t.bills('table.sumWithoutTax').toUpperCase(),
      key: 'sum_in_coins',
      sortable: true,
    },
    {
      name: t.bills('table.ordersCount').toUpperCase(),
      key: 'orders_count',
      sortable: true,
    },
    {
      name: t.bills('table.originalsSent').toUpperCase(),
      key: 'originals_sent_date',
      sortable: true,
    },
    {
      name: t.bills('table.originalsReceived').toUpperCase(),
      key: 'original_received_date',
      sortable: true,
    },
    {
      name: t.bills('table.paymentFor').toUpperCase(),
      key: 'payment_deadline_date',
      sortable: true,
    },
    {
      name: t.bills('table.payed').toUpperCase(),
      key: 'payed_at',
      sortable: true,
    },
    {
      name: t.bills('table.contractor').toUpperCase(),
      key: 'producer_id',
      sortable: true,
    },
  ],
  invoiceDetails: [
    {
      name: t.bills('table.orderNumber').toUpperCase(),
      key: 'order_id',
      sortable: true,
    },
    {
      name: t.bills('table.type'),
      key: 'order_type',
      sortable: true,
    },
    {
      name: t.bills('table.orderDate'),
      key: 'to_start_at',
      sortable: true,
    },
    {
      name: t.bills('table.vehicleType'),
      key: 'vehicle_type_id',
      sortable: true,
    },
    {
      name: t.bills('table.sumWithoutTax'),
      key: 'cost',
      sortable: true,
    },
    {
      name: t.bills('table.accepted'),
      key: 'calculation_accepted_by_client_at',
      sortable: true,
    },
    {
      name: t.bills('table.producerName'),
      key: 'producer_name',
      sortable: true,
    },
    {
      name: t.bills('table.firstAddr'),
      key: 'first_address',
      sortable: true,
    },
    {
      name: t.bills('table.lastAddr'),
      key: 'last_address',
      sortable: true,
    },
  ],
  orderStatuses: [
    {
      name: t.settings('table.inStatus').toUpperCase(),
      key: 'in_status',
    },
    {
      name: t.settings('table.showInMonitor').toUpperCase(),
      key: 'showInMonitor',
    },
    {
      name: t.settings('table.notifyByEmail').toUpperCase(),
      key: 'showInMonitor',
    },
    {
      name: t.settings('table.notifyBySms').toUpperCase(),
      key: 'showInMonitor',
    },
  ],
  invoiceStatuses: [
    {
      name: t.settings('table.inStatus').toUpperCase(),
      key: 'in_status',
    },
    {
      name: t.settings('table.pushMessages').toUpperCase(),
      key: 'showInMonitor',
    },
    {
      name: t.settings('table.notifyByEmail').toUpperCase(),
      key: 'showInMonitor',
    },
    {
      name: t.settings('table.notifyBySms').toUpperCase(),
      key: 'showInMonitor',
    },
  ],
  deferred: [
    {
      name: t.order('table.number'),
      key: 'order_id',
      sortable: true,
    },
    {
      name: t.order('table.type'),
      key: 'order_type',
      sortable: true,
    },
    {
      name: t.order('table.data_time'),
      key: 'to_start_at',
      sortable: true,
    },
    {
      name: t.order('table.transportType'),
      key: 'vehicle_type_id',
      sortable: true,
    },
    {
      name: t.order('table.firstAddress'),
      key: 'first_address',
      sortable: true,
    },
    {
      name: t.order('table.lastAddress'),
      key: 'last_address',
      sortable: true,
    },
  ],
  sectionPreview: [
    {
      name: t.settings('table.pageName'),
      key: 'name',
    },
    {
      name: t.settings('table.topPanel'),
      key: 'name',
    },
    {
      name: t.settings('table.defaultTab'),
      key: 'name',
    },
    {
      name: t.settings('table.predefinedFilters'),
      key: 'name',
    },
  ],
  auctions: [
    {
      name: t.order('table.number'),
      key: 'order_id',
      sortable: true,
    },
    {
      name: t.order('table.type'),
      key: 'order_type',
      sortable: true,
    },
    {
      name: t.order('table.connectedNumber'),
      sortable: true,
    },
    {
      name: t.order('table.status'),
      key: 'frontend_client_status',
      sortable: true,
    },
    {
      name: t.order('table.k'),
      sortable: true,
    },
    {
      name: t.order('table.data_time'),
      key: 'to_start_at',
      sortable: true,
    },
    {
      name: t.order('table.transportType'),
      key: 'vehicle_type_id',
      sortable: true,
    },
    {
      name: t.order('table.deliverAddr'),
      key: 'first_address',
      sortable: true,
    },
    {
      name: t.order('table.deliveredAddr'),
      key: 'last_address',
      sortable: true,
    },
  ],
  producerOrders: [
    {
      name: t.order('table.number'),
      key: 'orderId',
      sortable: true,
    },
    {
      name: t.order('table.type'),
      key: 'orderType',
      sortable: true,
    },
    {
      name: t.order('table.status'),
      key: 'orderUiState',
      sortable: true,
    },
    {
      name: t.order('table.customer'),
      key: 'clientName',
      sortable: true,
    },
    {
      name: t.order('table.data_time'),
      key: 'toStartAtDate',
      sortable: true,
    },
    {
      name: t.order('table.transportType'),
      key: 'vehicleTypeId',
      sortable: true,
      type: 'pp',
    },
    {
      name: t.order('table.loadersCount'),
      key: 'loadersCount',
      sortable: true,
      type: 'pprr',
    },
    {
      name: t.order('table.finishedAtDate'),
      key: 'finishedAtDate',
      sortable: true,
    },
    {
      name: t.order('table.calculationAcceptedAtDate'),
      key: 'calculationAcceptedAtDate',
      sortable: true,
    },
    {
      name: t.order('table.totalSumInCents'),
      key: 'totalSumInCents',
      sortable: true,
    },
    {
      name: t.order('table.actNo'),
      key: 'actNo',
      sortable: true,
    },
    {
      name: t.order('table.executor'),
      key: 'employeeSurname',
      sortable: true,
    },
    {
      name: t.order('table.plateNumber'),
      key: 'vehiclePlateNumber',
      sortable: true,
      type: 'pp',
    },
    {
      name: t.order('table.brigadierSurname'),
      key: 'brigadierSurname',
      sortable: true,
      type: 'pprr',
    },
    {
      name: t.order('table.firstAddress'),
      key: 'firstAddress',
      sortable: true,
    },
    {
      name: t.order('table.lastAddress'),
      key: 'lastAddress',
      sortable: true,
    },
    {
      name: t.order('table.routePointsCount'),
      key: 'routePointsCount',
      sortable: true,
    },
    {
      name: t.order('table.orderProducerCustomIdentifier'),
      key: 'orderProducerCustomIdentifier',
      sortable: true,
    },
    {
      name: t.order('table.renterName'),
      key: 'renterName',
      sortable: true,
      type: 'pp',
    },
  ],
  operatorOrders: [
    {
      name: t.order('table.number'),
      key: 'order_id',
      sortable: true,
    },
    {
      name: t.order('table.type'),
      key: 'orderType',
      sortable: true,
    },
    {
      name: t.order('table.status'),
      key: 'orderUiState',
      sortable: true,
    },
    {
      name: t.order('table.clientCompany'),
      key: 'clientName',
      sortable: true,
    },
    {
      name: t.order('table.producerCompany'),
      key: 'producerCompany',
      sortable: true,
    },
    {
      name: t.order('table.data_time'),
      key: 'toStartAtDate',
      sortable: true,
    },
    {
      name: t.order('table.transportType'),
      key: 'vehicleType',
      sortable: true,
    },
    {
      name: t.order('table.producerEmployeeName'),
      key: 'producerEmployeeName',
      sortable: true,
    },

    {
      name: t.order('table.originalsAcceptedAt'),
      key: 'originalsAcceptedAt',
      sortable: true,
    },

    {
      name: t.order('table.plateNumber'),
      key: 'plateNumber',
      sortable: true,
    },
    {
      name: t.order('predCost'),
      key: 'preliminaryTotalSumInCents',
      sortable: true,
    },
    {
      name: t.order('Факт. стоим.'),
      key: 'orderSum',
      sortable: true,
    },
    {
      name: t.order('table.orderSum'),
      key: 'hourlyTotalSumInCents',
      sortable: true,
    },
    {
      name: t.order('table.firstAddress'),
      key: 'firstAddress',
      sortable: true,
    },
    {
      name: t.order('table.lastAddress'),
      key: 'lastAddress',
      sortable: true,
    },
    {
      name: t.order('table.actNo'),
      key: 'actNo',
      sortable: true,
    },
    {
      name: t.order('table.totalSumInCents2'),
      key: 'totalSumInCents',
    },
    {
      name: t.order('table.operatorEmployeeName'),
      key: 'operatorEmployeeName',
      sortable: true,
    },
    {
      name: t.order('table.orderProducerCustomIdentifier'),
      key: 'orderProducerCustomIdentifier',
      sortable: true,
    },
  ],
  operatorNotificationOrders: [
    {
      name: t.order('table.number'),
      key: 'order_id',
    },
    {
      name: t.order('table.type'),
      key: 'orderType',
    },
    {
      name: t.order('table.data_time'),
      key: 'toStartAtDate',
    },
    {
      name: t.order('table.transportType'),
      key: 'vehicleType',
    },
    {
      name: t.order('predCost'),
      key: 'preliminaryTotalSumInCents',
    },
    {
      name: t.order('table.lastAddress'),
      key: 'lastAddress',
    },
    {
      name: 'Нотификация',
      key: 'orderId',
    },
  ],
  transports: [
    {
      name: 'ID',
      key: 'id',
      sortable: true,
    },
    {
      name: t.transports('table.type'),
      key: 'vehicleTypeTitle',
      sortable: true,
    },
    {
      name: t.transports('table.bodyType'),
      key: 'bodyTypeTitle',
      sortable: true,
    },
    {
      name: t.transports('table.classification'),
      key: 'vehicleConstructionTypeTitle',
      sortable: true,
    },
    {
      name: t.transports('table.markAndModel'),
      key: 'markAndModel',
      sortable: true,
    },
    {
      name: t.transports('table.plateNumber'),
      key: 'plateNumber',
      sortable: true,
    },
    {
      name: t.transports('table.driversCount'),
      key: 'linkedDriversCount',
      sortable: true,
    },
    {
      name: t.transports('table.executed'),
      key: 'finishedOrdersCount',
      sortable: true,
    },
    {
      name: t.transports('table.crashCount'),
      key: 'crashCount',
      sortable: true,
    },
    {
      name: t.transports('table.onLine'),
      key: 'isOnline',
      sortable: true,
    },
    {
      name: t.transports('table.jobStarted'),
      key: 'exploitationStartDate',
      sortable: true,
    },
    {
      name: t.transports('table.jobEnded'),
      key: 'exploitationEndDate',
      sortable: true,
    },
    {
      name: t.transports('table.liftingCapacityInKg'),
      key: 'liftingCapacityInKg',
      sortable: true,
    },
    {
      name: t.transports('table.palletsCapacity'),
      key: 'palletsCapacity',
      sortable: true,
    },
    {
      name: t.transports('table.volume'),
      key: 'volume',
      sortable: true,
    },
    {
      name: t.transports('table.uiStatus'),
      key: 'uiStatus',
      sortable: true,
    },
  ],
  drivers: [
    {
      name: t.driver('table.id'),
      key: 'id',
      sortable: true,
    },
    {
      name: t.driver('table.lastName'),
      key: 'surname',
      sortable: true,
    },
    {
      name: t.driver('table.name'),
      key: 'name',
      sortable: true,
    },
    {
      name: t.driver('table.patronymic'),
      key: 'patronymic',
      sortable: true,
    },
    {
      name: t.driver('table.applicationPhone'),
      key: 'applicationPhone',
      sortable: true,
    },
    {
      name: t.driver('table.contactPhone'),
      key: 'contactPhone',
      sortable: true,
    },
    {
      name: t.driver('table.driverLicenseNumber'),
      key: 'driverLicenseNumber',
      sortable: true,
    },
    {
      name: t.driver('table.ratingByClients'),
      key: 'ratingByClients',
      sortable: true,
    },
    {
      name: t.driver('table.vehicleCount'),
      key: 'vehiclesCount',
      sortable: true,
    },
    {
      name: t.driver('table.lastOrderDate'),
      key: 'lastOrderDate',
      sortable: true,
    },
    {
      name: t.driver('table.closedOrdersCount'),
      key: 'closedOrdersCount',
      sortable: true,
    },
    {
      name: t.driver('table.problemOrdersCount'),
      key: 'problemOrdersCount',
      sortable: true,
    },
    {
      name: t.driver('table.neverDelegate'),
      key: 'neverDelegate',
      sortable: true,
    },
    {
      name: t.driver('table.uiStatus'),
      key: 'uiStatus',
      sortable: true,
    },
  ],
  tractors: [
    {
      key: 'id',
      name: t.tractors('table.id'),
      sortable: true,
    },
    {
      key: 'markAndModel',
      name: t.tractors('table.markAndModel'),
      sortable: true,
    },
    {
      key: 'plateNumber',
      name: t.tractors('table.plateNumber'),
      sortable: true,
    },
    {
      key: 'orderCount',
      name: t.tractors('table.finishedOrdersCount'),
      sortable: true,
    },
    {
      key: 'crashesCount',
      name: t.tractors('table.crashCount'),
      sortable: true,
    },
    {
      key: 'driverCount',
      name: t.tractors('table.drivers'),
      sortable: true,
    },
    {
      key: 'status',
      name: t.tractors('table.status'),
      sortable: true,
    },
    {
      key: 'ownerTitle',
      name: 'Подрядчик',
      sortable: true,
    }
  ],
  registries: [
    {
      name: t.registries('table.id'),
      key: 'id',
      sortable: true,
    },
    {
      name: t.registries('table.1cDate'),
      key: '1cDate',
      sortable: true,
    },
    {
      name: t.registries('table.actType'),
      key: 'actType',
      sortable: true,
    },
    {
      name: t.registries('table.act1cId'),
      key: 'act1cId',
      sortable: true,
    },
    {
      name: t.registries('table.date1cFrom'),
      key: '1cDate',
      sortable: true,
    },
    {
      name: t.registries('table.payment'),
      key: 'status',
      sortable: true,
    },
    {
      name: t.registries('table.sumInCoins'),
      key: 'sumInCoins',
      sortable: true,
    },
    {
      name: t.registries('table.ordersInReestr'),
      key: 'ordersCount',
      sortable: true,
    },
    {
      name: t.registries('table.clientTitle'),
      key: 'clientTitle',
      sortable: true,
    },
    {
      name: t.registries('table.softwareFeeAct1cDate'),
      key: 'softwareFeeAct1cDate',
      sortable: true,
    },
    {
      name: t.registries('table.originalsSentDate'),
      key: 'originalsSentDate',
      sortable: true,
    },
    {
      name: t.registries('table.originalReceivedDate'),
      key: 'originalReceivedDate',
      sortable: true,
    },
    {
      name: t.registries('table.paymentDeadlineDate'),
      key: 'paymentDeadlineDate',
      sortable: true,
    },
    {
      name: t.registries('table.renterName'),
      key: 'renterName',
      sortable: true,
    },
  ],
  registryDetails: [
    {
      name: t.registries('details.id'),
      key: 'orderId',
      sortable: true,
    },
    {
      name: t.registries('details.orderType'),
      key: 'orderType',
      sortable: true,
    },
    {
      name: t.registries('details.toStartAtDate'),
      key: 'toStartAtDate',
      sortable: true,
    },
    {
      name: t.registries('details.vehicleTypeId'),
      key: 'vehicleTypeId',
      sortable: true,
    },
    {
      name: t.registries('details.sumInCoins'),
      key: 'sumInCoins',
      sortable: true,
    },
    {
      name: t.registries('details.sumPayedInCoins'),
      key: 'sumPayedInCoins',
      sortable: true,
    },
    {
      name: t.registries('details.driverSum'),
      key: 'driverSum',
      sortable: true,
    },
    {
      name: t.registries('details.executorName'),
      key: 'executorName',
      sortable: true,
    },
    {
      name: t.registries('details.plateNumber'),
      key: 'plateNumber',
      sortable: true,
    },

    {
      name: t.registries('details.firstAddress'),
      key: 'firstAddress',
      sortable: true,
    },
  ],
  documents: [
    {
      name: t.documents('table.id'),
      key: 'orderId',
      sortable: true,
    },
    {
      name: t.documents('table.orderType'),
      key: 'orderType',
      sortable: true,
    },
    {
      name: t.documents('table.orderUiState'),
      key: 'orderUiState',
      sortable: true,
    },
    {
      name: t.documents('table.clientName'),
      key: 'clientName',
      sortable: true,
    },
    {
      name: t.documents('table.toStartAtDate'),
      key: 'toStartAtDate',
      sortable: true,
    },
    {
      name: t.documents('table.vehicleTypeId'),
      key: 'vehicleTypeId',
      sortable: true,
    },
    {
      name: t.documents('table.requiredLoadersCount'),
      key: 'requiredLoadersCount',
      sortable: true,
    },
    {
      name: t.documents('table.finishedAtDate'),
      key: 'finishedAtDate',
      sortable: true,
    },
    {
      name: t.documents('table.calculationAcceptedAtDate'),
      key: 'calculationAcceptedAtDate',
      sortable: true,
    },
    {
      name: t.documents('table.producerName'),
      key: 'producerName',
      sortable: true,
    },
    {
      name: t.documents('table.vehiclePlateNumber'),
      key: 'vehiclePlateNumber',
      sortable: true,
    },
    {
      name: t.documents('table.brigadierSurname'),
      key: 'brigadierSurname',
      sortable: true,
    },
    {
      name: t.documents('table.firstAddress'),
      key: 'firstAddress',
      sortable: true,
    },
    {
      name: t.documents('table.lastAddress'),
      key: 'lastAddress',
      sortable: true,
    },
    {
      name: t.documents('table.orderProducerCustomIdentifier'),
      key: 'orderProducerCustomIdentifier',
      sortable: true,
    },
    {
      name: t.documents('table.renterName'),
      key: 'renterName',
      sortable: true,
    },
  ],
  trailers: [
    {
      name: t.trailer('table.id'),
      key: 'id',
      sortable: true,
    },
    {
      name: t.trailer('table.markAndModel'),
      key: 'markAndModel',
      sortable: true,
    },
    {
      name: t.trailer('table.vehicleTypeId'),
      key: 'vehicleTypeId',
      sortable: true,
    },
    {
      name: t.trailer('table.plateNumber'),
      key: 'plateNumber',
      sortable: true,
    },
    {
      name: t.trailer('table.bodyType'),
      key: 'bodyType',
      sortable: true,
    },
    {
      name: t.trailer('table.liftingCapacityInKg'),
      key: 'liftingCapacityInKg',
      sortable: true,
    },
    {
      name: t.trailer('table.palletsCapacity'),
      key: 'palletsCapacity',
      sortable: true,
    },
    {
      name: t.trailer('table.capacity'),
      key: 'volume',
      sortable: true,
    },
    {
      name: t.trailer('table.ordersCount'),
      key: 'orderCount',
      sortable: true,
    },
    {
      name: t.trailer('table.crashCount'),
      key: 'crashCount',
      sortable: true,
    },
    {
      name: t.trailer('table.status'),
      key: 'status',
      sortable: true,
    },
    {
      name: 'Подрядчик',
      key: 'producerTitle',
      sortable: true,
    },
  ],
  loaders: [
    {
      name: t.loader('table.id'),
      key: 'id',
      sortable: true,
    },
    {
      name: t.loader('table.surname'),
      key: 'surname',
      sortable: true,
    },
    {
      name: t.loader('table.name'),
      key: 'name',
      sortable: true,
    },
    {
      name: t.loader('table.patronymic'),
      key: 'patronymic',
      sortable: true,
    },
    {
      name: t.loader('table.applicationPhone'),
      key: 'applicationPhone',
      sortable: true,
    },
    {
      name: t.loader('table.contactPhone'),
      key: 'contactPhone',
      sortable: true,
    },
    {
      name: t.loader('table.problematicOrdersCount'),
      key: 'problematicOrdersCount',
      sortable: true,
    },
    {
      name: t.loader('table.lastOrderDate'),
      key: 'lastOrderDate',
      sortable: true,
    },
    {
      name: t.loader('table.closedOrdersCount'),
      key: 'closedOrdersCount',
      sortable: true,
    },
    {
      name: t.loader('table.systemState'),
      key: 'systemState',
      sortable: true,
    },
  ],
  producerLoader: [
    {
      name: t.loader('table.id'),
      key: 'id',
      sortable: true,
    },
    {
      name: t.loader('table.loaderId'),
      key: 'loaderId',
      sortable: true,
    },
    {
      name: t.loader('table.surname'),
      key: 'surname',
      sortable: true,
    },
    {
      name: t.loader('table.name'),
      key: 'name',
      sortable: true,
    },
    {
      name: t.loader('table.patronymic'),
      key: 'patronymic',
      sortable: true,
    },
    {
      name: t.loader('table.applicationPhone'),
      key: 'applicationPhone',
      sortable: true,
    },
    {
      name: t.loader('table.contactPhone'),
      key: 'contactPhone',
      sortable: true,
    },
    {
      name: t.loader('table.problematicOrdersCount'),
      key: 'problematicOrdersCount',
      sortable: true,
    },
    {
      name: t.loader('table.closedOrdersCount'),
      key: 'closedOrdersCount',
      sortable: true,
    },
    {
      name: t.loader('table.lastOrderDate'),
      key: 'lastOrderDate',
      sortable: true,
    },
    {
      name: t.loader('table.systemState'),
      key: 'systemState',
      sortable: true,
    },
  ],
  clients: [
    {
      name: t.clients('table.id'),
      key: 'id',
      sortable: true,
    },
    {
      name: t.clients('table.type'),
      key: 'type',
      sortable: true,
    },
    {
      name: t.clients('table.inn'),
      key: 'inn',
      sortable: true,
    },
    {
      name: t.clients('table.name'),
      key: 'name',
      sortable: true,
    },
    {
      name: t.clients('table.vatRate'),
      key: 'vatRate',
      sortable: true,
    },
    {
      name: t.clients('table.balance'),
      key: 'balance',
      sortable: true,
    },
    {
      name: t.clients('table.creditLimit'),
      key: 'creditLimit',
      sortable: true,
    },
    {
      name: t.clients('table.paymentDelayInDays'),
      key: 'paymentDelayInDays',
      sortable: true,
    },
    {
      name: t.clients('table.activeOrdersCount'),
      key: 'activeOrdersCount',
      sortable: true,
    },
    {
      name: t.clients('table.cancelledOrdersCount'),
      key: 'cancelledOrdersCount',
      sortable: true,
    },
    {
      name: t.clients('table.cancelledOrdersRatio'),
      key: 'cancelledOrdersRatio',
      sortable: true,
    },
    {
      name: t.clients('table.uiState'),
      key: 'uiState',
      sortable: true,
    },
  ],
  producer: [
    {
      name: t.clients('table.id'),
      key: 'id',
      sortable: true,
    },
    {
      name: t.clients('table.type'),
      key: 'type',
      sortable: true,
    },
    {
      name: t.clients('table.inn'),
      key: 'inn',
      sortable: true,
    },
    {
      name: t.clients('table.name'),
      key: 'name',
      sortable: true,
    },
    {
      name: t.clients('table.vatRate'),
      key: 'vatRate',
      sortable: true,
    },
    {
      name: t.clients('table.vehiclesCount'),
      key: 'vehiclesCount',
      sortable: true,
    },
    {
      name: t.clients('table.pastOrdersCount'),
      key: 'pastOrdersCount',
      sortable: true,
    },
    {
      name: t.clients('table.cancelledOrdersCount'),
      key: 'cancelledOrdersCount',
      sortable: true,
    },
    {
      name: t.clients('table.cancelledOrdersRatio'),
      key: 'cancelledOrdersRatio',
      sortable: true,
    },
    {
      name: t.clients('table.uiState'),
      key: 'uiState',
      sortable: true,
    },
  ],
  operatorLoaders: [
    {
      name: t.loader('table.id'),
      key: 'id',
      sortable: true,
    },
    {
      name: t.loader('table.producerCompanyName'),
      key: 'producerCompanyName',
      sortable: true,
    },
    {
      name: t.loader('table.surname'),
      key: 'surname',
      sortable: true,
    },
    {
      name: t.loader('table.name'),
      key: 'name',
      sortable: true,
    },
    {
      name: t.loader('table.patronymic'),
      key: 'patronymic',
      sortable: true,
    },
    {
      name: t.loader('table.applicationPhone'),
      key: 'applicationPhone',
      sortable: true,
    },
    {
      name: t.loader('table.contactPhone'),
      key: 'contactPhone',
      sortable: true,
    },
    {
      name: t.loader('table.problematicOrdersCount'),
      key: 'problematicOrdersCount',
      sortable: true,
    },
    {
      name: t.loader('table.lastOrderDate'),
      key: 'lastOrderDate',
      sortable: true,
    },
    {
      name: t.loader('table.closedOrdersCount'),
      key: 'closedOrdersCount',
      sortable: true,
    },
    {
      name: t.loader('table.systemState'),
      key: 'systemState',
      sortable: true,
    },
  ],
  transportsOperator: [
    {
      name: 'ID',
      key: 'id',
      sortable: true,
    },
    {
      name: t.driver('table.producer'),
      key: 'companyName',
      sortable: true,
    },
    {
      name: t.transports('table.type'),
      key: 'vehicleTypeTitle',
      sortable: true,
    },
    {
      name: t.transports('table.bodyType'),
      key: 'bodyTypeTitle',
      sortable: true,
    },
    {
      name: t.transports('table.classification'),
      key: 'vehicleConstructionTypeTitle',
      sortable: true,
    },
    {
      name: t.transports('table.markAndModel'),
      key: 'markAndModel',
      sortable: true,
    },
    {
      name: t.transports('table.plateNumber'),
      key: 'plateNumber',
      sortable: true,
    },
    {
      name: t.transports('table.driversCount'),
      key: 'linkedDriversCount',
      sortable: true,
    },
    {
      name: t.transports('table.executed'),
      key: 'finishedOrdersCount',
      sortable: true,
    },
    {
      name: t.transports('table.crashCount'),
      key: 'crashCount',
      sortable: true,
    },
    {
      name: t.transports('table.uiStatus'),
      key: 'uiStatus',
      sortable: true,
    },
    {
      name: t.transports('table.jobStarted'),
      key: 'exploitationStartDate',
      sortable: true,
    },
  ],
  operatorDrivers: [
    {
      name: t.driver('table.id'),
      key: 'id',
      sortable: true,
    },
    {
      name: t.driver('table.producer'),
      key: 'producer',
      sortable: true,
    },
    {
      name: t.driver('table.lastName'),
      key: 'surname',
      sortable: true,
    },
    {
      name: t.driver('table.name'),
      key: 'name',
      sortable: true,
    },
    {
      name: t.driver('table.patronymic'),
      key: 'patronymic',
      sortable: true,
    },
    {
      name: t.driver('table.applicationPhone'),
      key: 'applicationPhone',
      sortable: true,
    },
    {
      name: t.driver('table.contactPhone'),
      key: 'contactPhone',
      sortable: true,
    },
    {
      name: t.driver('table.driverLicenseNumber'),
      key: 'driverLicenseId',
      sortable: true,
    },
    {
      name: t.driver('table.ratingByClients'),
      key: 'ratingByClients',
      sortable: true,
    },
    {
      name: t.driver('table.vehicleCount'),
      key: 'vehiclesCount',
      sortable: true,
    },
    {
      name: t.driver('table.lastOrderDate'),
      key: 'lastOrderDate',
      sortable: true,
    },
    {
      name: t.driver('table.closedOrdersCount'),
      key: 'closedOrdersCount',
      sortable: true,
    },
    {
      name: t.driver('table.problemOrdersCount'),
      key: 'problemOrdersCount',
      sortable: true,
    },
    {
      name: t.driver('table.neverDelegate'),
      key: 'neverDelegate',
      sortable: true,
    },
    {
      name: t.driver('table.uiStatus'),
      key: 'uiStatus',
      sortable: true,
    },
  ],
  cartulary: [
    {
      name: t.cartulary('table.id'),
      key: 'orderId',
      sortable: true,
    },
    {
      name: t.cartulary('table.type'),
      key: 'orderType',
      sortable: true,
    },
    {
      name: t.cartulary('table.date'),
      key: 'toStartDate',
      sortable: true,
    },
    {
      name: t.cartulary('table.typeCar'),
      key: 'vehicleTypeName',
      sortable: true,
    },
    {
      name: t.cartulary('table.typeAmount'),
      key: 'orderSum',
      sortable: true,
    },
    {
      name: t.cartulary('table.orderSoftwareSum'),
      key: 'orderSoftwareSum',
      sortable: true,
    },
    {
      name: t.cartulary('table.executionFinishedAtDate'),
      key: 'executionFinishedAtDate',
      sortable: true,
    },
    {
      name: t.cartulary('table.calculationAcceptedAtDate'),
      key: 'calculationAcceptedAtDate',
      sortable: true,
    },
    {
      name: t.cartulary('table.clientCompany'),
      key: 'clientCompany',
      sortable: true,
    },
    {
      name: t.cartulary('table.producerOrderCustomIdentifier'),
      key: 'producerOrderCustomIdentifier',
      sortable: true,
    },
    {
      name: t.cartulary('table.producerCompany'),
      key: 'producerCompany',
      sortable: true,
    },
    {
      name: t.cartulary('table.plateNumber'),
      key: 'plateNumber',
      sortable: true,
    },
    {
      name: t.cartulary('table.firstAddress'),
      key: 'firstAddress',
      sortable: true,
    },
    {
      name: t.cartulary('table.lastAddress'),
      key: 'lastAddress',
      sortable: true,
    },
    {
      name: t.cartulary('table.Identifier'),
      key: 'Identifier',
      sortable: true,
    },
    {
      name: t.cartulary('table.TypeContract'),
      key: 'TypeContract',
      sortable: true,
    },
  ],
  cartularyAdd: [
    {
      name: t.cartulary('table.id'),
      key: 'orderId',
      sortable: true,
    },
    {
      name: t.cartulary('table.type'),
      key: 'orderType',
      sortable: true,
    },
    {
      name: t.cartulary('table.date'),
      key: 'toStartDate',
      sortable: true,
    },
    {
      name: t.cartulary('table.typeCar'),
      key: 'vehicleTypeName',
      sortable: true,
    },
    {
      name: t.cartulary('table.typeAmount'),
      key: 'orderSum',
      sortable: true,
    },
    {
      name: t.cartulary('table.orderSoftwareSum'),
      key: 'orderSoftwareSum',
      sortable: true,
    },
    {
      name: t.cartulary('table.executionFinishedAtDate'),
      key: 'executionFinishedAtDate',
      sortable: true,
    },
    {
      name: t.cartulary('table.calculationAcceptedAtDate'),
      key: 'calculationAcceptedAtDate',
      sortable: true,
    },
    {
      name: t.cartulary('table.clientCompany'),
      key: 'clientCompany',
      sortable: true,
    },
    {
      name: t.cartulary('table.producerOrderCustomIdentifier'),
      key: 'producerOrderCustomIdentifier',
      sortable: true,
    },
    {
      name: t.cartulary('table.producerCompany'),
      key: 'producerCompany',
      sortable: true,
    },
    {
      name: t.cartulary('table.plateNumber'),
      key: 'plateNumber',
      sortable: true,
    },
    {
      name: t.cartulary('table.firstAddress'),
      key: 'firstAddress',
      sortable: true,
    },
    {
      name: t.cartulary('table.lastAddress'),
      key: 'lastAddress',
      sortable: true,
    },
    {
      name: t.cartulary('table.Identifier'),
      key: 'Identifier',
      sortable: true,
    },
    {
      name: t.cartulary('table.TypeContract'),
      key: 'TypeContract',
      sortable: true,
    },
  ],
};

const TABLE_ROWS = {
  orders: [
    {
      name: 'order_id',
    },
    {
      name: 'order_type',
      type: 'icon',
    },
    {
      name: 'a',
    },
    {
      name: 'frontend_client_status',
      type: 'fromDictionaries',
      key: 'transportOrderStatuses',
      withoutProp: true,
    },
    {
      name: 'current_position',
    },
    {
      name: 'to_start_at',
      type: 'date',
      format: '',
    },
    {
      name: 'vehicle_type_id',
      type: 'fromDictionaries',
      key: 'vehicleTypes',
      prop: 'name',
    },
    {
      name: 'plate_number',
    },
    {
      name: 'producer_name',
    },
    {
      name: ['executor_name', 'executor_surname'],
    },
    {
      name: 'first_address',
    },
    {
      name: 'last_address',
    },
  ],
  invoices: [
    {
      name: 'number',
    },
    {
      name: 'registryDate',
    },
    {
      name: 'payment_state',
      type: 'fromDictionaries',
      key: 'paymentStatus',
      withoutProp: true,
    },
    {
      name: 'sum_in_coins',
      type: 'money',
      value: 'руб.',
    },
    {
      name: 'orders_count',
    },
    {
      name: 'originals_sent_date',
      type: 'date',
    },
    {
      name: 'original_received_date',
      type: 'date',
    },
    {
      name: 'payment_deadline_date',
      type: 'date',
    },
    {
      name: 'payed_at',
    },
    {
      name: 'producer_title',
    },
  ],
  invoiceDetails: [
    {
      name: 'order_id',
    },
    {
      name: 'order_type',
      type: 'icon',
    },
    {
      name: 'to_start_at',
      type: 'date',
    },
    {
      name: 'vehicle_type_name',
    },
    {
      name: 'cost',
      type: 'sum',
      value: 'руб.',
    },
    {
      name: 'calculation_accepted_by_client_at',
      type: 'date',
    },
    {
      name: 'producer_name',
    },
    {
      name: 'first_address',
    },
    {
      name: 'last_address',
    },
  ],
  orderStatuses: [
    {
      className: 'bg-white',
      name: 'state',
      type: 'fromDictionaries',
      withoutProp: true,
      key: 'transportOrderStatuses',
    },
    { className: 'bg-white', name: 'monitoringTimeoutInSec', type: 'dropdownTime' },
    { className: 'bg-white', name: 'emailTimeoutInSec', type: 'dropdownTime' },
    { className: 'bg-white', name: 'smsTimeoutInSec', type: 'dropdownTime' },
  ],
  invoiceStatuses: [
    { className: 'bg-white', name: 'inStatus' },
    { className: 'bg-white', name: 'pushMessages', type: 'dropdownTime' },
    { className: 'bg-white', name: 'notifyByEmail', type: 'dropdownTime' },
    { className: 'bg-white', name: 'smsTimeoutInSec', type: 'dropdownTime' },
  ],
  sectionPreview: [
    { className: 'bg-white', name: 'inStatus' },
    { className: 'bg-white', name: 'inStatus' },
    { className: 'bg-white', name: 'inStatus' },
    { className: 'bg-white', name: 'inStatus' },
  ],
  auctions: [
    {
      name: 'order_id',
    },
    {
      name: 'order_type',
      type: 'icon',
    },
    {
      name: 'a',
    },
    {
      name: 'frontend_client_status',
      type: 'fromDictionaries',
      key: 'transportOrderStatuses',
      withoutProp: true,
    },
    {
      name: 'current_position',
    },
    {
      name: 'to_start_at',
      type: 'date',
      format: '',
    },
    {
      name: 'vehicle_type_id',
      type: 'fromDictionaries',
      key: 'vehicleTypes',
      prop: 'name',
    },
    {
      name: 'first_address',
    },
    {
      name: 'last_address',
    },
  ],
  producerOrders: [
    {
      name: 'orderId',
    },
    {
      name: 'orderType',
      type: 'icon',
    },
    {
      name: 'orderUiState',
      type: 'fromDictionaries',
      key: 'transportOrderStatuses',
      withoutProp: true,
    },
    {
      name: 'clientName',
    },
    {
      name: 'toStartAtDateLocal',
      type: 'date',
    },
    {
      name: 'vehicleTypeId',
      type: 'fromDictionaries',
      withoutProp: true,
      key: 'vehicleTypes',
      userType: 'pp',
    },
    {
      name: 'loadersCount',
      userType: 'pprr',
    },
    {
      name: 'finishedAtDate',
      type: 'date',
    },
    {
      name: 'calculationAcceptedAtDate',
      type: 'date',
    },
    {
      name: 'totalSumInCents',
      type: 'sum',
    },
    {
      name: 'actNo',
    },
    {
      name: ['orderData.driver.name', 'orderData.driver.surname'],
    },
    {
      name: 'vehiclePlateNumber',
      userType: 'pp',
    },
    {
      name: 'brigadierSurname',
      userType: 'pprr',
    },
    {
      name: 'firstAddress',
    },
    {
      name: 'lastAddress',
      userType: 'pp',
    },
    {
      name: 'routePointsCount',
    },
    {
      name: 'orderProducerCustomIdentifier',
    },
    {
      name: 'renterName',
      userType: 'pp',
    },
  ],
  operatorOrders: [
    {
      name: 'orderId',
    },
    {
      name: 'orderType',
      type: 'icon',
    },
    {
      name: 'orderUiState',
      type: 'fromDictionaries',
      key: 'transportOrderStatuses',
      withoutProp: true,
    },
    {
      name: 'clientCompany',
    },
    {
      name: 'producerCompany',
    },
    {
      name: 'toStartAtDate',
      format: 'DD.MM.YYYY',
      type: 'date',
    },
    {
      name: 'vehicleType',
      type: 'fromDictionaries',
      key: 'vehicleTypes',
      withoutProp: true,
    },
    {
      name: 'producerEmployeeName',
    },
    {
      name: 'originalsAcceptedAt.date',
      format: 'DD.MM.YYYY',
      type: 'date',
    },
    {
      name: 'plateNumber',
    },
    {
      name: 'preliminaryTotalSumInCents',
      type: 'sum',
      value: 'руб.',
    },
    {
      name: 'orderSum',
      type: 'sum',
      value: 'руб.',
    },
    {
      name: 'hourlyTotalSumInCents',
      type: 'sum',
      value: 'руб.',
    },
    {
      name: 'firstAddress',
    },
    {
      name: 'lastAddress',
    },
    {
      name: 'actNo',
    },
    {
      name: 'orderSum',
      type: 'percentage',
      fullPercent: 'payedSumInCents',
    },
    {
      name: 'operatorEmployeeName',
    },
    {
      name: 'orderProducerCustomIdentifier',
    },
  ],
  operatorNotificationOrders: [
    {
      name: 'orderId',
    },
    {
      name: 'orderType',
      type: 'icon',
    },
    {
      name: 'toStartAtDate',
      format: 'DD.MM.YYYY',
      type: 'date',
    },
    {
      name: 'vehicleType',
      type: 'fromDictionaries',
      key: 'vehicleTypes',
      withoutProp: true,
    },
    {
      name: 'preliminaryTotalSumInCents',
      type: 'sum',
      value: 'руб.',
    },
    {
      name: 'lastAddress',
    },
    {
      name: 'orderId',
      type: 'checkbox',
    },
  ],
  transports: [
    {
      name: 'id',
    },
    {
      name: 'vehicleTypeTitle',
    },
    {
      name: 'bodyTypeTitle',
    },
    {
      name: 'vehicleConstructionType',
      type: 'fromDictionaries',
      withoutProp: true,
      key: 'vehicleConstructionTypes',
    },
    {
      name: 'markAndModel',
    },
    {
      name: 'plateNumber',
    },
    {
      name: 'linkedDriversCount',
    },
    {
      name: 'finishedOrdersCount',
    },
    {
      name: 'crashCount',
    },
    {
      name: 'isOnline',
    },
    {
      name: 'exploitationStartDate',
      type: 'date',
    },
    {
      name: 'exploitationFinishDate',
      type: 'date',
    },
    {
      name: 'liftingCapacityInKg',
      type: 'weight',
    },
    {
      name: 'palletsCapacity',
    },
    {
      name: 'volume',
    },
    {
      name: 'uiStatus',
      type: 'fromDictionaries',
      key: 'unitUiStates',
      withoutProp: true,
    },
  ],
  drivers: [
    {
      name: 'id',
    },
    {
      name: 'surname',
    },
    {
      name: 'name',
    },
    {
      name: 'patronymic',
    },
    {
      name: 'applicationPhone',
    },
    {
      name: 'contactPhone',
    },
    {
      name: 'driverLicenseNumber',
    },
    {
      name: 'ratingByClients',
    },
    {
      name: 'vehiclesCount',
    },
    {
      name: 'lastOrderDate',
    },
    {
      name: 'closedOrdersCount',
    },
    {
      name: 'problemsCount',
    },
    {
      name: 'neverDelegate',
    },
    {
      name: 'uiState',
      type: 'fromDictionaries',
      key: 'unitUiStates',
      withoutProp: true,
    },
  ],
  tractors: [
    {
      name: 'id',
    },
    {
      name: 'markAndModel',
    },
    {
      name: 'plateNumber',
    },
    {
      name: 'ordersCount',
    },
    {
      name: 'crashesCount',
    },
    {
      name: 'linkedDriversCount',
    },
    {
      name: 'status',
    },
    {
      name: 'producerTitle'
    }
  ],
  registryDetails: [
    {
      name: 'orderId',
    },
    {
      name: 'orderType',
      type: 'icon',
    },
    {
      name: 'toStartAtLocal',
      type: 'date',
      format: 'DD.MM.YYYY HH:mm',
    },
    {
      name: 'vehicleTypeName',
    },
    {
      name: 'cost',
      type: 'money',
      value: 'руб.',
    },
    {
      name: 'softwareFee',
      type: 'money',
      value: 'руб.',
    },
    {
      name: 'payedSum',
      type: 'money',
      value: 'руб.',
    },
    {
      name: 'executorName',
      type: 'nameSurname',
      secondName: 'executorSurname',
    },
    {
      name: 'plateNumber',
    },

    {
      name: 'firstAddress',
    },
  ],
  documents: [
    {
      name: 'orderId',
    },
    {
      name: 'orderType',
      type: 'icon',
    },
    {
      name: 'orderUiState',
      type: 'fromDictionaries',
      key: 'transportOrderStatuses',
      withoutProp: true,
    },
    {
      name: 'clientName',
    },
    {
      name: 'toStartAtDate',
      type: 'date',
    },
    {
      name: 'vehicleTypeId',
      type: 'fromDictionaries',
      key: 'vehicleTypes',
      withoutProp: true,
    },
    {
      name: 'requiredLoadersCount',
    },
    {
      name: 'finishedAtDate',
      type: 'date',
    },
    {
      name: 'calculationAcceptedAtDate',
      type: 'date',
    },
    {
      name: 'producerName',
    },
    {
      name: 'vehiclePlateNumber',
    },
    {
      name: 'brigadierSurname',
    },
    {
      name: 'firstAddress',
    },
    {
      name: 'lastAddress',
    },
    {
      name: 'orderProducerCustomIdentifier',
    },
    {
      name: 'renterName',
    },
  ],
  trailers: [
    {
      name: 'id',
    },
    {
      name: 'markAndModel',
    },
    {
      name: 'vehicleTypeId',
    },
    {
      name: 'plateNumber',
    },
    {
      name: 'bodyType',
    },
    {
      name: 'liftingCapacityInKg',
      type: 'weight',
    },
    {
      name: 'palletsCapacity',
    },
    {
      name: 'volume',
    },
    {
      name: 'ordersCount',
    },
    {
      name: 'crashCount',
    },
    {
      name: 'status',
    },
    {
      name: 'producer["title"]',
    },
  ],
  loaders: [
    {
      name: 'id',
    },
    {
      name: 'surname',
    },
    {
      name: 'name',
    },
    {
      name: 'patronymic',
    },
    {
      name: 'applicationPhone',
    },
    {
      name: 'contactPhone',
    },
    {
      name: 'problematicOrdersCount',
    },
    {
      name: 'lastOrderDate',
      type: 'date',
    },
    {
      name: 'closedOrdersCount',
    },
    {
      name: 'systemState',
      type: 'fromDictionaries',
    },
  ],
  producerLoader: [
    {
      name: 'activeOrder.id',
    },
    {
      name: 'loaderId',
    },
    {
      name: 'surname',
    },
    {
      name: 'name',
    },
    {
      name: 'patronymic',
    },
    {
      name: 'loaderData.applicationPhone',
    },
    {
      name: 'contactPhone',
    },
    {
      name: 'problematicOrdersCount',
    },
    {
      name: 'closedOrdersCount',
    },
    {
      name: 'lastOrderDate',
      type: 'date',
    },
    {
      name: 'uiState',
      type: 'fromDictionaries',
      key: 'unitUiStates',
      withoutProp: true,
    },
  ],
  clients: [
    {
      name: 'id',
    },
    {
      name: 'type',
    },
    {
      name: 'inn',
    },
    {
      name: 'name',
    },
    {
      name: 'vatRate',
    },
    {
      name: 'balance',
    },
    {
      name: 'creditLimit',
    },
    {
      name: 'paymentDelayInDays',
    },
    {
      name: 'activeOrdersCount',
    },
    {
      name: 'cancelledOrdersCount',
    },
    {
      name: 'cancelledOrdersRatio',
    },
    {
      name: 'uiState',
      type: 'fromDictionaries',
      key: 'contractorStates',
      withoutProp: true,
    },
  ],
  producer: [
    {
      name: 'id',
    },
    {
      name: 'type',
    },
    {
      name: 'inn',
    },
    {
      name: 'name',
    },
    {
      name: 'vatRate',
    },
    {
      name: 'vehiclesCount',
    },
    {
      name: 'pastOrdersCount',
    },
    {
      name: 'cancelledOrdersCount',
    },
    {
      name: 'cancelledOrdersRatio',
    },
    {
      name: 'uiState',
      type: 'fromDictionaries',
      key: 'contractorStates',
      withoutProp: true,
    },
  ],
  operatorLoaders: [
    {
      name: 'id',
    },
    {
      name: 'producerCompanyName',
    },
    {
      name: 'surname',
    },
    {
      name: 'name',
    },
    {
      name: 'patronymic',
    },
    {
      name: 'applicationPhone',
    },
    {
      name: 'contactPhone',
    },
    {
      name: 'problematicOrdersCount',
    },
    {
      name: 'lastOrderDate',
      type: 'date',
    },
    {
      name: 'closedOrdersCount',
    },
    {
      name: 'uiState',
      key: 'unitUiStates',
      type: 'fromDictionaries',
      withoutProp: true,
    },
  ],
  transportsOperator: [
    {
      name: 'id',
    },
    {
      name: 'companyName',
    },
    {
      name: 'vehicleTypeTitle',
    },
    {
      name: 'bodyTypeTitle',
    },
    {
      name: 'vehicleConstructionType',
      type: 'fromDictionaries',
      withoutProp: true,
      key: 'vehicleConstructionTypes',
    },
    {
      name: 'markAndModel',
    },
    {
      name: 'plateNumber',
    },
    {
      name: 'linkedDriversCount',
    },
    {
      name: 'finishedOrdersCount',
    },
    {
      name: 'crashCount',
    },

    {
      name: 'uiStatus',
      type: 'fromDictionaries',
      key: 'unitUiStates',
      withoutProp: true,
    },
    {
      name: 'exploitationStartDate',
      type: 'date',
    },
  ],
  operatorDrivers: [
    {
      name: 'id',
    },
    {
      name: 'producer.companyShortName',
    },
    {
      name: 'surname',
    },
    {
      name: 'name',
    },
    {
      name: 'patronymic',
    },
    {
      name: 'applicationPhone',
    },
    {
      name: 'contactPhone',
    },
    {
      name: 'driverLicenseId',
    },
    {
      name: 'ratingByClients',
    },
    {
      name: 'vehiclesCount',
    },
    {
      name: 'lastOrderDate',
    },
    {
      name: 'closedOrdersCount',
    },
    {
      name: 'problemsCount',
    },
    {
      name: 'neverDelegate',
    },
    {
      name: 'uiState',
      type: 'fromDictionaries',
      key: 'unitUiStates',
      withoutProp: true,
    },
  ],
  cartulary: [
    {
      name: 'orderId',
    },
    {
      name: 'orderType',
      type: 'icon',
    },
    {
      name: 'toStartDate',
    },
    {
      name: 'vehicleTypeName',
    },
    {
      name: 'orderSum',
    },
    {
      name: 'orderSoftwareSum',
    },
    {
      name: 'executionFinishedAtDate',
    },
    {
      name: 'calculationAcceptedAtDate',
    },
    {
      name: 'clientCompany',
    },
    {
      name: 'producerOrderCustomIdentifier',
    },
    {
      name: 'producerCompany',
    },
    {
      name: 'plateNumber',
    },
    {
      name: 'firstAddress',
    },
    {
      name: 'lastAddress',
    },
    {
      name: 'Identifier',
    },
    {
      name: 'TypeContract',
    },
  ],

  cartularyAdd: [
    {
      name: 'orderId',
      type: 'checkbox',
    },
    {
      name: 'orderType',
      type: 'icon',
    },
    {
      name: 'toStartDate',
    },
    {
      name: 'vehicleTypeName',
    },
    {
      name: 'orderSum',
    },
    {
      name: 'orderSoftwareSum',
    },
    {
      name: 'executionFinishedAtDate',
    },
    {
      name: 'calculationAcceptedAtDate',
    },
    {
      name: 'clientCompany',
    },
    {
      name: 'producerOrderCustomIdentifier',
    },
    {
      name: 'producerCompany',
    },
    {
      name: 'plateNumber',
    },
    {
      name: 'firstAddress',
    },
    {
      name: 'lastAddress',
    },
    {
      name: 'Identifier',
    },
    {
      name: 'TypeContract',
    },
  ],
};

const CHECK_TABLE = {
  client: [
    { title: 'ИНН', data: '', apiData: '', prop: 'inn' },
    { title: 'Полное название', data: '', apiData: '', prop: 'fullName' },
    { title: 'Юридический адрес', data: '', apiData: '', prop: 'addressLegal' },
    //{title:'Генеральный директор', data:'', apiData:'', prop:''}
  ],
  producer: [
    { title: 'ИНН', data: '', apiData: '', prop: 'inn' },
    { title: 'КПП', data: '', apiData: '', prop: 'kpp' },
    { title: 'Адрес', data: '', apiData: '', prop: 'addressLegal' },
  ],
  transport: [
    { title: 'VIN', data: '', apiData: '', prop: 'vin' },
    { title: 'Марка и модель ТС', data: '', apiData: '', prop: 'markAndModel' },
    { title: 'Год выпуска', data: '', apiData: '', prop: 'yearOfManufacture' },
    { title: 'Гос. Номер РФ', data: '', apiData: '', prop: 'plateNumber' },
    //{title: 'Собственник', data: '', apiData: '', prop: 'owner'}
  ],
  driverPassport: [
    { title: 'ФИО', data: '', apiData: '', prop: ['surname', 'name', 'patronymic'] },
    { title: 'Дата рождения', data: '', apiData: '', prop: 'dateOfBirth', isDate: true },
    { title: 'Место рождения', data: '', apiData: '', prop: 'placeOfBirth' },
    { title: 'Серия и номер', data: '', apiData: '', prop: 'passportId' },
    { title: 'Дата выдачи', data: '', apiData: '', prop: 'passportIssuedAtDate', isDate: true },
    { title: 'Кем выдан', data: '', apiData: '', prop: 'passportIssuedBy' },
    { title: 'Код подразделения', data: '', apiData: '', prop: 'passportUnitCode' },
  ],
  driverLicense: [
    {
      title: 'ФИО',
      data: '',
      apiData: '',
      prop: ['driverLicenseSurname', 'driverLicenseName', 'driverLicensePatronymic'],
    },
    { title: 'Дата рождения', data: '', apiData: '', prop: 'driverLicenseDateOfBirth', isDate: true },
    { title: 'Место рождения', data: '', apiData: '', prop: 'driverLicensePlaceOfBirth' },
    { title: 'Серия и номер', data: '', apiData: '', prop: 'driverLicenseId' },
    { title: 'Дата выдачи', data: '', apiData: '', prop: 'driverLicenseIssuedAtDate', isDate: true },
    { title: 'Годно до', data: '', apiData: '', prop: 'driverLicenseExpiresAtDate', isDate: true },
    { title: 'Кем выдан', data: '', apiData: '', prop: 'driverLicenseIssuedBy' },
  ],
};

export const getTableHeaders = (name, type) => {
  return TABLE_HEADERS[name].filter((header) => {
    if (!header.type || header.type === type) {
      return header;
    }
  });
};
export const getTableRows = (name, type) => {
  return TABLE_ROWS[name].filter((row) => {
    if (!row.userType || row.userType === type) {
      return row;
    }
  });
};
export const checkTable = (name) => CHECK_TABLE[name];
