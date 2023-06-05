import React, { useCallback, useEffect, useState } from "react";
import { Contour as ContourService, Contragents } from '@vezubr/services/index.operator';
import ServiceForm from "../../forms/service-form";
import { VzForm } from '@vezubr/elements';
import { CONTOUR_MAIN_ID } from '@vezubr/common/constants/constants';

function mainContourUnshift(contoursIdsInput) {
  let contoursIds = [...contoursIdsInput];

  if (contoursIds.indexOf(CONTOUR_MAIN_ID) !== -1) {
    contoursIds = contoursIds.filter((id) => id !== CONTOUR_MAIN_ID);
    contoursIds.unshift(CONTOUR_MAIN_ID);
  }

  return contoursIds;
}

const Service = (props) => {
  const { id, dictionaries, type, fetchData, ...otherProps } = props;
  const [contours, setContours] = useState([]);
  const [info, setInfo] = useState(null);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const contoursInput = (await ContourService.list())?.data?.contours || [];
        let serviceInfo = (await Contragents[`${type}ServiceInfo`]({ [`${type}Id`]: id })).data;
        if (type === 'client') {
          serviceInfo = serviceInfo.serviceInfo
        };
        serviceInfo.contourIds = mainContourUnshift(
          (serviceInfo?.contourContractors || []).map((contour) => contour?.contour?.id),
        );
        setInfo(serviceInfo)
        setContours(contoursInput);
      } catch (e) {
        console.error(e);
      }
    }
    fetchInfo();
  }, [type]);

  const onSave = useCallback(async (form) => {
    try {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);
      // if (type === 'producer') {
      //   await Contragents.producerChangeServiceInfo({...values, producerId: id, });
      // }
      // else if (type === 'client') {
      //   await Contragents.clientChangeServiceInfo({...values, clientId: id});
      // };
      await Contragents[`${type}ChangeServiceInfo`]({ ...values, [`${type}Id`]: id, isVatPayer: info?.isVatPayer})
      if (fetchData) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  }, [type, info])

  if (!info) {
    return null
  };
  return (
    <ServiceForm {...otherProps} contours={contours} dictionaries={dictionaries} onSave={onSave} values={info} />
  )
}

export default Service;