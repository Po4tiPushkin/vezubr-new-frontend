import React, { useMemo } from 'react';
import { Table } from '@vezubr/elements/antd';
import { VzTable } from '@vezubr/elements';
import getTreeData from './data/getTreeData';
import PropTypes from 'prop-types';
import moment from 'moment';

function History(props) {
  const { data } = props;

  const dataSource = useMemo(() => getTreeData(data || [], '0'), [data]);

  const columns = useMemo(
    () => [
      {
        title: 'Действие',
        dataIndex: 'title',
        key: 'title',
        width: '40%',
      },
      {
        title: 'Время',
        dataIndex: 'createdAtOrderTimezone',
        key: 'createdAtOrderTimezone',
        width: '40%',
        render: (createdAtOrderTimezone) => 
        <VzTable.Cell.Content>{createdAtOrderTimezone && moment(createdAtOrderTimezone).format('DD.MM.YYYY HH:mm') || ''}</VzTable.Cell.Content>,
      },
      {
        title: 'Номер точки',
        dataIndex: 'addressPoint',
        key: 'addressPoint',
      },
    ],
    [],
  );

  return (
    <Table className="table-history" columns={columns} dataSource={dataSource} scroll={{ y: 650 }} pagination={false} />
  );
}

History.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default History;
