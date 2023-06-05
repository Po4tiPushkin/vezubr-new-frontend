import React, { useMemo } from 'react';
import { Icon as IconAnt } from '@vezubr/elements/antd';

function getDocs(registry) {
  if (!registry) {
    return [];
  }

  const genActs1c = [];

  if (registry.act1cExportFile && Object.keys(registry.act1cExportFile).length > 0) {
    genActs1c.push({
      name: 'Акт выполненных работ (краткая форма)',
      editMode: false,
      supportTypes: 'XML',
      useIcon: <IconAnt type="file-excel" />,
      doc: registry?.act1cExportFile || {},
    });
  }

  if (registry.actDetails1cExportFile && Object.keys(registry.actDetails1cExportFile).length > 0) {
    genActs1c.push({
      name: 'Акт выполненных работ (полная форма)',
      editMode: false,
      supportTypes: 'XML',
      useIcon: <IconAnt type="file-excel" />,
      doc: registry?.actDetails1cExportFile || {},
    });
  }

  const genActs = [];

  if (registry.actPdfFile && Object.keys(registry.actPdfFile).length > 0) {
    genActs.push({
      name: 'Акт выполненных работ',
      editMode: false,
      supportTypes: 'PDF',
      useIcon: <IconAnt type="file-pdf" />,
      doc: registry?.actPdfFile || {},
    });
  }

  if (registry.actDetailsPdfFile && Object.keys(registry.actDetailsPdfFile).length > 0) {
    genActs.push({
      name: 'Реестр',
      editMode: false,
      supportTypes: 'PDF',
      useIcon: <IconAnt type="file-pdf" />,
      doc: registry?.actDetailsPdfFile || {},
    });
  }

  return [
    {
      section: {
        className: 'group-highlight',
      },
      items: [
        {
          section: {
            name: 'Формат 1С',
            className: 'inline',
            description: genActs1c.length === 0 && 'Файлы не были сгенерированы',
          },
          items: genActs1c,
        },
        {
          section: {
            name: 'Формат PDF',
            className: 'inline',
            description: genActs.length === 0 && 'Файлы не были сгенерированы',
          },
          items: genActs,
        },
      ],
    },
    {
      section: {
        name: 'Документы для загрузки',
      },
      items: [
        {
          name: 'Акт выполненных работ',
          key: 'producerActFile',
          type: 1,
          editMode: true,
          supportTypes: 'PDF',
          useIcon: <IconAnt type="file-pdf" />,
          doc: registry?.producerActFile || {},
        },
        {
          name: 'Счет фактура',
          key: 'producerInvoiceFile',
          type: 2,
          editMode: true,
          supportTypes: 'PDF',
          useIcon: <IconAnt type="file-pdf" />,
          doc: registry?.producerInvoiceFile || {},
        },
      ],
    },
  ];
}

export default getDocs;
