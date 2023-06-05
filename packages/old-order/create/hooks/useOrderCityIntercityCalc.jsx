import React from 'react';
import * as Utils from '../../utils';
import { Orders as OrdersService } from '@vezubr/services';
import { useSelector } from 'react-redux';
export default function () {
  const user = useSelector((state => state?.user))
  return React.useCallback(async (list) => {
    let reqData = {};

    for (const name of Object.keys(list)) {
      reqData[name] = list[name].value;
    }
    if (APP === 'client') {
      reqData = Utils.getOrderDataSave(reqData);
    }
    if (APP === 'dispatcher') {
      reqData = Utils.getOrderDataSaveDispatcher(reqData);
    }
    reqData.addresses = reqData.addresses.map((address) => {
      if (typeof address.contacts === 'string') {
        address.contacts = [address.contacts];
      }
      address.attachedFiles?.map(el => { el.name = el.fileName || el.fileNameOrigin; el.fileId = String(el.fileId); delete el.fileName; return el })

      return address;
    });

    if (APP === 'client') {
      const value = await OrdersService.preCalculate(reqData);
      const hash = Utils.getCalculationHash(Utils.fixCalculate(value));
      return {
        min: hash?.minCost?.value,
        max: hash?.maxCost?.value,
        value,
        hash,
      };
    }

    if (APP === 'dispatcher') {
      const calcWithClients = await OrdersService.preCalculate(reqData);
      const calcWithProducers = await OrdersService.preCalculate({
        ...reqData,
        client: user?.id,
      });
      const hash = Utils.getCalculationHash(Utils.fixCalculate(calcWithClients));
      const hashProds = Utils.getCalculationHash(Utils.fixCalculate(calcWithProducers));

      return {
        min: hash?.minCost?.value,
        max: hash?.maxCost?.value,
        value: calcWithClients,
        valueProds: calcWithProducers,
        hash,
        hashProds
      };
    }


  }, [user]);
}
