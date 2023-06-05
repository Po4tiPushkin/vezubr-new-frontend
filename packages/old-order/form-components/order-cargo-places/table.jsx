import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { observer } from 'mobx-react';

import { OrderCargoPlacesContext } from '../../context';
import { createTableRow } from './components/createTableRow';
import { CLS_ROOT } from './constant';

import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';

import TableCount from './tableCount';

const CLS = CLS_ROOT;

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

function OrderCargoPlacesTable(props) {
  const { params, pushParams, dataSource } = props;
  const { fieldNameStore, fieldNameAddressIn, fieldNameAddressOut, cargoPlaceStatuses } = useContext(
    OrderCargoPlacesContext,
  );

  const [columns, width] = useColumns();

  const filtersActions = useFiltersActions({ cargoPlaceStatuses });

  const components = useMemo(
    () => ({
      body: {
        row: createTableRow({ fieldNameAddressIn, fieldNameStore, fieldNameAddressOut }),
      },
    }),
    [fieldNameAddressIn, fieldNameStore, fieldNameAddressOut],
  );

  return (
    <div className={`${CLS}__body`}>
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'cargo_place',
          filtersActions,
        }}
      />

      <TableFiltered
        {...{
          params,
          pushParams,
          columns,
          dataSource,
          components,
          rowKey: 'id',
          scroll: { x: width, y: 400 },
          paramKeys,
          paginatorConfig: {
            local: true,
            itemsPerPage: 70,
          },
          responsive: false,
          title: () => <TableCount count={dataSource.length}  />,
        }}
      />


    </div>
  );
}

OrderCargoPlacesTable.propTypes = {
  params: PropTypes.object,
  pushParams: PropTypes.func,
  dataSource: PropTypes.arrayOf(PropTypes.object),
};

export default observer(OrderCargoPlacesTable);
