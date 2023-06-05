import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VzTableFiltered } from '@vezubr/components';
import { Address as AddressService } from '@vezubr/services';
import { showError, VzEmpty } from '@vezubr/elements';
import useFiltersActions from './hooks/useFiltersActions';
import useColumns from './hooks/useColumns';
import { history } from '../../../../../infrastructure';
import useParams from '@vezubr/common/hooks/useParams';
import { uuid } from '@vezubr/common/utils';
import moment from 'moment';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const getParamsQuery = (params) => {

  const paramsQuery = { ...params };

  return paramsQuery;
};

function AddressHistory(props) {
  const { dictionaries, match } = props;
  const { location } = history;
  const id = ~~match.params.id;

  const [params, pushParams] = useParams({ 
    history, 
    location,
    paramsDefault: {
      createdAt: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      creationDateTo: moment().add(1, 'days').format('YYYY-MM-DD'),
    },  
  });

  const [loadingData, setLoadingData] = useState(false);

  const [columns, width] = useColumns({ dictionaries });

  const { itemsPerPage } = QUERY_DEFAULT;

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
    fieldTypesList: []
  });

  const { dataSource, total, fieldTypesList } = data;

  const fetchData = async () => {
    setLoadingData(true);

    try {
      const response = await AddressService.journalList({ ...QUERY_DEFAULT, ...getParamsQuery(params), id });
      const dataSource = (response?.data || []).map(item => ({...item, uuid: uuid()}));

      const total = response.count || 0;

      const fieldTypesList = response.fieldTypes || [];

      setData({ dataSource, total, fieldTypesList });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const filtersActions = useFiltersActions({
    dictionaries,
    history,
    fieldTypesList
  });

  return (
    <div className="orders-table-container">
      {dataSource ? (
        <div>
          <VzTableFiltered.Filters
            {...{
              params,
              pushParams,
              paramKeys,
              filterSetName: 'address-history',
              filtersActions,
            }}
          />
          <VzTableFiltered.TableFiltered
            {...{
              params,
              pushParams,
              loading: loadingData,
              columns,
              dataSource,
              rowKey: 'uuid',
              scroll: { x: width, y: 550 },
              paramKeys,
              paginatorConfig: {
                total,
                itemsPerPage,
              },
              responsive: false,
            }}
          />
        </div>
      ) : (
        <div className={'white-container connected-order flexbox column cargo-history__height'}>
          <VzEmpty className={'margin-top-100'} vzImageName={'emptyDocuments'} title={'История заказа'} />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  let { dictionaries } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(AddressHistory);
