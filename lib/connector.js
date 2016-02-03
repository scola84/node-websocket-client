'use strict';

const Abstract = require('@scola/websocket');

class ClientConnector extends Abstract.Connector {
  connect(options) {
    this.open();

    this.connectionProvider
      .get()
      .connect(options);

    return this;
  }
}

module.exports = ClientConnector;
