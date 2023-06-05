import useParamsState from '@vezubr/common/hooks/useParamsState';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import { useHistory } from 'react-router-dom';
import * as Services from '@vezubr/services'
import { showError, VzTable } from '@vezubr/elements';
import moment from 'moment'
import LinkWithBack from '../link/linkWithBack';
import { Filters, TableFiltered } from '../tableFiltered';
import { SCHEDULE_ENTITIES } from '@vezubr/common/constants/constants';

const QUERY_DEFAULT = {
  startAt: moment().startOf('day'),
  endAt: moment().endOf('day'),
  itemsPerPage: 100,
  typeOfPeriod: 'day'
};

const paramKeys = {
  date: 'date',
  endAt: 'endAt',
  startAt: 'startAt',
  fullName: 'fullName',
  typeOfPeriod: 'typeOfPeriod',
  page: 'page',
  itemsPerPage: 'itemsPerPage',
};

const getParamsQuery = (params, entity) => {
  const paramsQuery = { ...params };

  if (paramsQuery.typeOfPeriod) {
    if (paramsQuery.typeOfPeriod == 'day' && paramsQuery.startAt) {
      paramsQuery.endAt = paramsQuery.startAt;
    }
    delete paramsQuery.typeOfPeriod;
  }

  if (paramsQuery.startAt) {
    paramsQuery.startAt = moment(paramsQuery.startAt).startOf('day').format('DD.MM.YYYYTHH:mm:ssZ')
  }

  if (paramsQuery.endAt) {
    paramsQuery.endAt = moment(paramsQuery.endAt).endOf('day').format('DD.MM.YYYYTHH:mm:ssZ')
  }

  if (paramsQuery.page) {
    paramsQuery.page = +paramsQuery.page
  }

  if (entity == SCHEDULE_ENTITIES.vehicles) {
    delete paramsQuery.name;
    delete paramsQuery.surname;
    delete paramsQuery.patronymic;
  } else {
    delete paramsQuery.plateNumber;
    if (paramsQuery.name || paramsQuery.surname || paramsQuery.patronymic) {
      paramsQuery.fullName = `${(paramsQuery.name|| '') + ' ' }${(paramsQuery.surname || '') + ' ' }${(paramsQuery.patronymic || '') + ' '}`.trim()
      delete paramsQuery.name;
      delete paramsQuery.surname;
      delete paramsQuery.patronymic;
    }
  }

  return paramsQuery;
};

function Table(props) {
  const history = useHistory();
  const { location } = history;
  const { dictionaries, entity = SCHEDULE_ENTITIES.drivers } = props;

  const [params, pushParams] = useParamsState({ history, location, paramsName: entity, paramsDefault: QUERY_DEFAULT });

  const [loadStamp, setLoadStamp] = useState(Date.now());

  const reloadData = useCallback(() => {
    setLoadStamp(Date.now());
  }, [setLoadStamp]);

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const columns = useColumns({ dictionaries, entity });

  const onSelectPeriod = useCallback((value) => {
    const newParams = {
      ...params,
      startAt: moment().startOf('day'),
      endAt: moment().startOf('day').add(1, value).endOf('day'),
      typeOfPeriod: value
    }
    pushParams(newParams)
  }, [params])

  const filtersActions = useFiltersActions({params, entity, onSelectPeriod});

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params, entity);
    try {
      const calendar = await Services[entity].calendar({ ...QUERY_DEFAULT, ...paramsQuery });
      setData({dataSource: calendar?.data, total: calendar.itemsCount});
    } catch (e) {
      console.error(e);
      showError(e);
    } finally {
      setLoadingData(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, [params, loadStamp]);

  const timeColumns = React.useMemo(() => {
    let dates = []
    let columnsInDay, columnsInWeek, columnsInMonth = []
    const typeIsDay = params.typeOfPeriod == 'day'
    const typeIsWeek = params.typeOfPeriod == 'week'
    const paramsQuery = getParamsQuery(params, entity)
    let date = moment(paramsQuery.startAt, 'DD.MM.YYYYTHH:mm:ssZ').startOf('day');
    while (date <= moment(paramsQuery.endAt, 'DD.MM.YYYYTHH:mm:ssZ').endOf('day')) {
      dates.push(date);
      date = date.clone().add(1, typeIsDay ? 'hours' : 'days');
    }
    if (typeIsDay) {
      columnsInDay = dates.map((item) => ({
        title: item.format('HH'),
        dataIndex: 'employments',
        key: item.unix(),
        children: [0,30].map(number => ({
          width: 50,
          key: item.clone().add(number, 'minutes').unix(),
          title: item.clone().add(number, 'minutes').format('mm'),
          render: (name, record) => {
            const currentEmpl = record.employments?.find(
              (empl) => moment(empl.startAt) < item.clone().add(number, 'minutes') && item.clone().add(number, 'minutes') < moment(empl.endAt),
            );
            if (currentEmpl) {
              return (
                <VzTable.Cell.TextOverflow
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#9DF388',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  childrenVisible={false}
                >
                  <LinkWithBack to={{ pathname: `/orders/${currentEmpl.orderId}` }}>{currentEmpl.orderNr}</LinkWithBack>
                </VzTable.Cell.TextOverflow>
              );
            }
          }
        }))
      }))
    } else if (typeIsWeek) {
      columnsInWeek = dates.map((item) => ({
        title: item.format('DD.MM.YYYY'),
        dataIndex: 'employments',
        key: item.unix(),
        children: [0, 4, 8, 12, 16].map(number => ({
          width: 100,
          key: item.clone().add(number, 'hours').unix(),
          title: item.clone().add(number, 'hours').format('HH:mm'),
          render: (name, record) => {
            const currentEmpl = record.employments?.find(
              (empl) => moment(empl.startAt) < item.clone().add(number, 'hours') && item.clone().add(number, 'hours') < moment(empl.endAt),
            );
            if (currentEmpl) {
              return (
                <VzTable.Cell.TextOverflow
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#9DF388',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  childrenVisible={false}
                >
                  <LinkWithBack to={{ pathname: `/orders/${currentEmpl.orderId}` }}>{currentEmpl.orderNr}</LinkWithBack>
                </VzTable.Cell.TextOverflow>
              );
            }
          }
        }))
      }))
    } else {
      columnsInMonth = dates.map((item) => ({
        title: item.format('DD.MM'),
        dataIndex: 'employments',
        key: item.unix(),
        width: 100,
        render: (name, record) => {
          const currentEmpl = record.employments?.find(
            (empl) => moment(empl.startAt) < item && item < moment(empl.endAt),
          );
          if (currentEmpl) {
            return (
              <VzTable.Cell.TextOverflow
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#9DF388',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                childrenVisible={false}
              >
                <LinkWithBack to={{ pathname: `/orders/${currentEmpl.orderId}` }}>{currentEmpl.orderNr}</LinkWithBack>
              </VzTable.Cell.TextOverflow>
            );
          }
        }
      }))
    }
    

    return [
      ...columns,
      ...(typeIsDay ? columnsInDay : typeIsWeek ? columnsInWeek : columnsInMonth)
    ];
  }, [columns, params])


  return (
    <div className="schedule-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'schedule',
          filtersActions,
          title: null,
        }}
      />
      <TableFiltered
        {...{
          params,
          pushParams,
          loading: loadingData,
          columns: timeColumns,
          dataSource,
          rowKey: 'id',
          scroll: { x: columns.reduce((acc, cur) => acc + cur, 0), y: '55vh' },
          paramKeys,
          paginatorConfig: {
            total,
            itemsPerPage: 100,
          },
          responsive: false
        }}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  let { dictionaries } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(Table);
