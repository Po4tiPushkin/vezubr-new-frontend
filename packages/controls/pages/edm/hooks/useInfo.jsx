import React, { useMemo } from "react"
import _uniqBy from 'lodash/uniqBy';
import _get from 'lodash/get';
import moment from "moment";
import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { fileGetFileData } from "@vezubr/common/utils";
import { DocViewer } from '@vezubr/uploader';

const getArrivalTimeLeft = (endAt) => {

  const momentEndAt = moment(endAt)
  const daysLeft =
    momentEndAt.diff(moment(), 'days') ?
      momentEndAt.diff(moment(), 'days')
      + '\u00A0'
      + 'д'
      : ''
  const hoursLeft =
    (momentEndAt.diff(moment(), 'hours') % 24) ?
      (momentEndAt.diff(moment(), 'hours') % 24)
      + '\u00A0'
      + 'ч'
      : ''
  const minutesLeft =
    (momentEndAt.diff(moment(), 'minutes') % 60) ?
      (momentEndAt.diff(moment(), 'minutes') % 60)
      + '\u00A0'
      + 'м'
      : ''

  return `${daysLeft} ${hoursLeft} ${minutesLeft}`

}
const useInfo = ({ order = {} }) => {



  const info = useMemo(() => {

    const orderInfo =
      [
        {
          title: 'Адрес подачи/доставки',
          value: order.arrivalAddress || '-'
        },
        {
          title: 'Количество грузомест',
          value: order.cargoPlaceCount || 0
        },
        {
          title: 'Ожидаемое время прибытия ТС на точку',
          value: order.expectedArrivalAt ? getArrivalTimeLeft(order.expectedArrivalAt) :  '-'
        }
      ]

    const driverInfo =
      [
        {
          title: t.common('fio'),
          titleClass: 'thin',
          value: order.driverFullName,
          comment: true,
        },
        {
          title: t.common('phone'),
          titleClass: 'thin',
          masked: '+9 (999) 999-99-99',
          value: order.driverContactPhone,
          comment: true,
        },
      ];

    const vehicleInfo =
      [
        {
          title: t.common('brand'),
          titleClass: 'thin',
          value: order.markAndModel,
          comment: true,
        },
        {
          title: t.order('vehicle_number'),
          titleClass: 'thin',
          value: order.plateNumber,
          comment: true,
        },
      ];

    const infos = [
      {
        title: 'Информация о рейсе',
        subTitle: `Рейс № ${order.orderNr}`,
        data: {
          info: orderInfo
        }
      },
      {
        title: t.order('driverInfo'),
        data: {
          info:  driverInfo,
        }
      },
      {
        title: t.order('vehicleInfo'),
        data: {
          info: vehicleInfo,
        }
      },
    ];

    return infos;

  }, [order]);

  return info;

}

export default useInfo;