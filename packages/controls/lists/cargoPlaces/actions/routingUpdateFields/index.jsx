import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RouteForm from './routeForm';
import Utils from "@vezubr/common/common/utils";
import {Ant, showError} from "@vezubr/elements";


function RoutingUpdateFields(props) {
  const { dictionaries, dataSource, onCancel, onSaveRoutingChanges } = props;

  const onSave = async (store) => {
    try {
      const { hasError, values } = store.getValidateData();

      if (hasError) {
        await Utils.setDelay(300);
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }

      const { cargoPlaceIds, configuration, vehicles } = values;
      const shifts = vehicles.map((item) => {
        return {
          startAt: item.vehicleStartAt,
          endAt: item.vehicleEndAt,
          vehicles: [{
            vehicleType: String(item.vehicleTypeId),
            count: item.vehicleCount,
          }]
        }
      });

      onSaveRoutingChanges({ configuration, cargoPlaceIds, shifts });
    } catch (e) {
      console.error(e);
      showError(e);
    }
  };

  return (
    <RouteForm
      onSave={onSave}
      onCancel={onCancel}
      cargoPlaces={dataSource}
      dictionaries={dictionaries}
    />
  );
}

RoutingUpdateFields.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  dictionaries: PropTypes.object,
  dataSource: PropTypes.arrayOf(PropTypes.object),
  onCancel: PropTypes.func,
  onSaveRoutingChanges: PropTypes.func,
};

const mapStateToProps = (state) => {
  let { dictionaries = {} } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(RoutingUpdateFields);
