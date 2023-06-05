import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const CLS = 'monitor-layout-list-item';

function MonitorLayoutListItem(props) {
  const { className, icon, identifier, subject, date, status, addresses, cost, actions, timeAtArrival, bargain } = props;

  return (
    <article className={cn(`${CLS}`, className)}>
      <div className={`${CLS}__icon`}>{icon}</div>
      <div className={`${CLS}__body`}>
        <div className={`${CLS}__body__top`}>
          <div className={`${CLS}__body__identifier`}>{identifier}</div>

          <div className={`${CLS}__body__subject`}>{subject}</div>

          <div className={`${CLS}__body__date`}>{date}</div>
        </div>
        <div className={`${CLS}__body__middle`}>
          <div className={`${CLS}__body__status`}>{status}</div>
        </div>
        <div className={`${CLS}__body__bottom`}>
          <div className={`${CLS}__body__addresses`}>{addresses}</div>
          {bargain && <div className={`${CLS}__body__bargain`}>{bargain}</div>}
          {cost && <div className={`${CLS}__body__cost`}>{cost}</div>}
          {timeAtArrival && <div className={`${CLS}__body__time-at-arrival`}>{timeAtArrival}</div>}
        </div>
      </div>
      {actions && <div className={`${CLS}__actions`}>{actions}</div>}
    </article>
  );
}

MonitorLayoutListItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node.isRequired,
  identifier: PropTypes.node.isRequired,
  subject: PropTypes.node.isRequired,
  date: PropTypes.node.isRequired,
  status: PropTypes.node.isRequired,
  addresses: PropTypes.node.isRequired,
  cost: PropTypes.node,
};
export default MonitorLayoutListItem;
