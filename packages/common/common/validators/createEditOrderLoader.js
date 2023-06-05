import t from '../../localization';
import Static from '../../constants/static';

export default {
  address: (address) => (!address || !Object.keys(address).length ? t.error('provideAddress') : false),
  toStartAtDate: (toStartAtDate) =>
    !toStartAtDate || !/^\d{2}\.\d{2}\.\d{4}$/.test(toStartAtDate) ? t.error('toStartAtDateError') : false,
  toStartAtTime: (toStartAtTime) =>
    !toStartAtTime || !/^\d{2}:\d{2}$/.test(toStartAtTime) ? t.error('toStartAtTimeError') : false,
  loadersCount: (toStartAtTime) => (!toStartAtTime ? t.error('loadersCountError') : false),
  contourTree: (requiredContours) => !requiredContours.length && 'Выберите контур или подрядчика',
};
