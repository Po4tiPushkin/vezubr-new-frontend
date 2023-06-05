import { Ant } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import React from 'react';

const getOptionsForSelect = (list, statusType) => {
  if (statusType === 'status') {
    return list.cargoPlaceStatuses.map((item) => (
      <Ant.Select.Option key={item.id} value={item.id}>
        {t.order(`cargoPlaceStatuses.${item.id}`)}
      </Ant.Select.Option>
    ));
  } else {
    return list.addressList.map((item) => (
      <Ant.Select.Option key={item.id} value={item.id} data-address-string={item?.addressString}>
        {(item?.addressString && `${item.id} / ${item?.addressString}`) || item.id}
      </Ant.Select.Option>
    ));
  }
}

export { getOptionsForSelect };