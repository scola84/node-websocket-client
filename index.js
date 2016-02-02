'use strict';

const DI = require('@scola/di');
const Helper = require('@scola/websocket-helper');
const Wrapper = require('ws');

const Connection = require('./lib/connection');
const Connector = require('./lib/connector');

const Dealer = require('./lib/socket/dealer');
const Pull = require('./lib/socket/pull');
const Req = require('./lib/socket/req');
const Sub = require('./lib/socket/sub');

class Module extends DI.Module {
  configure() {
    this.addModule(Helper.Module);

    this.inject(Connection).with(
      this.singleton(Helper.Pool),
      this.provider(Helper.Message),
      this.array([]),
      this.factory(Wrapper)
    );

    this.inject(Connector).with(
      this.singleton(Helper.Pool),
      this.provider(Connection),
      this.provider(Helper.Message)
    );

    this.inject(Dealer).with(
      this.singleton(Helper.LoadBalancer)
    );

    this.inject(Req).with(
      this.singleton(Helper.LoadBalancer)
    );

    this.inject(Sub).with(
      this.singleton(Helper.Pool),
      this.provider(Helper.Message)
    );
  }
}

module.exports = {
  Connection,
  Connector,
  Module,
  Socket: {
    Dealer,
    Pull,
    Req,
    Sub
  }
};
