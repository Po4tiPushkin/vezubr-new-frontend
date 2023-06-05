import React, { useEffect, useState } from 'react';
import { VzTableFiltered } from '@vezubr/components';
import { showError } from '@vezubr/elements';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import useParams from '@vezubr/common/hooks/useParams';
import * as Tariff from '@vezubr/tariff';
import { connect } from 'react-redux';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import { Tariff as TariffService } from '@vezubr/services';

import { useHistory } from 'react-router-dom';
import useRowClassName from './hooks/useRowClassName';
import { Utils } from '@vezubr/common/common';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const validateParams = (params) => {
  const paramsVal = {};
  if (params.page) {
    paramsVal.page = +params.page;
  }
  return { ...params,...paramsVal }
}

function TariffList(props) {
  const history = useHistory();
  const { location } = history;
  const { dictionaries, contractorId, user, info } = props;

  const [params, pushParams] = useParams({ history, location });

  const [loadingData, setLoadingData] = useState(false);

  const { territories } = dictionaries;

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [columns, width] = useColumns({ dictionaries });
  const rowClassName = useRowClassName();

  const isUserProducerHasItsOwnContour = Utils.isUserClientHasItsOwnContour(user.contourContractors);
  let isDisabledButton = false;
  if (info?.contours) {
    isDisabledButton = !(info?.contours.some((item) => item.id === isUserProducerHasItsOwnContour?.contour?.id));
  }

  const filtersActions = useFiltersActions({ contractorId, isDisabled: isDisabledButton });

  const { itemsPerPage } = QUERY_DEFAULT;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);

      try {
        const valParams = validateParams(params);
        const dataSource = await TariffService.listForContractor(contractorId, { ...QUERY_DEFAULT, ...valParams });
        const total = dataSource.length;
        const newData = dataSource.map(value => ({...value, params: value.param}))
        setData({ 
          dataSource: newData, 
          total 
        });
      } catch (e) {
        console.error(e);
        showError(e);
      }
      setLoadingData(false);
    };

    fetchData();
  }, [params]);

  return (
    <div className="counterparty-tariffs">
      <VzTableFiltered.Filters
        {...{
          params,
          pushParams,
          filterSetName: 'tariffs',
          filtersActions,
        }}
      />
      <VzTableFiltered.TableFiltered
        {...{
          params,
          pushParams,
          loading: loadingData,
          columns,
          rowClassName,
          responsive: false,
          expandedRowRender: (record) => {
            if (record.orderType === 'loaders_order') {
              return <Tariff.TableLoadersExpand costWithVat={user?.costWithVat} tariff={record} editable={false} dictionaries={dictionaries} />;
            }
            if (record.type === 1) {
              return <Tariff.TableHourlyExpand costWithVat={user?.costWithVat} tariff={record} editable={false} dictionaries={dictionaries} />;
            } else if (record.type === 3) {
              return <Tariff.TableFixedExpand costWithVat={user?.costWithVat} tariff={record} editable={false} dictionaries={dictionaries} />;
            }

            return null;
          },
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
    </div>
  );
}
const mapStateToProps = (state) => {
  let { dictionaries = {}, user = {} } = state;

  return {
    dictionaries,
    user
  };
};

export default connect(mapStateToProps)(TariffList);
