import { Cookies, Utils } from '@vezubr/common/common';


let Centrifuge = require("centrifuge");

class Channel {
  _socket;

  _listeners;

  _emits;

  _isClose;

  _wasBreak;

  constructor() {
    this._isClose = false;
    this._wasBreak = false;

    this._listeners = {};
    this._emits = [];

    const token = Cookies.get(`${APP}Token`)
    const { centrifugoToken } = Utils.getDecodedUser();

    this._socket = new Centrifuge(
      window.API_CONFIGS["centrifugoHost"] + "connection/websocket",
      {
        debug: IS_DEV,
        subscribeHeaders: { Authorization: token.replace('%20', ' ') },
        refreshHeaders: { Authorization: token.replace('%20', ' ') },
        subscribeEndpoint:
          window.API_CONFIGS[APP].host + "v1/api/centrifuge/subscribe",
        refreshEndpoint: window.API_CONFIGS[APP].host + "v1/api/centrifuge/refresh",
        disableWithCredentials: true,
      }
    );
    
    this._socket.setToken(centrifugoToken)
    
    this._socket.connect()

    this._socket.on("connect", () => {
      console.log(`socket: connected successfully`);
    });

    this._socket.on("disconnect", () => {
      if (!this._isClose) {
        console.log("socket: break on the line");
        this._wasBreak = true;
        return;
      }

      console.log("socket: the channel was disconnected forcibly");
    });
  }

  leave() {
    if (this._isCloseChannel()) {
      return;
    }

    console.log("socket: leave the channel forcibly");

    this._socket.disconnect();
  }

  _setListening() {

    for (const listenerName of Object.keys(this._listeners)) {
      const listenerInfo = this._listeners[listenerName];

      if (listenerInfo.connected) {
        continue;
      }
      try {
        this._socket.subscribe(listenerName, (data) => {
          for (const func of this._listeners[listenerName].functions) {
            func(data);
          }
        });
      } catch (e) {
        console.error(e)
      }

      listenerInfo.connected = true;
    }
  }

  joinUser(cb) {
    const decoded = Utils.getDecodedUser();
    if (!decoded) {
      return this;
    }
    this._socket.subscribe(`$employee-${decoded.userId}`, cb)

    return this;
  }

  leave() {

    console.log('socket: leave the channel forcibly');

    this._isClose = true;

    this._socket.disconnect()

    this._listeners = null;
    this._socket = null;
    this._emits = null;
  }

  subscribe(listenerName, cb) {

    if (!this._listeners[listenerName]) {
      this._listeners[listenerName] = {
        connected: false,
        functions: [],
      };
    }
    
    if (this._listeners[listenerName]?.functions?.find(cb)) {
      return this;
    }

    this._listeners[listenerName].functions.push(cb);
    
    this._setListening();

    return this;
  }

  unsubscribe(listenerName, cb) {
    if (!this._listeners[listenerName]) {
      return this;
    }

    this._listeners[listenerName].functions = this._listeners[
      listenerName
    ].functions.filter((fn) => fn !== cb);

    return this;
  }
}

export default function centrifugo() {
  return new Channel();
}
