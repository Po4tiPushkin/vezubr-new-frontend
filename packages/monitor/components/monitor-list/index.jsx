import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Ant, VzEmpty } from '@vezubr/elements';
import MonitorListItem from './monitor-list-item';
import _sortBy from 'lodash/sortBy';
import moment from 'moment';

const getRelatedOrders = (order, alreadyGrouppedOrders, groupInput, orders) => {
  const {
    id,
    data: { relatedOrders },
  } = order;
  let group = groupInput || []
  group.push(order)
  alreadyGrouppedOrders.push(id);
  if (relatedOrders.length > 0) {
    relatedOrders?.forEach(({ id: relatedOrderId }) => {
      if (!alreadyGrouppedOrders.includes(relatedOrderId)) {
        const relatedOrder = orders.find((item) => item.id == relatedOrderId);
        if (relatedOrder) {
          alreadyGrouppedOrders.push(relatedOrderId);
          getRelatedOrders(relatedOrder, alreadyGrouppedOrders, group, orders);
        }
      }
    });
  }
  return group;
}
function MonitorList(props) {
  const { list, loading, empty, emptyTextDescription, ...otherProps } = props;

  const groups = React.useMemo(() => {
    const groups = [];
    let alreadyGrouppedOrders = [];
    for (const item of list) {
      const {
        id,
      } = item;
      if (alreadyGrouppedOrders.includes(id)) {
        continue;
      }
      let group = getRelatedOrders(item, alreadyGrouppedOrders, null, list)
      groups.push(group);
    }

    return groups;
  }, [list]);
  return (
    <div className={'monitor-list'}>
      {loading && (
        <div className={'monitor-list-skeleton'}>
          <Ant.Skeleton active avatar />
          <Ant.Skeleton active avatar />
          <Ant.Skeleton active avatar />
        </div>
      )}

      {!loading &&
        list &&
        list.length === 0 &&
        (empty ? empty : <VzEmpty vzImageName={'mapOrange'} title={'Монитор'} description={emptyTextDescription} />)}

      {!loading &&
        groups &&
        groups.length > 0 &&
        groups.map((group) => (
          <div
            key={group[0].groupBy}
            className={cn('monitor-list__group', { 'monitor-list__group--has-children': group.length > 1 })}
          >
            {group.map((item) => {
              return <MonitorListItem {...otherProps} key={item?.id} item={item} />;
            })}
          </div>
        ))}
    </div>
  );
}

MonitorList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      groupBy: PropTypes.any.isRequired,
    }),
  ),
  loading: PropTypes.bool,
  emptyTextDescription: PropTypes.string,
  empty: PropTypes.node,
};

export default MonitorList;
