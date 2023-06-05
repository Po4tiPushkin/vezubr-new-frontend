import React from 'react';
import PropTypes from 'prop-types';
import { MonitorContext } from '../../context';
import { observer } from 'mobx-react';
import MonitorBadge from '../../elements/monitor-badge';
import { sortEmpty } from '../../utils';

function MonitorLabelProblems(props) {
  const { filteredFunc, children, badgeTitle, type } = props;

  const { store } = React.useContext(MonitorContext);

  const items = store.getItemsFiltered(type, filteredFunc, sortEmpty);

  const count = items.filter(({ problems }) => problems.filter(item => item.status === 1).length).length;

  return count ? (
    <MonitorBadge count={count} title={badgeTitle || 'Есть проблемы!'}>
      {children}
    </MonitorBadge>
  ) : (
    children
  );
}

MonitorLabelProblems.propTypes = {
  filteredFunc: PropTypes.func.isRequired,
  badgeTitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
};

export default observer(MonitorLabelProblems);
