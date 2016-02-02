'use strict';

const Abstract = require('@scola/websocket');

class PullSocket extends Abstract.Socket {
  send() {}

  handleMessage(event) {
    this.emit('message', event);
  }
}

module.exports = PullSocket;
