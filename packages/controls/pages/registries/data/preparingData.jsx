import React from 'react';
import Utils from '@vezubr/common/common/utils';

function preparingData(dataSource) {
  const returnData = [];

  const params = Utils.queryString(location.search);

  const exampleGlued = typeof params['glued'] !== 'undefined';

  for (let index = 0; index < dataSource.length; index++) {
    const dataItem = dataSource[index];

    if (
      dataItem.agentReportExcelFile ||
      dataItem.agentReportExcelFileId ||
      dataItem.agentReportPdfFile ||
      dataItem.agentReportPdfFileId ||
      (exampleGlued && index === 0)
    ) {
      returnData.push({ ...dataItem, _gluedType: 'bottom' });
      returnData.push({ ...dataItem, _gluedType: 'top' });
    } else {
      returnData.push(dataItem);
    }
  }

  return returnData;
}

export default preparingData;
