export function dictionaryConvertToGeneralView({ dictionaries }) {
  const {
    vehicleTypes: vehicleTypesInput,
    territories: territoriesInput,
    vehicleTypesList: vehicleTypesListInput,
    vehicleBodyTypes,
    vehicleBodies: vehicleBodiesInput,
    geozones: geozonesInput,
    orderServices: orderServicesInput,
  } = dictionaries;

  const vehicleBodies = vehicleBodyTypes || vehicleBodiesInput;

  let geozones = geozonesInput;
  const geozonesList = [];
  if (geozonesInput) {
    if (typeof Object.values(geozonesInput)[0] !== 'string') {
      geozones = {};
      for (const geoZoneIdString of Object.keys(geozonesInput)) {
        geozones[geoZoneIdString] = geozonesInput[geoZoneIdString]?.name;
        geozonesList.push({
          id: ~~geoZoneIdString,
          ...geozonesInput[geoZoneIdString],
        });
      }
    } else {
      for (const geoZoneIdString of Object.keys(geozonesInput)) {
        geozonesList.push({
          id: ~~geoZoneIdString,
          name: geozonesInput[geoZoneIdString],
        });
      }
    }
  }

  let vehicleTypesList = vehicleTypesListInput || vehicleTypesInput;

  const vehicleTypes = {};

  if (vehicleTypesList && !Array.isArray(vehicleTypesList)) {
    const list = [];
    for (let id of Object.keys(vehicleTypesList)) {
      id = ~~id;
      const vehicle = {
        ...vehicleTypesList[id],
        id,
      };
      list.push(vehicle);
    }
    vehicleTypesList = list;
    vehicleTypesList = [...vehicleTypesList];
    vehicleTypesList.sort((a, b) => ~~a.orderPosition - ~~b.orderPosition);

    for (const vehicleType of vehicleTypesList) {
      vehicleTypes[vehicleType.id] = vehicleType.name;
    }
  }

  

  let territories = territoriesInput;
  if (territoriesInput && typeof Object.values(territoriesInput)[0] === 'object') {
    territories = {};
    for (const territoryId of Object.keys(territoriesInput)) {
      const territory = territoriesInput[territoryId];
      territories[territoryId] = territory.title;
    }
  }

  // Костыль превращаем редактирование параметров в сервисы
  const orderServices = {
    ...orderServicesInput,
    [9901]: {
      article: '9901',
      name: 'Бесплатное время простоя',
      unitValue: 'мин.',
    },
  };

  return {
    ...dictionaries,
    vehicleTypesList,
    vehicleTypes,
    territories,
    vehicleBodies,
    geozones,
    geozonesList,
    orderServices,
  };
}
