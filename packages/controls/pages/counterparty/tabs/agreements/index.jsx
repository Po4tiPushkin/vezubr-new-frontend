import React from 'react';

import useColumns from './hooks/useColumns';
import { Ant } from '@vezubr/elements';

function Agreement(props) {
  const { dictionaries, agreements } = props;

  const [columns] = useColumns({ dictionaries });

  return (
    <div className="agreements-table-container">
      <Ant.Table columns={columns} dataSource={agreements?.filter(agreement => !agreement?.deleted)} bordered={true} pagination={false} />
    </div>
  );
}

export default Agreement;
