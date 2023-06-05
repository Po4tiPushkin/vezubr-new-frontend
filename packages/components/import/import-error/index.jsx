import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { VzTable } from '@vezubr/elements';

const ImportError = (props) => {
  const { pasteErrors } = props;

  const dataSource = useMemo(
    () =>
      pasteErrors.map((item, key) => {
        if (typeof item === 'string') {
          return {
            key,
            row: '',
            message: item,
          };
        }

        return {
          ...item,
          key,
        };
      }),
    [pasteErrors],
  );

  const [columns, width] = useMemo(() => {
    const columns = [
      {
        title: 'Строка',
        width: 100,
        dataIndex: 'row',
        sorter: true,
        render: (id) => <VzTable.Cell.TextOverflow>{id}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Ошибка',
        width: 150,
        dataIndex: 'message',
        sorter: true,
        render: (surname) => <VzTable.Cell.TextOverflow>{surname}</VzTable.Cell.TextOverflow>,
      },
    ];
    const width = VzTable.Utils.columnsReduceWidth(columns);
    const cols = VzTable.Utils.columnsDeleteLastWidth(columns);

    return [cols, width];
  }, [pasteErrors]);

  return (
    <VzTable.Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      scroll={{
        x: width,
        y: 300,
      }}
    />
  );
};

ImportError.propTypes = {
  pasteErrors: PropTypes.arrayOf(PropTypes.oneOf([PropTypes.string, PropTypes.object])),
};

export default ImportError;
