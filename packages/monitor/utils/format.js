import moment from 'moment';
import t from '@vezubr/common/localization';

export function formatOrder(orderInput) {
  const data = { ...orderInput };

  const points = orderInput?.points && Object.values(orderInput.points);

  data.uiStateEnteredAt = orderInput?.uiStateEnteredAt || orderInput?.orderUiState?.enteredAt;

  data.bargain_status = orderInput?.bargainStatus;
  data.bargain_offer = orderInput?.bargainOffer;

  data.firstPoint = {
    latitude: data?.firstPointLatitude || data?.address?.latitude || points?.[0]?.latitude || points?.[0]?.lat,
    longitude: data?.firstPointLongitude || data?.address?.longitude || points?.[0]?.longitude || points?.[0]?.lng,
    addressString: data?.address?.addressString || points?.[0]?.addressString || points?.[0]?.address,
  };

  data.vehicleTypeId = orderInput?.vehicleTypeId || orderInput?.vehicle_type?.id;
  data.vehicleBodyTypeId = orderInput?.vehicle?.bodyType || orderInput?.bodyType || orderInput?.body_type;

  data.requiredBodyTypes = orderInput?.required_body_types || orderInput?.requiredBodyTypes;
  if (data.requiredBodyTypes && !Array.isArray(data.requiredBodyTypes)) {
    data.requiredBodyTypes = Object.values(data.requiredBodyTypes);
  }

  if (points && points.length > 1) {
    const lastPoint = points[points.length - 1];

    data.lastPoint = {
      latitude: lastPoint?.latitude || lastPoint?.lat,
      longitude: lastPoint?.longitude || lastPoint?.lng,
      addressString: lastPoint?.addressString || lastPoint?.address,
    };
  }

  data.toStartAt = orderInput.toStartAt || orderInput.start_at;

  data.startAtLocal = orderInput.start_at_local || orderInput.startAtLocal || orderInput.toStartAtLocal;

  data.loadersCount = orderInput.loadersCount || orderInput.orderedLoadersCount || orderInput?.loaders?.length;

  data.requiredContourIds = orderInput.required_contour_ids || orderInput.requiredContourIds;

  data.requestId = orderInput.requestId || orderInput.request_id;
  data.orderType = orderInput.type;

  data.selectingStrategy = orderInput.selectingStrategy || orderInput.selecting_strategy;

  if (orderInput.vehicle) {
    data.vehicle = formatVehicle(orderInput.vehicle);
  }

  if (orderInput.producer) {
    data.producer = formatProducer(orderInput.producer);
  }

  if (orderInput.client) {
    data.client = formatClient(orderInput.client);
  }

  return data;
}

export function formatProducer(producerInput) {
  const data = { ...producerInput };

  data.companyShortName = producerInput?.companyShortName || producerInput?.company_name;

  return data;
}

export function formatClient(clientInput) {
  const data = { ...clientInput };

  data.companyShortName = clientInput?.companyShortName || clientInput?.company_name;

  return data;
}

export function formatVehicle(vehicleInput) {
  const data = { ...vehicleInput };
  data.id = vehicleInput.vehicleId || vehicleInput.id;
  data.lastGpsLatitude = vehicleInput?.lastGpsLatitude || vehicleInput?.last_gps_latitude || null;
  data.lastGpsLongitude = vehicleInput?.lastGpsLongitude || vehicleInput?.last_gps_longitude || null;
  data.plateNumber = vehicleInput?.plate_number || vehicleInput?.plateNumber;

  data.vehicleTypeId = vehicleInput?.vehicleTypeId || vehicleInput?.vehicle_type?.id;
  data.vehicleBodyTypeId = vehicleInput?.bodyType || vehicleInput?.body_type;

  data.lastApiCallAt = vehicleInput?.lastApiCallAt;
  data.lastGpsSentAt = vehicleInput?.lastGpsSentAt;

  return data;
}

export function formatDuration(defaultFromNowFormat) {
  let tt = defaultFromNowFormat
    .replace('назад', '')
    .replace('несколько секунд', 'мин')
    .replace('минуту', 'мин')
    .replace('минуты', 'мин')
    .replace('минут', 'мин')
    .trim();
  tt = tt.split(' ');
  if (tt.length === 1) tt.unshift('1');
  tt = tt.join(' ');
  return tt;
}

export function formatDateTime(startAtLocal) {
  const date = moment(startAtLocal);
  const now = moment();

  return {
    date: now.isSame(date, 'day') ? t.common('today') : date.format('DD MMM').replace(/[\.,]/gi, ''),
    time: date.format('HH:mm'),
  };
}
