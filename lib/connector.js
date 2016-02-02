'use strict';

const Abstract = require('@scola/websocket');

class ClientConnector extends Abstract.Connector {
  connect(address, protocols, options) {
    this.open();

    this.connectionProvider
      .get()
      .connect(address, protocols, options);

    return this;
  }
}

module.exports = ClientConnector;
