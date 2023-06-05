import io from 'socket.io-client';
import { devLog } from '@vezubr/common/common/utils';
import { Utils } from '@vezubr/common/common';

class Channel {
  _socket;

  _listeners;

  _emits;

  _isClose;

  _wasBreak;

  constructor() {
    const URI = `${window.API_CONFIGS[APP].host}`;

    this._isClose = false;
    this._wasBreak = false;

    this._listeners = {};
    this._emits = [];

    this._socket = io(URI);

    this._socket.on('connect', () => {
      if (this._isClose) {
        console.error(`socket: try to connect closed channel`);
        return;
      }

      const force = this._wasBreak;

      this._setJoins(force);
      this._setListening();

      if (this._wasBreak) {
        console.log(`socket: reconnected successfully`);
      } else {
        console.log(`socket: connected successfully`);
      }

      this._wasBreak = false;
    });

    this._socket.on('disconnect', () => {
      if (!this._isClose) {
        console.log('socket: break on the line');
        this._wasBreak = true;
        return;
      }

      console.log('socket: the channel was disconnected forcibly');
    });
  }

  _isCloseChannel() {
    if (this._isClose) {
      console.error('socket: The channel is closed. Create new channel');
    }

    return this._isClose;
  }

  _setListening() {
    if (!this._socket.connected) {
      return null;
    }

    for (const listenerName of Object.keys(this._listeners)) {
      const listenerInfo = this._listeners[listenerName];

      if (listenerInfo.connected) {
        continue;
      }

      this._socket.on(listenerName, (data) => {
        const sendParam = { detail: data };
        devLog(`socket: event ${listenerName} data: `, sendParam);

        if (!this._listeners?.[listenerName]?.functions) {
          console.error(`socket: has\`t listenerName "${listenerName}"`);
          return;
        }

        for (const func of this._listeners[listenerName].functions) {
          func(sendParam);
        }
      });

      listenerInfo.connected = true;
    }
  }

  _setJoins(force = false) {
    if (!this._socket.connected) {
      return null;
    }

    for (const emitter of this._emits) {
      if (emitter.connected && !force) {
        continue;
      }
      this._socket.emit(emitter.roomName, emitter.params);
      emitter.connected = true;
    }
  }

  leave() {
    if (this._isCloseChannel()) {
      return;
    }

    console.log('socket: leave the channel forcibly');

    this._isClose = true;

    this._socket.close();

    this._listeners = null;
    this._socket = null;
    this._emits = null;
  }

  joinUser() {
    const decoded = Utils.getDecodedUser();
    if (!decoded) {
      return this;
    }
    this.join('user_join', { userId: decoded.userId, key: decoded.userKey });
    this.join('contractor_join', { contractorId: decoded.contractorId, key: decoded.contractorKey });

    return this;
  }

  join(roomName, params) {
    if (this._isCloseChannel()) {
      return this;
    }

    this._emits.push({
      roomName,
      params,
      connected: false,
    });

    this._setJoins();

    return this;
  }

  subscribe(listenerName, cb) {
    if (this._isCloseChannel()) {
      return this;
    }

    if (!this._listeners[listenerName]) {
      this._listeners[listenerName] = {
        connected: false,
        functions: [],
      };
    }

    if (!this._listeners[listenerName].functions.find(cb)) {
      this._listeners[listenerName].functions.push(cb);
    }

    this._setListening();

    console.log(`${listenerName} subscribed successfully`);

    return this;
  }

  unsubscribe(listenerName, cb) {
    if (this._isCloseChannel()) {
      return this;
    }

    if (!this._listeners[listenerName]) {
      return this;
    }

    this._listeners[listenerName].functions = this._listeners[listenerName].functions.filter((fn) => fn !== cb);

    return this;
  }
}

export default function socket() {
  return new Channel();
}
