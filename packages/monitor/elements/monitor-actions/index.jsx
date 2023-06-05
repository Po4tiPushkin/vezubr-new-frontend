import React from 'react';
import PropTypes from 'prop-types';
import MonitorActionLink from '../monitor-action-link';

function MonitorActionsItem(props) {
  const { ItemComponent, item } = props;
  return <ItemComponent item={item} />;
}

MonitorActionsItem.propTypes = {
  ItemComponent: PropTypes.elementType.isRequired,
  item: PropTypes.object.isRequired,
};

function MonitorActions(props) {
  const { actions, item } = props;
  if (!actions || !Object.keys(actions).length) {
    return null;
  }

  return (
    <div className={'monitor-actions'}>
      {Object.keys(actions)
        .map((key) => {
          return typeof actions[key] === 'function' ? (
            <MonitorActionsItem key={key} ItemComponent={actions[key]} item={item} />
          ) : (
            <MonitorActionLink {...actions[key]} key={key} item={item} />
          );
        })
        .filter((result) => result)}
    </div>
  );
}

MonitorActions.propTypes = {
  item: PropTypes.any,
  actions: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        onAction: PropTypes.func.isRequired,
        children: PropTypes.node,
      }),
      PropTypes.elementType,
    ]),
  ),
};

export default MonitorActions;
