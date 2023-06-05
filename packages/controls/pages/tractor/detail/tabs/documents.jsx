import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import _get from 'lodash/get';
import React from 'react';

function TractorDocuments(props) {
  const { tractor } = props;

  const tabData = [
    {
      title: 'Фотография тягача',
      list: [
        {
          title: t.trailer('regCertFrontSide'),
          value: _get(tractor?.registrationCertificateFrontSideFile, 'files[0].file'),
          image: true,
        },
        {
          title: t.trailer('regCertBackSide'),
          value: _get(tractor?.registrationCertificateReverseSideFile, 'files[0].file'),
          image: true,
        },
        {
          title: t.trailer('rentContractFile'),
          value: tractor?.rentContractFile,
          image: true,
        },
        {
          dates: true,
          show: tractor?.rentContractFile,
          list: [
            {
              title: t.trailer('rentStart'),
              value: tractor?.rentContractStartAtDate,
            },
            {
              title: t.trailer('rentEnd'),
              value: tractor?.rentContractFinishAtDate,
            },
          ],
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

export default TractorDocuments;
