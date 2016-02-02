'use strict';

const Abstract = require('@scola/websocket');

class SubSocket extends Abstract.Socket {
  constructor(pool, message) {
    super();

    this.connectionPool = pool;
    this.messageProvider = message;

    this.defaultTopic = '*';
    this.topicDelimiter = '=';
  }

  setDefaultTopic(topic) {
    this.defaultTopic = topic;
  }

  setTopicDelimiter(topicDelimiter) {
    this.topicDelimiter = topicDelimiter;
  }

  subscribe(topic) {
    return this.send(topic, true);
  }

  unsubscribe(topic) {
    return this.send(topic, false);
  }

  send(topic, action) {
    topic = topic || this.defaultTopic;

    const head = topic + this.topicDelimiter + Number(action);
    const message = this.messageProvider.get().addHead(head);

    let connection = null;

    for (connection of this.connectionPool.values()) {
      if (connection.canSend()) {
        connection.send(message);
      }
    }

    return this;
  }

  handleMessage(event) {
    this.emit('message', event);
  }
}

module.exports = SubSocket;
