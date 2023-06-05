import React, { useMemo } from "react"
import t from '@vezubr/common/localization';
import moment from 'moment';
const useInfo = ({ orderData, dictionaries, selected }) => {
  const info = useMemo(() => {
    if (!orderData) {
      return [];
    };
    return [
      [
        {
          title: t.documents('document.status'),
          value: dictionaries?.transportOrderStatuses?.[selected?.orderUiState],
          span: 16,
          wrapperClasses: '',
          type: 'select'
        },
        {
          title: t.documents('document.vehicleType'),
          value: dictionaries?.vehicleTypes?.find(el => el.id === orderData?.requiredVehicleTypeId)?.name || '-',
          span: 8,
          wrapperClasses: 'document-wrapper--last',
        },
      ],
      [
        {
          title: t.documents('document.plateNumber'),
          value: selected?.vehiclePlateNumber,
          span: 6,
          wrapperClasses: 'document-wrapper--small',
        },
        {
          title: t.documents('document.driverName'),
          value: orderData
            ?
            `${orderData?.driverLicenseSurname} ${orderData?.driverLicenseName} ${orderData?.driverPatronymic}`
            :
            '',
          span: 10,
          wrapperClasses: 'document-wrapper--big',
        },
        {
          title: t.documents('document.dateAndTime'),
          value: moment(orderData?.toStartAt)?.format('DD.MM.YYYY HH:mm:ss'),
          span: 8,
          wrapperClasses: 'document-wrapper--last',
        },

      ],
      [
        {
          title: t.documents('document.address'),
          value: selected?.firstAddress,
          span: 24,
          wrapperClasses: '',
          type: 'select'
        },
      ],
      [
        {
          title: t.documents('document.address2'),
          value: selected?.lastAddress,
          span: 24,
          wrapperClasses: '',
          type: 'select'
        },
      ],
    ]
  }, [orderData, dictionaries, selected])
  return info;
}

export default useInfo;