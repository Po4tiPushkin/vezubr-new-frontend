import { MD5 } from '@vezubr/common/utils';
import _compact from 'lodash/compact';
import { GeoCoding as GooglePlaceService } from '../index';

export function getCityNameFiasIdFromGoogleAddressComponents(addressComponents) {
  const admLevels = {
    country: null,
    administrative_area_level_1: null,
    administrative_area_level_2: null,
    locality: null,
  };

  const admLevelsArr = Object.keys(admLevels);

  for (const addressComponent of addressComponents) {
    for (const admLevelName of admLevelsArr) {
      if (addressComponent.types.indexOf(admLevelName) !== -1) {
        admLevels[admLevelName] = addressComponent.short_name;
      }
    }
  }

  return {
    cityName: admLevels.locality || admLevels.administrative_area_level_2 || admLevels.administrative_area_level_1,
    cityFiasId: MD5(
      admLevelsArr
        .map((admLevelName) => admLevels[admLevelName])
        .filter((v) => !!v)
        .join(', '),
    ),
  };
}

export function getCityNameFiasIdFromGoogleGeCode(properties = {}) {
  const admLevels = {
    country: properties?.countryCode,
    administrative_area_level_1: properties?.adminLevels?.[1]?.code,
    administrative_area_level_2: properties?.adminLevels?.[2]?.code,
    locality: properties?.locality,
  };

  const admLevelsArr = Object.keys(admLevels);

  return {
    cityName: admLevels.locality || admLevels.administrative_area_level_2 || admLevels.administrative_area_level_1,
    cityFiasId: MD5(
      admLevelsArr
        .map((admLevelName) => admLevels[admLevelName])
        .filter((v) => !!v)
        .join(', '),
    ),
  };
}

export function getCityAddressStringFromGoogleGeCode(properties) {
  const addressStringArr = [
    properties?.country,
    properties?.adminLevels?.[1]?.name,
    properties?.locality,
    properties?.streetName,
    properties?.streetNumber,
  ];

  return _compact(addressStringArr).join(', ');
}

export async function getFiasByCoordinate ({ latitude, longitude }) {
  try {
    const response = await GooglePlaceService.reverseGeoCoderGoogle(latitude, longitude);
    const geoProperty = response?.[0]?.properties;

    if (geoProperty) {
      const addressString = getCityAddressStringFromGoogleGeCode(geoProperty);
      const { cityName, cityFiasId } = getCityNameFiasIdFromGoogleGeCode(geoProperty);
      return {
        addressString,
        cityName,
        cityFiasId
      }
    }
  } catch (e) {
    console.error(e);
  }

  return null
}

export async function getFiasByPlace(data) {
  const { value, data: {city, city_fias_id} } = data
  try {
    const details = await GooglePlaceService.geoCoder(value);

    const { geometry: { coordinates: [longitude, latitude] = [] } = {} } = details[0] || {};

    return {
      latitude,
      longitude,
      cityName: city,
      cityFiasId: city_fias_id
    }
  } catch (e) {
    console.error(e);
  }

}