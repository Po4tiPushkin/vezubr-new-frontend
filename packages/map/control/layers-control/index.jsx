import React from 'react';
import { LeafletProvider, MapControl, withLeaflet } from 'react-leaflet';
import { LayersControlNative } from './native';

// Abtract class for layer container, extended by BaseLayer and Overlay
class ControlledLayer extends React.Component {
  contextValue;
  layer;

  componentDidUpdate({ checked }) {
    if (this.props.leaflet.map == null) {
      return;
    }
    // Handle dynamically (un)checking the layer => adding/removing from the map
    if (this.props.checked === true && (checked == null || checked === false)) {
      this.props.leaflet.map.addLayer(this.layer);
    } else if (checked === true && (this.props.checked == null || this.props.checked === false)) {
      this.props.leaflet.map.removeLayer(this.layer);
    }
  }

  componentWillUnmount() {
    this.props.removeLayerControl(this.layer);
  }

  addLayer() {
    throw new Error('Must be implemented in extending class');
  }

  removeLayer(layer) {
    this.props.removeLayer(layer);
  }

  render() {
    const { children } = this.props;
    return children && <LeafletProvider value={this.contextValue}>{children}</LeafletProvider>;
  }
}

class BaseLayer extends ControlledLayer {
  constructor(props) {
    super(props);
    this.contextValue = {
      ...props.leaflet,
      layerContainer: {
        addLayer: this.addLayer.bind(this),
        removeLayer: this.removeLayer.bind(this),
      },
    };
  }

  addLayer = (layer) => {
    this.layer = layer; // Keep layer reference to handle dynamic changes of props
    const { addBaseLayer, checked, name } = this.props;
    addBaseLayer(layer, name, checked);
  };
}

class Overlay extends ControlledLayer {
  constructor(props) {
    super(props);
    this.contextValue = {
      ...props.leaflet,
      layerContainer: {
        addLayer: this.addLayer.bind(this),
        removeLayer: this.removeLayer.bind(this),
      },
    };
  }

  addLayer = (layer) => {
    this.layer = layer; // Keep layer reference to handle dynamic changes of props
    const { addOverlay, checked, name } = this.props;
    addOverlay(layer, name, checked);
  };
}

class LayersControlMain extends MapControl {
  controlProps; /*: {
		addBaseLayer
		addOverlay,
		removeLayer,
		removeLayerControl,
	}*/

  constructor(props) {
    super(props);
    this.controlProps = {
      addBaseLayer: this.addBaseLayer.bind(this),
      addOverlay: this.addOverlay.bind(this),
      leaflet: props.leaflet,
      removeLayer: this.removeLayer.bind(this),
      removeLayerControl: this.removeLayerControl.bind(this),
    };
  }

  createLeafletElement(props) {
    const { children: _children, ...options } = props;
    return new LayersControlNative(undefined, undefined, options);
  }

  updateLeafletElement(
    fromProps, //: LayersControlProps,
    toProps, //: LayersControlProps,
  ) {
    super.updateLeafletElement(fromProps, toProps);
    if (toProps.collapsed !== fromProps.collapsed) {
      if (toProps.collapsed === true) {
        this.leafletElement.collapse();
      } else {
        this.leafletElement.expand();
      }
    }
  }

  componentWillUnmount() {
    setTimeout(() => {
      super.componentWillUnmount();
    }, 0);
  }

  addBaseLayer(layer, name, checked = false) {
    if (checked && this.props.leaflet.map != null) {
      this.props.leaflet.map.addLayer(layer);
    }
    this.leafletElement.addBaseLayer(layer, name);
  }

  addOverlay(layer, name, checked = false) {
    if (checked && this.props.leaflet.map != null) {
      this.props.leaflet.map.addLayer(layer);
    }
    this.leafletElement.addOverlay(layer, name);
  }

  removeLayer(layer) {
    if (this.props.leaflet.map != null) {
      this.props.leaflet.map.removeLayer(layer);
    }
  }

  removeLayerControl(layer) {
    this.leafletElement.removeLayer(layer);
  }

  render() {
    const children = React.Children.map(this.props.children, (child) => {
      return child ? React.cloneElement(child, this.controlProps) : null;
    });
    return <>{children}</>;
  }
}

const LayersControl = withLeaflet(LayersControlMain);

LayersControl.BaseLayer = BaseLayer;
LayersControl.Overlay = Overlay;

export default LayersControl;
