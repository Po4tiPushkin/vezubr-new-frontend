import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import { Icon as IconAnt } from '@vezubr/elements/antd';
import { GenericContracts, GenericElemDoc } from '@vezubr/components/genericContracts';
import _get from 'lodash/get';
import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

function TrailerDocuments(props) {
  const { trailer } = props;
  const { geozones } = useSelector((state) => state.dictionaries);

  const ownAgreementFile = (trailer?.ownAgreementFile?.files || []).find((d) => d.isActual);

  const sanitaryList = [
    {
      title: t.common('sanitationContract'),
      value: trailer?.hasSanitaryPassport ? t.common('yes') : t.common('no'),
    },
  ];
  if (trailer?.hasSanitaryPassport) {
    sanitaryList.push({
      title: t.common('expireAt'),
      value:
        trailer?.sanitaryPassportExpiresAtDate && moment(trailer.sanitaryPassportExpiresAtDate).format('DD.MM.YYYY'),
    });
  }
  const ownerDocs = [
    {
      title: t.trailer('regCertFrontSide'),
      value: _get(trailer.registrationCertificateFrontSideFile, 'files[0].file'),
      image: true,
    },
    {
      title: t.trailer('regCertBackSide'),
      value: _get(trailer.registrationCertificateReverseSideFile, 'files[0].file'),
      image: true,
    },
  ];
  if (trailer?.ownerType > 1) {
    ownerDocs.push({
      title: t.trailer('rentContractFile'),
      value: _get(trailer.rentContractFile, 'files[0].file'),
      image: true,
    });
  }

  const tabData = [
    {
      title: t.common('sanitation'),
      show: true,
      list: sanitaryList,
    },
    {
      title: t.common('Пропуска'),
      dates: true,
      show: !!(trailer?.geozonePasses && trailer?.geozonePasses.length),
      list: trailer?.geozonePasses
        ? trailer.geozonePasses.map((val, key) => {
            return {
              title: geozones[val.id]?.name,
              value: `Годен до: ${val?.expiresOnDate && moment(val?.expiresOnDate).format('DD.MM.YYYY')}`,
            };
          })
        : [],
    },
    {
      title: t.order('ownerDocs'),
      show: true,
      list: ownerDocs,
    },
    {
      column: false,
      title: 'Договоры',
      show: !!ownAgreementFile,
      custom: (
        <GenericContracts>
          <GenericElemDoc
            fileName={'Согласие собственника арендуемого имущества (физического лица)'}
            doc={ownAgreementFile}
            useIcon={<IconAnt type="file-pdf" />}
          />
        </GenericContracts>
      ),
    },
    {
      column: true,
      show: (trailer?.ownerType > 1 && trailer?.rentContractFile) || false,
      list: [
        {
          show: true,
          dates: true,
          list: [
            {
              title: t.trailer('rentStart'),
              value: trailer?.rentContractStartAtDate && moment(trailer?.rentContractStartAtDate).format('DD.MM.YYYY'),
            },
            {
              title: t.trailer('rentEnd'),
              value:
                trailer?.rentContractFinishAtDate && moment(trailer?.rentContractFinishAtDate).format('DD.MM.YYYY'),
            },
          ],
        },
      ],
    },
    {
      title: t.order('carPhotos'),
      show: true,
      list: [
        {
          title: t.order('photo'),
          value: trailer.photoFiles[0],
          image: true,
        },
        {
          title: t.order('photo'),
          value: trailer.photoFiles[1],
          image: true,
        },
        {
          title: t.order('photo'),
          value: trailer.photoFiles[2],
          image: true,
        },
      ],
    },
  ];

  return (
    <div key={0}>
      {tabData?.map((group, groupIndex) => {
        if (!group.show) return null;
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

export default TrailerDocuments;
