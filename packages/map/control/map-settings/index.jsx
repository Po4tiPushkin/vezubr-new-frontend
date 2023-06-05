import React from 'react';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';
import Control from 'react-leaflet-control';
import _concat from 'lodash/concat';
import _throttle from 'lodash/throttle'

function MapSettings(props) {
  const { position, title = "Ширина карты", mapContainer } = props;

  const positionPopover = React.useMemo(() => {
    switch (position) {
      case 'topleft': {
        return 'rightTop'
      }
      case 'topright': {
        return 'leftTop';
      }
      case 'bottomright': {
        return 'leftBottom';
      }
      case 'bottomleft': {
        return 'rightBottom';
      }
      default: {
        return null
      }
    }
    
  }, [position]);

  const defaultValue = React.useMemo(() => {
    return localStorage.getItem('monitorMapWidth') || (((window.innerWidth - 762)/window.innerWidth) * 100).toFixed(0) 
  }, [mapContainer])

  React.useEffect(() => {
    mapContainer.current.style = `flex: 0 0 ${defaultValue}vw`
  }, [defaultValue])
  

  const onChangeSlider = React.useCallback(_throttle((value) => {
    mapContainer.current.style = `flex: 0 0 ${value}vw`
    localStorage.setItem('monitorMapWidth', value)
  }, 100), [mapContainer])
  

  return (
    <>
      <Control className={'leaflet-checkbox-group-control'} position={position}>
        <Ant.Popover
          placement={positionPopover}
          overlayClassName={'leaflet-checkbox-group-control__popover'}
          content={(
            <div style={{width: 150}}>
              <Ant.Slider
                style={{margin: 0}}
                onChange={onChangeSlider}
                min={20}
                max={(((window.innerWidth - 762)/window.innerWidth) * 100).toFixed(0)}
                defaultValue={defaultValue}
              />
            </div>
          )}
          title={title}
          trigger="click"
        >
          <Ant.Button className={'leaflet-checkbox-group-control__button'} icon={"setting"} />
        </Ant.Popover>
      </Control>
    </>
  );
}

MapSettings.propTypes = {
  position: PropTypes.oneOf(['topleft', 'topright', 'bottomright', 'bottomleft']),
  title: PropTypes.string,
  children: PropTypes.func,
};

export default MapSettings;
