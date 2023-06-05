import React from 'react';
import PropTypes from 'prop-types';
import { Ant, VzEmpty, VzTable } from '@vezubr/elements';
import { observer } from 'mobx-react';
import cn from 'classnames';
import BargainTableRow from '../../components-inner/table/bargain-table-row';
import useColumnsCalcAccept from '../../hooks/table/useColumnsCalcAccept';
import compose from '@vezubr/common/hoc/compose';
import withBargainStore from '../../hoc/withBargainStore';

function BargainListCanAccept(props) {
  const { height, onAcceptOffer, renderProducerUrl, store } = props;

  const components = React.useMemo(() => ({
    body: {
      row: BargainTableRow,
    },
  }));

  const [columns, width] = useColumnsCalcAccept({
    renderProducerUrl,
    onAcceptOffer,
  });

  const dataSource = store.tableList;

  return (
    <div className={'bargain-list bargain-list-can-accept'}>
      {dataSource.length === 0 && <VzEmpty vzImageName={'auctionOrange'} title={'Торги'} />}

      {dataSource.length > 0 && (
        <div className={'bargain-list__wrapper'}>
          <VzTable.Table
            rowKey={'id'}
            className={cn('bargain-list')}
            columns={columns}
            components={components}
            pagination={false}
            bordered={false}
            dataSource={dataSource}
            scroll={{ x: width, y: height }}
          />
        </div>
      )}
    </div>
  );
}

BargainListCanAccept.propTypes = {
  onAcceptOffer: PropTypes.func,
  renderProducerUrl: PropTypes.func,
  height: PropTypes.number.isRequired,
};

export default compose([withBargainStore(), observer])(BargainListCanAccept);
