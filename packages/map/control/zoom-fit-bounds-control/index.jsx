import { MapControl, withLeaflet } from 'react-leaflet';

import ZoomFitBoundsNativeControl from './native';

class ZoomFitBoundsControl extends MapControl {
  createLeafletElement(props) {
    return new ZoomFitBoundsNativeControl(props);
  }
}

export default withLeaflet(ZoomFitBoundsControl);
