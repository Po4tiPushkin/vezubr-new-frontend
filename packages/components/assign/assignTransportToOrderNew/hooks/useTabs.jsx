import React, { useMemo } from 'react';
import { GeoCoding as GCService } from '@vezubr/services';
import moment from 'moment';
import Utils from '@vezubr/common/common/utils';
const useTabs = ({ vehicles, activeTab, startAtLocal, orderCoordinates }) => {
  const tabs = useMemo(() => {
    const tabsEl =  [
      {
        title: 'Доступные',
        active: true,
        searchCompanyINN: undefined,
        searchPlateNumber: null,
        vehicles: [],
      },
      {
        title: 'На выгрузке',
        active: false,
        searchCompanyINN: undefined,
        searchPlateNumber: null,
        vehicles: [],
      },
      {
        title: 'Недоступные',
        active: false,
        searchCompanyINN: undefined,
        searchPlateNumber: null,
        vehicles: [],
      },
    ]

    const today = moment(startAtLocal).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');

    tabsEl.forEach((el, index) =>  el.active = Boolean(activeTab === index) )

    for (const vehicleInput of vehicles) {
      const drivers = vehicleInput.linkedDrivers;
      const vehicle = { ...vehicleInput };


      vehicle.vehicle.availability = vehicle.availability;
      vehicle.vehicle.orderCoordinates = orderCoordinates;
      vehicle.vehicle.distance = undefined;
      vehicle.distance = 999999;

      if (vehicle.availability === 1) {
        tabsEl[0].vehicles.push(vehicle);
      } else if (vehicle.availability === 2) {
        tabsEl[2].vehicles.push(vehicle);
      } else if (vehicle.availability === 3) {
        tabsEl[1].vehicles.push(vehicle);
      }
    }

    return tabsEl;
  }, [vehicles, activeTab, startAtLocal, orderCoordinates])

  return tabs;
}

export default useTabs;