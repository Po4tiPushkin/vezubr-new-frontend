import React, { useMemo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, message, Table } from '@vezubr/elements/antd';
import { VzTable } from '@vezubr/elements';

function ContourLinks(props) {
  const { contours: dataSource, title, getRegisterLink } = props;

  if (!dataSource || !dataSource.length) {
    return null;
  }

  const columns = useMemo(
    () => [
      {
        title: 'Название контура',
        width: 200,
        dataIndex: 'title',
        key: 'title',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Ссылка',
        width: 400,
        dataIndex: 'code',
        key: 'code',
        render: (code, record, index) => {
          return getRegisterLink(code);
        },
      },

      {
        title: '',
        dataIndex: 'code',
        className: 'contour-links__col-action',
        key: 'action',
        render: (code, record, index) => {
          const link = getRegisterLink(code);
          return (
            <CopyToClipboard text={link} onCopy={() => message.info('Ссылка скопирована')}>
              <a>Скопировать в буфер</a>
            </CopyToClipboard>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="contour-links">
      <h2 className="contour-links__title">{title}</h2>
      <Table
        className="contour-links__items"
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        scroll={{ x: true }}
        pagination={false}
      />
    </div>
  );
}

export default ContourLinks;
