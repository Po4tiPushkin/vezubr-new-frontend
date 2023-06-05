import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import React from 'react';
import { useSelector } from 'react-redux'

function LoaderPersonalInfo(props) {
  const { loader } = props;
  const dictionaries = useSelector((state) => state.dictionaries)

  const tabData = [
    {
      title: t.driver('personalInfo'),
      list: [
        {
          title: t.driver('livingAddress'),
          value: loader?.factAddress,
        },
        {
          title: t.driver('appMobPhone'),
          value: loader?.applicationPhone,
        },
        {
          title: t.driver('mobPhone'),
          value: loader?.contactPhone,
        },
        {
          title: t.driver('medBook'),
          value: loader?.sanitaryBookExpiresAtDate && loader?.hasSanitaryBook
            ? Utils.formatDate(loader?.sanitaryBookExpiresAtDate, 'DD/MM/YYYY')
            : 'Нет',
        },
        {
          title: t.driver('specialities'),
          value: loader?.specialities?.map(val => {
            return {name: dictionaries.loaderSpecialities?.find(item => item.id == val)?.title}
          })
        },
        ...[
          loader?.slingerLicenceValidTill ? {
            title: t.driver('slingerLicenceValidTill'),
            value: loader?.slingerLicenceValidTill
              ? Utils.formatDate(loader?.slingerLicenceValidTill, 'DD/MM/YYYY')
              : 'Нет',
          } : {},
          loader?.forkliftOperatorLicenceValidTill ? {
            title: t.driver('forkliftOperatorLicenceValidTill'),
            value: loader?.forkliftOperatorLicenceValidTill
              ? Utils.formatDate(loader?.forkliftOperatorLicenceValidTill, 'DD/MM/YYYY')
              : 'Нет',
          } : {},
          loader?.stackerLicenceValidTill ? {
            title: t.driver('stackerLicenceValidTill'),
            value: loader?.stackerLicenceValidTill
              ? Utils.formatDate(loader?.stackerLicenceValidTill, 'DD/MM/YYYY')
              : 'Нет',
          } : {},
        ]
      ],
    },
  ];
  return (
    <div key={0}>
      {tabData?.map((group, groupIndex) => {
        return (
          <div key={groupIndex}>
            <div className={'info-title'}>{group?.title}</div>
            <hr />
            <div className={'padding-16 padding-top-0'}>
              <OrderSidebarInfos data={group?.list || []} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LoaderPersonalInfo;
