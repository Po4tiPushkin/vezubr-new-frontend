import React from 'react';
import Icon from '@vezubr/elements/DEPRECATED/icon/iconsList';

function setAttributes(event, src, srcset) {
  const { target } = event;
  target.src = src;
  target.srcset = srcset;
}

const initContentListeners = (map, markers, cb) => {
  const zoomIn = document.getElementById('zoom-in');
  const zoomOut = document.getElementById('zoom-out');
  const locate = document.getElementById('locate');
  zoomIn.onmouseenter = (e) => setAttributes(e, Icon.zoomInActive, Icon.zoomInActive_2x);
  zoomIn.onmouseleave = (e) => setAttributes(e, Icon.zoomInInActive, Icon.zoomInInActive_2x);
  zoomIn.onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    map.setZoom(map.getZoom() + 1);
  };
  zoomOut.onmouseenter = (e) => setAttributes(e, Icon.zoomOutActive, Icon.zoomOutActive_2x);
  zoomOut.onmouseleave = (e) => setAttributes(e, Icon.zoomOutInActive, Icon.zoomOutInActive_2x);
  zoomOut.onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    map.setZoom(map.getZoom() - 1);
  };
  locate.onmouseenter = (e) => setAttributes(e, Icon.locationActive, Icon.locationActive_2x);
  locate.onmouseleave = (e) => setAttributes(e, Icon.locationInActive, Icon.locationInActive_2x);
  locate.onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    cb({ action: 'locateClick' });
    /*if (markers) {
			map.fitBounds(markers.getBounds());
		} else {
			map.setView([55.75, 37.6167], 10)
		}*/
  };
};
const initActionListeners = (filtersCount) => {
  const orderMenu = document.getElementById('order-menu');
  orderMenu.style.height = 48 * filtersCount + 'px';
  if (orderMenu) {
    const menu = document.getElementById('menu');
    menu.onmouseenter = (e) => {
      if (orderMenu.style.display === 'none') {
        setAttributes(e, Icon.burgerActive, Icon.burgerActive_2x);
      }
    };
    menu.onmouseleave = (e) => {
      if (orderMenu.style.display === 'none') {
        setAttributes(e, Icon.burgerInActive, Icon.burgerInActive_2x);
      }
    };
    menu.onclick = (e) => {
      if (orderMenu.style.display === 'none') {
        orderMenu.style.display = 'flex';
        setAttributes(e, Icon.burgerActive, Icon.burgerActive_2x);
      } else {
        orderMenu.style.display = 'none';
        setAttributes(e, Icon.burgerInActive, Icon.burgerInActive_2x);
      }
    };
  }
};
const renderZoomIcons = (map, markers, cb) => {
  const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  container.style.backgroundColor = '#4B4C55';
  container.style.width = '40px';
  container.style.height = '112px';
  container.innerHTML = `<div class="leaflet-zoom-custom">
					<img src="${Icon.zoomInInActive}" id="zoom-in" srcset="${Icon.zoomInInActive_2x}"
					 alt=""/>
					 <img src="${Icon.zoomOutInActive}" id="zoom-out" srcset="${Icon.zoomOutInActive_2x}" 
					 alt=""/>
					 <img src="${Icon.locationInActive}" id="locate" srcset="${Icon.locationInActive_2x}" 
					 alt=""/>
				</div>`;
  setTimeout(() => {
    initContentListeners(map, markers, cb);
  });
  return container;
};

const renderOrderFilters = (sputnik, map, filters, type) => {
  const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  container.style.backgroundColor = '#4B4C55';
  container.style.width = '40px';
  container.style.height = '40px';
  let items = '';
  filters.map((element) => {
    items += `<div class="order-menu-item map-check ${element.disabled ? 'disabled' : ''}">
			<label class="map-checkmark"> <span
				class="text-big checkmark-text light-bold">${element.title}</span>
				<input type="checkbox"  value="${element.value}" data-check="${element.checked}" class="type-switcher"/>
				<span class="checkmark"/>
			</label>
		</div>`;
  });
  container.innerHTML = `<div class="leaflet-zoom-custom">
		<img src="${Icon.burgerInActive}" id="menu" srcSet="${Icon.burgerInActive_2x}"
			 alt=""/>
		 <div class="order-menu ${type}" style="display: none;" id="order-menu">
		     ${items}
		</div>
	</div>`;
  setTimeout(() => {
    initActionListeners(filters.length);
    const checkbox = document.getElementsByClassName('type-switcher');

    Array.from(checkbox).forEach((element) => {
      if (element.dataset.check === 'true') {
        element.setAttribute('checked', '');
      }

      element.addEventListener('click', (e) => {
        const checked = e.target.getAttribute('checked');
        if (checked !== null) {
          e.target.removeAttribute('checked');
          // e.preventDefault();
          e.stopPropagation();
          sputnik.removeFromCluster(e.target.value);
        } else {
          e.target.setAttribute('checked', '');
          // e.preventDefault();
          e.stopPropagation();
          sputnik.addToCluster(e.target.value);
        }
      });
    });
  });

  return container;
};

export { renderZoomIcons, renderOrderFilters };
