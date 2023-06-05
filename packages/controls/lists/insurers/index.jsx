import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Contractor as ContractorService } from "@vezubr/services";
import { showError } from "@vezubr/elements";
import useParams from "@vezubr/common/hooks/useParams";
import { history } from "../../infrastructure";
import moment from "moment";
import useColumns from "./hooks/useColumns";
import useColumnsGenerator from "@vezubr/components/tableConfig/hooks/useColumnsGenerator";
import useFiltersActions from "./hooks/useFiltersActions";
import { Filters } from "@vezubr/components/tableFiltered";
import { VzTableFiltered } from "@vezubr/components";
import TableConfig from '@vezubr/components/tableConfig';
import { Insurers as InsurersService } from '@vezubr/services'
import { Utils } from '@vezubr/common/common';
const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const getParamsQuery = (params) => {
  return params;
};

const tableKey = `insurers-${APP}`;

const Insurers = (props) => {
  const { location } = history
  const dictionaries = useSelector(state => state.dictionaries);

  const [params, pushParams] = useParams({
    history,
    location,
    paramsDefault: {},
  });

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { itemsPerPage } = QUERY_DEFAULT;

  const { dataSource, total } = data;

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const response = await InsurersService.list()
      const dataSource = Utils.getIncrementingId(response, paramsQuery?.page)
      setData({ dataSource, total: dataSource.length });
      setLoadingData(false);
    } catch (e) {
      console.error(e);
      if (typeof e.message !== 'undefined') {
        showError(e);
        setLoadingData(false);
      }
    }
  };

  const oldColumns = useColumns({ dictionaries });
  const [columns, width] = useColumnsGenerator(tableKey, oldColumns);

  useEffect(() => {
    fetchData();
  }, [params]);

  const filtersActions = useFiltersActions({  });

  return (
    <div className="orders-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: `insurers`,
          filtersActions,
          title: 'Страховщики',
        }}
      />
      <VzTableFiltered.TableFiltered
        {...{
          tableKey,
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowKey: 'id',
          scroll: { x: width, y: 550 },
          paramKeys,
          paginatorConfig: {
            total,
            itemsPerPage,
          },
        }}
      />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
}

export default Insurers;
