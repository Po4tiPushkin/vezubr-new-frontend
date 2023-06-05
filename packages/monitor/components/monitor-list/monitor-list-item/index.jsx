import React from 'react';
import PropTypes from 'prop-types';
import MonitorItemBase from '../../../store/items/MonitorItemBase';

function MonitorListItem(props) {
  const { item, ItemComponent, itemComponentProps } = props;
  return <ItemComponent {...itemComponentProps} item={item} />;
}

MonitorListItem.propTypes = {
  item: PropTypes.instanceOf(MonitorItemBase),
  ItemComponent: PropTypes.elementType.isRequired,
  itemComponentProps: PropTypes.object,
};

export default MonitorListItem;
