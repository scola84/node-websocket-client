'use strict';

const Abstract = require('@scola/websocket');

class DealerSocket extends Abstract.Socket {
  constructor(loadBalancer) {
    super();
    this.loadBalancer = loadBalancer;
  }

  send(message) {
    this.loadBalancer.send(message);
    return this;
  }

  handleMessage(event) {
    this.emit('message', event);
  }
}

module.exports = DealerSocket;
