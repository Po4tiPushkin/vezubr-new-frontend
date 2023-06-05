import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../../../infrastructure';

function useFiltersActions({
  setRegistry,
  registry,
  registryId,
  setUseExport,
  useReform,
  onDisbandRegistry,
  dataSource,
}) {
  const isNtek = registry?.isNtek;

  const actionsDocUploads = useMemo(() => {
    if ((typeof isNtek !== 'undefined' && !isNtek) || typeof isNtek === 'undefined') {
      return [
        {
          key: 'buttonAttachDownload',
          type: 'button',
          position: 'topRight',
          config: {
            id: 'registry-documents',
            icon: 'paymentIn',
            className: 'rounded box-shadow',
            content: <p className="no-margin">Документы для бухгалтерии</p>,
            onClick: () => {
              observer.emit(OBSERVER_ACTIONS.ACTION_ORDER_ACCOUNTING_DOCUMENTS);
            },
          },
        },
      ];
    }

    return [];
  }, [isNtek]);

  return useMemo(
    () => [
      //Actions
      {
        key: 'filterButtonExtra',
        type: 'filterButtonExtra',
        position: 'topRight',
      },
      ...actionsDocUploads,
      {
        key: 'filterButtonContext',
        type: 'buttonContext',
        position: 'topRight',
        config: {
          menuOptions: {
            list: [
              ...(useReform
                ? [
                    {
                      icon: 'xOrange',
                      onAction: onDisbandRegistry,
                      title: 'Расформировать данный реестр',
                    },
                  ]
                : []),
              // {
              //   icon: 'printOrange',
              //   onAction: () => void 0,
              //   title: 'Распечатать',
              // },
              {
                icon: 'settingsOrange',
                onAction: () => void 0,
                title: 'Столбцы',
              },
              {
                icon: 'excelOrange',
                onAction: () => {
                  setUseExport(true);
                },
                title: t.buttons('toExcel'),
              },
            ],
          },
        },
      },
    ],
    [actionsDocUploads, useReform, dataSource],
  );
}

export default useFiltersActions;
