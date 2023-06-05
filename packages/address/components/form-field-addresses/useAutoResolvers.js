import { cancelable } from 'cancelable-promise';
import { useCallback, useEffect, useRef } from 'react';
import { GeoCoding as GeoCodingService } from '@vezubr/services';
import { getFiasByCoordinate } from '@vezubr/services/fias/googlePlace';


export default function useAutoResolvers({ address, onUpdatedAddress, index}) {

  const addressRef = useRef(address);
  addressRef.current = address;

  const fetchTimeZone = useCallback(
    async ({ latitude, longitude }) => {
      try {
        const response = await GeoCodingService.getTimeZone(latitude, longitude);
        if (response?.timeZoneId) {
          return response?.timeZoneId
        }

        return null;

      } catch (e) {
        console.error(e);
      }

      return null
    },
    [],
  );

  // Автоматическое определение fias горда по координатам
  useEffect(() => {
    let cancelableFiasByCoordinate = null;
    if ((!address.cityFiasId || !address.cityName) && address.latitude && address.longitude) {
      cancelableFiasByCoordinate = cancelable(getFiasByCoordinate(address));

      cancelableFiasByCoordinate.then(({ cityName,  cityFiasId}) => {
        if (cityName && cityFiasId) {
          onUpdatedAddress({ ...addressRef.current, cityFiasId, cityName }, index);
        }
      });
    }

    return () => {
      if (cancelableFiasByCoordinate) {
        cancelableFiasByCoordinate.cancel();
      }
    };
  }, [address.cityFiasId, address.cityName, address.latitude, address.longitude, index]);

  // Автоматическое определение таймзоны
  useEffect(() => {
    let cancelableTimeZoneByCoordinate = null;

    if (!address.timeZoneId && address.latitude && address.longitude) {
      cancelableTimeZoneByCoordinate = cancelable(fetchTimeZone(address));
      cancelableTimeZoneByCoordinate.then((timeZoneId) => {
        if (timeZoneId) {
          onUpdatedAddress({ ...addressRef.current, timeZoneId }, index);
        }
      });
    }

    return () => {
      if (cancelableTimeZoneByCoordinate) {
        cancelableTimeZoneByCoordinate.cancel();
      }
    };
  }, [address.timeZoneId, address.latitude, address.longitude, index]);

}
