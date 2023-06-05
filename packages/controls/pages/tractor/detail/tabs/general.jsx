import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import React from 'react';
import moment from 'moment';
function TractorGeneral(props) {
  const { tractor } = props;

  const tabData = [
    {
      title: t.trailer('generalInfo'),
      list: [
        {
          title: t.order('exploatation'),
          value: tractor?.exploitationStartDate && moment(tractor.exploitationStartDate).format('DD.MM.YYYY'),
        },
        {
          title: t.trailer('regNum'),
          value: tractor?.plateNumber,
        },
        {
          title: 'VIN',
          value: tractor?.vin,
        },
        {
          title: t.trailer('markAndModel'),
          value: tractor?.markAndModel,
        },
        {
          title: t.trailer('yom'),
          value: tractor?.yearOfManufacture,
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

export default TractorGeneral;
