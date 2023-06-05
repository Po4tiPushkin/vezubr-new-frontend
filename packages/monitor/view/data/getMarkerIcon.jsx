import * as Order from '@vezubr/order/form';
import * as VzMap from '@vezubr/map';

export default function getMarkerIcon(item) {
  const { type } = item;

  if (type === 'vehicle') {
    return VzMap.Icons.pinDivBgIcon({
      iconName: Order.Icons.getGreyBitmapIconNameTruck(1, false),
      bgName: Order.Icons.getBitmapIconBgNameTruck(false),
    });
  }

  if (type !== 'order' && type !== 'vehicle') {
    return VzMap.Icons.pinDivIcon({ pinName: 'pinNoNumberGray' });
  }

  const { problems = [], orderType } = item;
  const hasProblem = problems.find(el => el?.status === 1);
  return VzMap.Icons.pinDivBgIcon({
    iconName: Order.Icons.getBitmapIconNameTruck(orderType, hasProblem),
    bgName: Order.Icons.getBitmapIconBgNameTruck(hasProblem),
  });
}
