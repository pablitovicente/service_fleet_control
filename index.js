/*
  Service Discovery and Health Status
  Copyright (C) <2018> <Pablo Vicente>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
const debug = require('debug')('SFC');
const fs = require('fs');
const loki = require('lokijs');
const os = require('os');
const tls = require('tls');
const { groupBy, omit } = require('lodash');

const Metrics = require('./libs/metrics');
const Protocol = require('./libs/protocol');
const Store = require('./libs/store');
const TLSRegistry = require('./libs/tlsRegistry');
const TLSClient = require('./libs/tlsClient');


class Control {
  constructor(config) {
    this.config = config;
    this.store = null;
    this.registryService = null;
    this.registryClient = null;
    this.configIsGood = false;
  }

  // Starts the client or server depending on the config
  init() {
    if (this.isTLSService()) {
      debug('Running TLS Client');
      this.configIsGood = true;
      this.registryClient = new TLSClient(tls, fs, os, this.config, Metrics, Protocol);
      this.startTLSClient();
    } else if (this.isTLSRegistry()) {
      debug('Running TLS Registry');
      this.setupRegistryStore();
      this.registryService = new TLSRegistry(tls, loki, fs, this.config, this.store);
      this.configIsGood = true;
      this.startTlSRegistryService();
    } else {
      this.configIsGood = false; // eslint-disable-next-line no-console
      console.log('Service Fleet Control misconfiguration "role" should either be "tlsRegistry" or "tlsService"');
    }
  }

  isTLSService() {
    return this.config.role === 'tlsService';
  }

  isTLSRegistry() {
    return this.config.role === 'tlsRegistry';
  }

  setupRegistryStore() {
    this.store = new Store(
      {
        dbName: 'registry.db',
        dbCollection: 'serviceNetwork',
      },
      loki,
      groupBy,
      omit,
    );
  }

  startTlSRegistryService() {
    this.registryService.listen();
  }

  startTLSClient() {
    this.registryClient.start();
  }

  stopTLSClient() {
    this.registryClient.stop();
  }
}

module.exports = Control;

