'use strict';

const Abstract = require('@scola/websocket');

class ClientConnection extends Abstract.Connection {
  constructor(pool, message, filters, webSocket) {
    super(pool, message, filters);

    this.webSocketFactory = webSocket;

    this.attempts = 0;
    this.timeout = null;

    this.address = null;
    this.protocols = null;
    this.options = {};
  }

  connect(address, protocols, options) {
    this.address = address || 'ws://*';
    this.protocols = protocols || [];
    this.options = options || {};

    return this.handleConnect();
  }

  handleConnect() {
    const connection = this.webSocketFactory
      .create(this.address, this.protocols);

    connection.on('error', () => {
      connection.removeAllListeners();
      this.handleReconnect();
    });

    connection.on('open', () => {
      this.attempts = 0;

      connection.removeAllListeners();
      this.handleOpen(connection);
    });

    return this;
  }

  handleReconnect() {
    clearTimeout(this.timeout);

    if (this.attempts === this.getOption('maxAttempts', 10)) {
      return;
    }

    this.timeout = setTimeout(
      this.handleConnect.bind(this),
      this.calculateDelay()
    );

    this.attempts += 1;
  }

  handleError(error) {
    if (this.connection.readyState === this.connection.CONNECTING) {
      return this.handleReconnect();
    }

    super.handleError(error);
  }

  handleClose(code, reason) {
    super.handleClose(code, reason);

    if (this.getOption('codes', [1000]).indexOf(code) !== -1) {
      return this.handleReconnect();
    }
  }

  calculateDelay() {
    return Math.random() * Math.min(
      this.getOption('maxInterval', 30) * 1000,
      Math.pow(2, this.attempts) * 1000
    );
  }

  getOption(name, defaultValue) {
    return typeof this.options[name] !== 'undefined' ?
      this.options[name] : defaultValue;
  }
}

module.exports = ClientConnection;
