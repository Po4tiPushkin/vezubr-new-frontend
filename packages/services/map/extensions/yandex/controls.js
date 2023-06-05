import Icon from '@vezubr/elements/DEPRECATED/icon/iconsList';

const zoomIcons = () => {
  return `<div style="background-color: rgb(75, 76, 85)" 
				class="leaflet¬-bar leaflet-control leaflet-control-custom">
					<div class="leaflet-zoom-custom">
						<img src="${Icon.zoomInInActive}" id="zoom-in" srcset="${Icon.zoomInInActive_2x}"
						 alt=""/>
						 <img src="${Icon.zoomOutInActive}" id="zoom-out" srcset="${Icon.zoomOutInActive_2x}" 
						 alt=""/>
						 <img src="${Icon.locationInActive}" id="locate" srcset="${Icon.locationInActive_2x}" 
					 alt=""/>
				</div>
	</div>`;
};

class Controls {
  constructor(map) {
    this.map = map;
    /*this.map.panes
			.get('controls')
			.css({
				height:'100%'
			})*/
  }

  zoomControl() {
    // Creating a custom layout for the zoom slider.
    const ZoomLayout = ymaps.templateLayoutFactory.createClass(zoomIcons(), {
      build: function () {
        ZoomLayout.superclass.build.call(this);
        this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
        this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        zoomIn.addEventListener('click', this.zoomInCallback);
        zoomOut.addEventListener('click', this.zoomOutCallback);
      },

      clear: function () {
        document.getElementById('zoom-in').removeEventListener('click', this.zoomInCallback);
        document.getElementById('zoom-out').removeEventListener('click', this.zoomOutCallback);
        ZoomLayout.superclass.clear.call(this);
      },

      zoomIn: function () {
        const map = this.getData().control.getMap();
        map.setZoom(map.getZoom() + 1, { checkZoomRange: true });
      },

      zoomOut: function () {
        const map = this.getData().control.getMap();
        map.setZoom(map.getZoom() - 1, { checkZoomRange: true });
      },
    });
    const zControl = new ymaps.control.ZoomControl({
      options: {
        layout: ZoomLayout,
        position: {
          bottom: 10,
          right: 10,
        },
      },
    });
    if (!this.zControl) {
      this.map.controls.add(zControl);
      this.zControl = zControl;
    }
    //zoomOut.addEventListener("click", this.zoomOutCallback);
  }
}

export default Controls;
