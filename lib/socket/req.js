'use strict';

const Abstract = require('@scola/websocket');

class ReqSocket extends Abstract.Socket {
  constructor(loadBalancer) {
    super();
    this.loadBalancer = loadBalancer;
  }

  open(...args) {
    this.loadBalancer.open();
    return super.open(...args);
  }

  close() {
    this.loadBalancer.close();
    return super.close();
  }

  send(message) {
    this.loadBalancer.send(message);
    return this;
  }

  handleMessage(event) {
    this.emit('message', event);
  }
}

module.exports = ReqSocket;
