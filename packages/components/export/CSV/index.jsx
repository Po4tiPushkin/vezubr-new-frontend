import React, { useEffect, useMemo } from 'react';
import { ExportToCsv } from 'export-to-csv';
import PropTypes from 'prop-types';

function ExportCSV({ getDataFunc, useExport, onFinishFunc, setLoadingStatusFunc, filename, title }) {
  useEffect(() => {
    const fetch = async () => {
      if (!useExport) {
        return null;
      }

      if (setLoadingStatusFunc) {
        setLoadingStatusFunc(true);
      }

      const data = await getDataFunc();

      if (setLoadingStatusFunc) {
        setLoadingStatusFunc(false);
      }

      const options = {
        fieldSeparator: ';',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: true,
        title,
        filename,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };

      const csvExporter = new ExportToCsv(options);

      if (Array.isArray(data) && data.length > 0) {
        csvExporter.generateCsv(data);
      } else {
        console.warn('List for export is empty');
      }

      onFinishFunc(true);
    };

    fetch();
  }, [useExport]);

  return null;
}

ExportCSV.propTypes = {
  getDataFunc: PropTypes.func.isRequired,
  onFinishFunc: PropTypes.func.isRequired,
  setLoadingStatusFunc: PropTypes.func,

  useExport: PropTypes.bool.isRequired,
  filename: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ExportCSV;
