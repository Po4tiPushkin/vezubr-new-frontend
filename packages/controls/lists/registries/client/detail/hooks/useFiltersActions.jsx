import React, { useCallback, useMemo } from 'react';
import getDocs from '../data/getDocs';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../../../infrastructure';

function useFiltersActions({ registry, registryId, setUseExport }) {
  const actionsDocUploads = useMemo(() => {
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
}, []);
  const docs = useMemo(() => (getDocs(registry)), [registry]);
  const uploadDoc = useCallback(async (docSaving, docInfo) => docSaving, [registryId, registry]);

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
              // {
              //   icon: 'printOrange',
              //   onAction: () => void 0,
              //   title: 'Распечатать',
              // },
              {
                icon: 'settingsOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE);
                },
                title: 'Изменить отображение колонок',
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
    [docs, uploadDoc],
  );
}

export default useFiltersActions;
