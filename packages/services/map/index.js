import * as MapProviders from './providers';

import _capitalize from 'lodash/capitalize';

class MapConstructor {
  constructor(provider, elementId, observer) {
    this.provider = provider;
    this.elementId = elementId;
    this.observer = observer;
  }

  resetTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  init(clickEvent, observer) {
    return new Promise((resolve) => {
      this.timer = setInterval(() => {
        const elem = document.getElementById(this.elementId);
        if (elem) {
          this.resetTimer();
          const provider = new MapProviders[_capitalize(this.provider)](
            this.provider.toLowerCase(),
            this.elementId,
            clickEvent,
            void 0,
            this.observer,
          );
          resolve(provider);
        }
      }, 500);
    });
  }
}

export default MapConstructor;
