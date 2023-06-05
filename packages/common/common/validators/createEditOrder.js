import t from '../../localization';
import Static from '../../constants/static';

export default {
  addresses: (addresses) => (!addresses.length ? t.error('provideAddress') : false),
  assessedCargoValue: (val) => {
    val = val ? parseFloat(val) : '';
    return !val ? t.error('requiredField') : false;
  },
  cargoCategoryId: (cargoCategoryId) => (!cargoCategoryId.key ? t.error('cargoTypesError') : false),
  toStartAtDate: (toStartAtDate) =>
    !toStartAtDate || !/^\d{2}\.\d{2}\.\d{4}$/.test(toStartAtDate) ? t.error('toStartAtDateError') : false,
  toStartAtTime: (toStartAtTime) =>
    !toStartAtTime || !/^\d{2}:\d{2}$/.test(toStartAtTime) ? t.error('toStartAtTimeError') : false,
  vehicleType: (vehicleType) => {
    return !vehicleType.val.name ? t.error('selectFromLst') : false;
  },
  bodyTypes: (bodyTypes) => (bodyTypes && bodyTypes.length ? false : t.error('selectFromLst')),
  contourTree: (requiredContours) => !requiredContours.length && 'Выберите контур или подрядчика',
};
