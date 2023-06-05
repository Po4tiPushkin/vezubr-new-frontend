import React, { useMemo, useCallback } from "react"
import _uniqBy from 'lodash/uniqBy';
import _get from 'lodash/get';
import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { fileGetFileData, fileOpenInWindow } from "@vezubr/common/utils";
import { DocViewer } from '@vezubr/uploader';
import moment from 'moment';
import { Ant } from '@vezubr/elements';

const usePreparatosInfo = ({ dictionaries, order = {}, reportFiles }) => {

  const getOldNewValue = useCallback((item, documentItem, value, children) => {
    return documentItem && item &&
      documentItem?.[value] && documentItem?.[value] !== item?.[value]
      ?
      <>
        <div className="flexbox preparators-single__old">{documentItem?.[value]}</div>
        <div className="flexbox preparators-single__arrow"> {`->`} </div>
        {children}
        <div className="flexbox preparators-single__hint">
          <Ant.Tooltip placement="right" title={t.order('newValueHint')}>
            <Ant.Icon type={'info-circle'} />
          </Ant.Tooltip>
        </div>
      </>
      :
      children
  }, [])

  const preparatorsInfos = useMemo(() => {

    const { vehicle, producer, brigadier, loaders, client, performers, documentData } = order;
    const { driver, photo: photoVehicle } = vehicle || {};
    const { driver: documentDriver, transports = [] } = documentData || {};
    const documentTransport = transports?.[0];
    const { photo: photoDriver } = driver || {};
    const { orderInsurance } = performers[0] || {}
    const { insurerContract, insuranceFile, insurancePremium } = orderInsurance || {}
    const insuranceInfo = orderInsurance ? [
      {
        title: 'Страховая компания',
        value: insurerContract?.insurer?.title || '-',
        comment: true
      },
      {
        title: 'Страховая премия',
        value: Utils.moneyFormat(insurancePremium),
        comment: true
      },
      {
        title: 'Страховой сертификат',
        comment: true,
        value: (
          <button
            className={`report-file-button ${insuranceFile ? '' : 'disabled'}`}
            onClick={() => {
              fileOpenInWindow(`${window.API_CONFIGS[APP].host.replace(/\/$/, '') + insuranceFile?.downloadUrl}`)
            }}
          >
            Просмотреть
          </button>
        ),
      },
    ] : []

    const driverInfo =
      [
        {
          title: t.common('fio'),
          titleClass: 'thin',
          value: getOldNewValue(
            driver,
            documentDriver,
            'name',
            <div className='flexbox order-driver__name-photo preparators-single__item'>
              {`${_get(driver, 'name')} ${_get(driver, 'surname')}`}
              {photoDriver &&
                <DocViewer
                  label={photoDriver.originalName}
                  key={photoDriver.id}
                  editable={false}
                  withPreview={false}
                  fileData={fileGetFileData(photoDriver)}
                />}
            </div>
          ),
          comment: true,
        },
        {
          title: t.common('phone'),
          titleClass: 'thin',
          input: true,
          masked: '+9 (999) 999-99-99',
          value: _get(driver, 'contactPhone'),
          preparatorOldNew: documentDriver?.contactPhone &&
            documentDriver?.contactPhone !== driver?.contactPhone
            ? [documentDriver?.contactPhone, driver?.contactPhone]
            : null
          ,
          comment: true,
        },
        {
          title: t.common('passport'),
          titleClass: 'thin',
          value: driver?.passportId,
          comment: true,
          //
        },
        {
          title: t.common('licenceNumber'),
          titleClass: 'thin',
          value: _get(driver, 'driverLicenseId'),
          comment: true,
          //
        },
      ];

    const loaderInfo = (loader) => ([
      {
        title: t.common('fio'),
        titleClass: 'thin',
        value: <div className='flexbox order-driver__name-photo'>
          {`${_get(loader, 'name')} ${_get(loader, 'surname')}`}
          {loader?.photoFile &&
            <DocViewer
              label={loader?.photoFile?.originalName}
              key={loader?.photoFile?.id}
              editable={false}
              withPreview={false}
              fileData={fileGetFileData(loader?.photoFile)}
            />}
        </div>,
        comment: true,
      },
      {
        title: t.common('phone'),
        titleClass: 'thin',
        input: true,
        masked: '+9 (999) 999-99-99',
        value: _get(loader, 'contactPhone') || _get(loader, 'applicationPhone') || '',
        comment: true,
      },
      {
        title: 'Паспортные данные',
        expand: true,
        className: 'order-preparators-collapse',
        value: [[
          {
            title: t.common('passport'),
            titleClass: 'thin',
            value: loader?.passportId,
            comment: true,
          },
          {
            title: 'Кем выдан',
            titleClass: 'thin',
            value: loader?.passportIssuedBy,
            comment: true,
          },
          {
            title: 'Код подразделения',
            titleClass: 'thin',
            value: loader?.passportUnitCode,
            comment: true,
          },
          {
            title: 'Дата выдачи',
            titleClass: 'thin',
            value: moment(loader?.passportIssuedAtDate).format('DD.MM.YYYY'),
            comment: true,
          },
        ]]
      },
    ])

    const producerInfo =
      [
        {
          title: t.common('legalName'),
          titleClass: 'thin',
          value: `${_get(producer, 'title', '') || '-'}`,
          comment: true,
        },
        {
          title: t.common('inn'),
          titleClass: 'thin',
          value: _get(producer, 'inn', ''),
          comment: true,
        },
      ];

    const vehicleInfo =
      [
        {
          title: t.common('brand'),
          titleClass: 'thin',
          value: getOldNewValue(
            vehicle,
            documentTransport,
            'markAndModel',
            <div className='flexbox order-driver__name-photo preparators-single__item'>
              {`${_get(vehicle, 'markAndModel') || '-'}`}
              {photoVehicle &&
                <DocViewer
                  label={photoVehicle.originalName}
                  key={photoVehicle.id}
                  editable={false}
                  withPreview={false}
                  fileData={fileGetFileData(photoVehicle)}
                />}
            </div>),
          comment: true,
        },
        {
          title: t.order('vehicle_number'),
          titleClass: 'thin',
          value: getOldNewValue(
            vehicle,
            documentTransport,
            'plateNumber',
            <div className="preparators-single__item">{_get(vehicle, 'plateNumber')}</div>

          ),
          comment: true,
        }
      ];

    const brigadierInfo =
      [
        {
          title: t.common('fio'),
          titleClass: 'thin',
          value: <div className='flexbox order-driver__name-photo'>
            {`${_get(brigadier, 'name')} ${_get(brigadier, 'surname')}`}
            {brigadier?.photoFile &&
              <DocViewer
                label={brigadier?.photoFile?.originalName}
                key={brigadier?.photoFile?.id}
                editable={false}
                withPreview={false}
                fileData={fileGetFileData(brigadier?.photoFile)}
              />}
          </div>,
          comment: true,
        },
        {
          title: t.common('phone'),
          titleClass: 'thin',
          input: true,
          masked: '+9 (999) 999-99-99',
          value: _get(brigadier, 'contactPhone') || _get(brigadier, 'applicationPhone') || '',
          comment: true,
        },
        {
          title: 'Паспортные данные',
          expand: true,
          className: 'order-preparators-collapse',
          value: [[
            {
              title: t.common('passport'),
              titleClass: 'thin',
              value: _get(brigadier, 'passportId') || '',
              comment: true,
            },
            {
              title: 'Кем выдан',
              titleClass: 'thin',
              value: brigadier?.passportIssuedBy,
              comment: true,
            },
            {
              title: 'Код подразделения',
              titleClass: 'thin',
              value: brigadier?.passportUnitCode,
              comment: true,
            },
            {
              title: 'Дата выдачи',
              titleClass: 'thin',
              value: moment(brigadier?.passportIssuedAtDate).format('DD.MM.YYYY'),
              comment: true,
            },
          ]]
        },

      ];

    const clientInfo =
      [
        {
          title: t.common('legalName'),
          titleClass: 'thin',
          value: `${_get(client, 'title', '') || '-'}`,
          comment: true,
        },
        {
          title: t.common('inn'),
          titleClass: 'thin',
          value: _get(client, 'inn', ''),
          comment: true,
        },
      ];

    const infos = [
      ...[
        APP !== 'producer'
          ?
          {
            title: t.order('transferInfo'),
            data: {
              image: _get(producer, 'logoFile.downloadUrl'),
              info: producer ? producerInfo : [],
              title: 'На страницу Перевозчика',
              type: 'counterparty',
              id: producer?.id,
            }
          }
          :
          {}
      ],
      ...[APP !== 'client'
        ?
        {
          title: 'Сведения о заказчике',
          data: {
            image: _get(client, 'logoFile.downloadUrl'),
            info: client ? clientInfo : [],
            type: 'counterparty',
            title: 'На страницу Заказчика',
            id: client?.id,
          }
        }
        :
        {}
      ],
      {
        title: t.order('driverInfo'),
        data: {
          image: _get(driver, 'photoFile.downloadUrl'),
          info: order?.type !== 2 ? driverInfo : [],
          ...(APP !== 'client' ?
            {
              type: 'drivers',
              title: 'На страницу водителя',
              id: driver?.id,
            }
            :
            {}
          ),
        },
      },
      {
        title: t.order('vehicleInfo'),
        data: {
          image: _get(vehicle, 'photoFile.downloadUrl'),
          info: order?.type !== 2 ? vehicleInfo : [],
          ...(APP !== 'client' ?
            {
              title: 'На страницу ТС',
              type: vehicle?.constructionType === '1' ? 'transports' : 'tractors',
              id: vehicle?.id,
            }
            :
            {}
          ),
        }
      },
      ...loaders?.map((loader, index) => ({
        title: t.order('loaderOnOrder').replace('{param}', index + 1),
        data: {
          image: _get(loader, 'photoFile.downloadUrl'),
          info: order?.type === 2 ? loaderInfo(loader) : [],
          ...(APP !== 'client' ?
            {
              title: 'На страницу специалиста',
              type: 'loaders',
              id: loader?.id,
            }
            :
            {}
          ),

        }
      })) || [],
      ...[
        (order?.performers[0]?.isInsuranceRequired) ? {
          title: 'Страхование',
          data: {
            info: insuranceInfo
          }
        } : {}
      ],
      ...[
        (order?.orderUiState?.state >= 201 && reportFiles && order?.performers?.some((item) => item.reportFile)) ?
          {
            title: 'Заявки по рейсу',
            data: {
              info: reportFiles,
            }
          }
          :
          {}
      ],

    ];

    return infos;

  }, [order, dictionaries, reportFiles]);

  return preparatorsInfos;

}

export default usePreparatosInfo;