export const MONITOR_ORDER_STATES_SELECTION_SHOULD_START = [201];

export const MONITOR_ORDER_STATES_SELECTION_START = [
  102,
  103,
  800,
  801,
  802,
  ...MONITOR_ORDER_STATES_SELECTION_SHOULD_START,
];

export const MONITOR_ORDER_STATES_SELECTION_END = [106, 107, 108];

export const MONITOR_ORDER_STATES_SELECTION = [
  ...MONITOR_ORDER_STATES_SELECTION_START,
  ...MONITOR_ORDER_STATES_SELECTION_END,
];

export const MONITOR_ORDER_STATES_EXECUTION = [301, 302, 303, 304, 305, 306, 307, 310];
export const MONITOR_ORDER_STATES_PAPER_CHECK = [400];

export const MONITOR_PROP_WAITING = 'waiting';
export const MONITOR_PROP_LOADING = 'loading';
export const MONITOR_PROP_MAP_PROPS = 'mapProps';

export const MONITOR_VEHICLE_ACTUAL_MINUTE = 10;

export const MONITOR_ORDER_REQUIREMENTS = [
'cornerPillarRequired',
'chainRequired',
'strapRequired',
'tarpaulinRequired',
'netRequired',
'wheelChockRequired',
'gPSMonitoringRequired',
'woodenFloorRequired',
'doppelstockRequired',
'thermograph',
'rampCompatibilityRequired',
'palletJackRequired',
'conicsRequired',
'isDriverLoaderRequired',
'isSanitaryBookRequired',
'isSanitaryPassportRequired',
'isTakeOutPackageRequired',
]