import { Polyline } from 'leaflet';

const LEAFLET_ANT_CLASS = 'leaflet-ant-path';

export const PolylineAnt = Polyline.extend({
  _animatedPathClass: LEAFLET_ANT_CLASS,
  _reversePathClass: `${LEAFLET_ANT_CLASS}--reverse`,
  _popupOpenClass: `${LEAFLET_ANT_CLASS}--popup-opened`,
  _hardwareAccClass: `${LEAFLET_ANT_CLASS}--hardware-acceleration`,

  // @section
  // @aka Polyline options
  options: {
    paused: false,
    reverse: false,
    hardwareAcceleration: false,
    duration: 100,
  },

  onAdd(map) {
    Polyline.prototype.onAdd.call(this, map);
    const { paused, hardwareAcceleration } = this.options;

    map.on('zoomend', this._calculateAnimationDuration, this);
    this._addRemoveEvents(true);

    const elem = this.getElement();

    elem.classList.add(this._animatedPathClass);

    if (hardwareAcceleration) {
      elem.classList.add(this._hardwareAccClass);
    }

    paused ? this.pause() : this.resume();

    this._pureReverse();
    this._calculateAnimationDuration();
  },

  _addRemovePopupClass(add) {
    this.getElement().classList[add ? 'add' : 'remove'](this._popupOpenClass);
  },

  _onPopupCloseOpen(ev) {
    this._addRemovePopupClass(ev.type === 'popupopen');
  },

  _addRemoveEvents(add) {
    const eventMethod = add ? 'on' : 'off';
    this[eventMethod]('popupopen popupclose', this._onPopupCloseOpen, this);
  },

  /*_getDistance() {

		if (this.__memoizeGetDistance) {
			return this.__memoizeGetDistance();
		}

		this.__memoizeGetDistance = _memoize(
			() => {
				devLog('distance calculate distance');
				let dist = 0;
				let lastLatLng = null;
				for (const position of this._path) {
					const curLatLng = new LatLng(position[0], position[1]);
					if (lastLatLng) {
						dist += lastLatLng.distanceTo(curLatLng);
					}

					lastLatLng = curLatLng;
				}

				return dist;
			},
			() => this._path);


		return this.__memoizeGetDistance();

	},*/

  onRemove: function () {
    if (this._map) {
      this._map.off('zoomend', this._calculateAnimationDuration, this);
    }

    this._addRemoveEvents(false);
    this._addRemovePopupClass(false);

    Polyline.prototype.onRemove.call(this);
  },

  _calculateAnimationDuration() {
    const { options, _map } = this;

    if (options.paused || !_map) {
      return;
    }

    //const zoom = _map.getZoom();
    //const distance = options.distance || this._getDistance();

    /*const { x, y } = _map.getSize();
		const maxMeters = _map.containerPointToLatLng([0, y]).distanceTo(_map.containerPointToLatLng([x, y]));
		const pixelPerMeters =  x / maxMeters;
		Получить продолжительность анимации (в секундах) на основе длины трека, заданной скорости и текущего уровня масштабирования
		const animationDuration = (	(distance * pixelPerMeters) / 60);*/

    const animationDurationSec = /*animationDuration + */ `${options.duration}s`;

    const animationRules = ['-webkit-', '-moz-', '-ms-', '-o-', '']
      .map((prefix) => `${prefix}animation-duration: ${animationDurationSec}`)
      .join(';');

    const el = this.getElement();
    el.style.cssText = animationRules;
    el.setAttribute('data-animated', 'true');
  },

  pause() {
    const { paused } = this.options;

    if (!paused) {
      const el = this.getElement();
      this.options.paused = true;

      if (el) {
        el.removeAttribute('style');
        el.setAttribute('data-animated', 'true');
      }
      return true;
    }
    return false;
  },

  resume() {
    const { options } = this;
    if (options.paused) {
      options.paused = false;
      this._calculateAnimationDuration();
      return true;
    } else {
      return false;
    }
  },

  _pureReverse() {
    const el = this.getElement();
    if (el) {
      this.options.reverse ? el.classList.add(this._reversePathClass) : el.classList.remove(this._reversePathClass);
    }
  },

  setStyle(options) {
    const { paused, duration, reverse, hardwareAcceleration } = { ...this.options, ...options };

    const isChangeDuration = duration !== this.options.duration;
    const isChangePaused = paused !== this.options.paused;
    const isChangeReverse = reverse !== this.options.reverse;
    const isChangeHardwareAcceleration = hardwareAcceleration !== this.options.hardwareAcceleration;

    Polyline.prototype.setStyle.call(this, options);

    if (isChangeReverse) {
      this._pureReverse();
    }

    if (isChangePaused) {
      paused ? this.pause() : this.resume();
    }

    if (isChangeDuration) {
      this._calculateAnimationDuration();
    }

    if (isChangeHardwareAcceleration) {
      this.getElement().classList[hardwareAcceleration ? 'add' : 'remove'](this._hardwareAccClass);
    }

    return this;
  },
});

export function polylineAnt(latlngs, options) {
  return new PolylineAnt(latlngs, options);
}
