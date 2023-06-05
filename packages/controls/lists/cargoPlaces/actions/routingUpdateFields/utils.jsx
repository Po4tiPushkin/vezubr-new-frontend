import { Ant } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import React from 'react';

const labelForMainSelect = (types, status) => {
  const findIndex = types.findIndex((type) => {
    return type.value === status;
  });

  return types[findIndex].mainLabel;
}

const getOptionsForSelect = (list, statusType) => {
    return list.veeroutePlanTypes.map((item) => (
      <Ant.Select.Option key={item.id} value={item.id}>
        {/* {t.order(`cargoPlaceStatuses.${item.id}`)} */}
        {item.id}
      </Ant.Select.Option>
    ));

}

export { labelForMainSelect, getOptionsForSelect };