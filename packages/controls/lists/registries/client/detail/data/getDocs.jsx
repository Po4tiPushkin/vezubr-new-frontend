import React from 'react';
import { Ant } from '@vezubr/elements';

const IconAnt = Ant.Icon;

function getDocs(registry) {
  if (!registry) {
    return [];
  }
  const {
    actExcelFile,
    actDetailsExcelFile,
    actPdfFile,
    actDetailsPdfFile,
    producerActFile,
    producerInvoiceFile,
  } = registry;

  const genActs1c = [];
  const genActs = [];

  if (actExcelFile && Object.keys(actExcelFile).length > 0) {
    genActs1c.push({
      name: 'Акт выполненных работ (краткая форма)',
      editMode: false,
      supportTypes: 'XML',
      useIcon: <IconAnt type="file-excel" />,
      doc: actExcelFile,
    });
  }
  if (actDetailsExcelFile && Object.keys(actDetailsExcelFile).length > 0) {
    genActs1c.push({
      name: 'Акт выполненных работ (полная форма)',
      editMode: false,
      supportTypes: 'XML',
      useIcon: <IconAnt type="file-excel" />,
      doc: actDetailsExcelFile,
    });
  }

  if (actPdfFile && Object.keys(actPdfFile).length > 0) {
    genActs.push({
      name: 'Акт выполненных работ',
      editMode: false,
      supportTypes: 'PDF',
      useIcon: <IconAnt type="file-pdf" />,
      doc: actPdfFile || {},
    });
  }
  if (actDetailsPdfFile && Object.keys(actDetailsPdfFile).length > 0) {
    genActs.push({
      name: 'Реестр',
      editMode: false,
      supportTypes: 'PDF',
      useIcon: <IconAnt type="file-pdf" />,
      doc: actDetailsPdfFile,
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
  ];
}

export default getDocs;
