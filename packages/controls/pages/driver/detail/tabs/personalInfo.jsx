import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import React from 'react';

function DriverPersonalInfo(props) {
  const { driver } = props;

  const tabData = [
    {
      title: t.driver('personalInfo'),
      list: [
        {
          title: t.driver('livingAddress'),
          value: driver?.factAddress,
        },
        {
          title: t.driver('appMobPhone'),
          value: driver?.applicationPhone,
        },
        {
          title: t.driver('mobPhone'),
          value: driver?.contactPhone,
        },
        {
          title: t.driver('medBook'),
          value: driver?.sanitaryBookExpiresAtDate
            ? Utils.formatDate(driver?.sanitaryBookExpiresAtDate, 'DD/MM/YYYY')
            : 'Нет',
        },
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

export default DriverPersonalInfo;
