import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _pullAll from 'lodash/pullAll';
import _intersection from 'lodash/intersection';
import _difference from 'lodash/difference';
import _uniq from 'lodash/uniq';
import { observer } from 'mobx-react';
import { Ant, Icons } from '@vezubr/elements';
import { TariffContext } from '../../../context';
import { VEHICLE_BODY_GROUPS, VEHICLE_BODY_GROUPS_BODY_TYPES } from '@vezubr/common/constants/constants';

function TariffBodyTypesEditor(props) {
  const { vehicle, disabled = false } = props;
  const { store } = React.useContext(TariffContext);

  const vehicleType = useMemo(() => {
    if (Array.isArray(vehicle?.tariff?.vehicleTypesList)) {
      return vehicle?.tariff?.vehicleTypesList.find(el => el.id === vehicle?.vehicleTypeId)
    }
    return null
  }, [vehicle?.tariff?.vehicleTypesList, vehicle?.vehicleTypeId ]);

  const disabledBodyTypes = React.useMemo(() => {
    let disabled = [];
    if (!vehicleType?.availableBodyTypes) {
      return disabled
    }
    vehicle?.tariff?.bodyTypes.forEach((el) => {
      if (!vehicleType?.availableBodyTypes[el.id]) {
        disabled.push(el.id);
      }
    })
    return disabled;
  }, [vehicleType, vehicle?.tariff?.bodyTypes]);

  const update = React.useCallback(
    (bodyTypes) => {
      vehicle.setBodyTypes(bodyTypes);
    },
    [vehicle, vehicle.bodyTypes],
  );

  const options = React.useMemo(() => {
    return vehicle.tariff.bodyTypes.map(({ id: value, title }) => {
      const disabled = disabledBodyTypes.includes(value) || disabled;

      return {
        label: title,
        value,
        disabled,
      };
    });
  }, [vehicle, disabledBodyTypes]);

  const handleChangeIndeterminate = React.useCallback(
    (e) => {
      const { groupId, checked } = e.target;
      const availableGroupBodyTypes = _difference(VEHICLE_BODY_GROUPS_BODY_TYPES[groupId], disabledBodyTypes);
      const bodyTypes = checked
        ? _uniq([...vehicle.bodyTypes, ...availableGroupBodyTypes])
        : _difference(vehicle.bodyTypes, availableGroupBodyTypes);
      vehicle.setBodyTypes(bodyTypes);
    },
    [vehicle.bodyTypes, disabledBodyTypes],
  );

  const indeterminateConfig = React.useMemo(() => {
    const config = {};

    for (const groupId of Object.keys(VEHICLE_BODY_GROUPS)) {
      const groupBodyTypes = VEHICLE_BODY_GROUPS_BODY_TYPES[groupId].filter(el => !disabledBodyTypes.includes(el));
      const intersection = _intersection(vehicle.bodyTypes, groupBodyTypes);
      const indeterminate = !!intersection.length && intersection.length !== groupBodyTypes.length;
      const disabled = _difference(groupBodyTypes, disabledBodyTypes).length === 0;
      const checked = !disabled && intersection.length === groupBodyTypes.length;
      config[groupId] = {
        indeterminate,
        checked,
        disabled,
      };
    }

    return config;
  }, [vehicle.bodyTypes, disabledBodyTypes]);

  return (
    <div className={'tariff-body-types-editor'}>
      <div className={'checkbox-indeterminate-group'}>
        {Object.keys(VEHICLE_BODY_GROUPS).map((groupId) => (
          <Ant.Tooltip key={groupId} title={VEHICLE_BODY_GROUPS[groupId]}>
            <Ant.Checkbox
              indeterminate={indeterminateConfig[groupId].indeterminate}
              checked={indeterminateConfig[groupId].checked}
              disabled={disabled || indeterminateConfig[groupId].disabled}
              onChange={handleChangeIndeterminate}
              groupId={~~groupId}
            >
              <Icons.Truck.BodyGroupIcon bodyGroupId={groupId} />
            </Ant.Checkbox>
          </Ant.Tooltip>
        ))}

        <Ant.Popover
          overlayClassName="tariff-body-types-editor__popover"
          placement="top"
          title={'Типы кузовов'}
          content={<Ant.Checkbox.Group options={options} value={vehicle.bodyTypes} onChange={update} />}
          trigger="click"
        >
          <Ant.Button className={`btn-body-types-more ${disabled ? 'disabled' : ''}`} icon={'ellipsis'} size={'small'} />
        </Ant.Popover>
      </div>
    </div>
  );
}

TariffBodyTypesEditor.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default observer(TariffBodyTypesEditor);
