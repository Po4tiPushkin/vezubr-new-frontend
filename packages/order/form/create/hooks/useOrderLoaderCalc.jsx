import React from 'react';
import * as Order from '../..';
import { Orders as OrdersService } from '@vezubr/services';
import { useSelector } from 'react-redux';

export default function () {
  const user = useSelector((state => state?.user))
  return React.useCallback(async (list) => {
    let reqData = {};

    for (const name of Object.keys(list)) {
      reqData[name] = list[name].value;
    }
    if (APP === 'dispatcher') {
      reqData = Order.Utils.getOrderDataSaveDispatcher(reqData);
    }
    if (APP === 'client') {
      reqData = Order.Utils.getOrderDataSave(reqData);
    }
 
    reqData.address = reqData.addresses[0]

    delete reqData.addresses;


    const value = await OrdersService.preCalculateLoaders(reqData);
    const hash = Order.Utils.getCalculationHash(Order.Utils.fixCalculate(value));

    return {
      min: hash?.minCost?.value,
      max: hash?.maxCost?.value,
      value,
      hash,
    };
  }, [user]);
}
