import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import { Icon as IconAnt } from '@vezubr/elements/antd';
import { GenericContracts, GenericElemDoc } from '@vezubr/components/genericContracts';
import _get from 'lodash/get';
import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

function TransportDocuments(props) {
  const { transport } = props;
  const { geozones } = useSelector((state) => state.dictionaries);

  const ownAgreementFile = (transport?.ownAgreementFile?.files || []).find((d) => d.isActual);

  const sanitaryList = [
    {
      title: t.common('sanitationContract'),
      value: transport?.hasSanitaryPassport ? t.common('yes') : t.common('no'),
    },
  ];
  if (transport?.hasSanitaryPassport) {
    sanitaryList.push({
      title: t.common('expireAt'),
      value:
        transport?.sanitaryPassportExpiresAtDate &&
        moment(transport.sanitaryPassportExpiresAtDate).format('DD.MM.YYYY'),
    });
  }
  const ownerDocs = [
    {
      title: t.trailer('regCertFrontSide'),
      value: _get(transport.registrationCertificateFrontSideFile, 'files[0].file'),
      image: true,
    },
    {
      title: t.trailer('regCertBackSide'),
      value: _get(transport.registrationCertificateReverseSideFile, 'files[0].file'),
      image: true,
    },
  ];
  if (transport?.ownerType > 1) {
    ownerDocs.push({
      title: t.trailer('rentContractFile'),
      value: _get(transport.rentContractFile, 'files[0].file'),
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
      show: !!(transport?.geozonePasses && transport?.geozonePasses.length),
      list: transport?.geozonePasses
        ? transport.geozonePasses.map((val, key) => {
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
      show: (transport?.ownerType > 1 && transport?.rentContractFile) || false,
      list: [
        {
          show: true,
          dates: true,
          list: [
            {
              title: t.trailer('rentStart'),
              value:
                transport?.rentContractStartAtDate && moment(transport?.rentContractStartAtDate).format('DD.MM.YYYY'),
            },
            {
              title: t.trailer('rentEnd'),
              value:
                transport?.rentContractFinishAtDate && moment(transport?.rentContractFinishAtDate).format('DD.MM.YYYY'),
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
          value: transport.photoFiles[0],
          image: true,
        },
        {
          title: t.order('photo'),
          value: transport.photoFiles[1],
          image: true,
        },
        {
          title: t.order('photo'),
          value: transport.photoFiles[2],
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

export default TransportDocuments;
