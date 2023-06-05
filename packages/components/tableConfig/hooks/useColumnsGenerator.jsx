import React, { useEffect, useState, useMemo } from 'react';
import { MD5 } from '@vezubr/common/utils';
import { VzTable } from '@vezubr/elements';
import { getDBConfig, setDBConfig } from '../utils';
import useFixLegacyConfig from './useFixLegacyConfig';
export default function useColumnsGenerator(tableKey, columnsInput = []) {

  const config = useFixLegacyConfig(getDBConfig(tableKey), tableKey)

  const columns = useMemo(() => {
    if (!config?.columns) {
      return columnsInput;
    }

    let newColumns = [];

    const columnsHash = columnsInput.reduce((colHash, item) => {
      if (item.key) {
        colHash[item.key] = item;
      }
      return colHash;
    }, {});

    for (const [key, value] of Object.entries(config.columns)) {
      if (value.extra === false) {
        newColumns.push({
          ...columnsHash[key],
          ...value,
          fixed: value.float,
        });
      }
    }

    return newColumns.sort((a, b) => (a.weight - b.weight));

  }, [columnsInput, config]);

  useEffect(() => {
    const hash = MD5(JSON.stringify(columnsInput.map(({ title, extra, export: exportInput = '', width, float, key }) => ({
      title, extra, width, float, exportInput, key
    }))));

    if (config?.hash === hash) {
      return;
    }
    const defaultColumns = columnsInput.reduce((colConf, item, index) => {
      if (item.key) {
        colConf[item.key] = {
          title: item.title,
          extra: false,
          width: item.width || 150,
          float: item.fixed || null,
          weight: index * 10,
          export: item.export
        };
      }

      return colConf;
    }, {});

    const configState = {
      hash,
      columns: defaultColumns,
      defaultColumns,
    };

    setDBConfig(tableKey, configState);

  }, [config?.hash, columnsInput, tableKey]);

  const [
    leftFixed,
    notFixed,
    rightFixed
  ] = [
      [],
      [],
      []
    ]

  for (let column of columns) {
    switch (column.fixed) {
      case ("left"): {
        leftFixed.push(column)
        break;
      }
      case ("right"): {
        rightFixed.push(column)
        break;
      }
      default: {
        notFixed.push(column)
        break;
      }
    }
  }


  return VzTable.useColumnsCalcWidth([
    ...leftFixed,
    ...notFixed,
    ...rightFixed,
  ]);
}
