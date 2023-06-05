import React from 'react';
import PropTypes from 'prop-types';
import * as VzMap from '@vezubr/map';
import { Popup } from 'react-leaflet';
import MonitorItemBase from '../../../store/items/MonitorItemBase';
import { observer, useObserver } from 'mobx-react';

function MonitorMapItem(props) {
  const { item, getMarkerIcon, PopupContentComponent, popupContentComponentProps } = props;

  const icon = useObserver(() => getMarkerIcon(item));

  const popupContent = PopupContentComponent && <PopupContentComponent item={item} {...popupContentComponentProps} />;
  const { id, position } = item;

  return (
    <VzMap.Marker item={item} key={id} value={position} icon={icon}>
      {popupContent && <Popup minWidth={300}>{popupContent}</Popup>}
    </VzMap.Marker>
  );
}

MonitorMapItem.propTypes = {
  item: PropTypes.instanceOf(MonitorItemBase),
  getMarkerIcon: PropTypes.func,
  PopupContentComponent: PropTypes.elementType,
  popupContentComponentProps: PropTypes.object,
};

export default observer(MonitorMapItem);
