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
const os = require('os');
const net = require('net');
const tls = require('tls');
const fs = require('fs');
const loki = require('lokijs');

const Metrics = require('./libs/metrics');
const Client = require('./libs/client');
const Registry = require('./libs/registry');
const TLSRegistry = require('./libs/tlsRegistry');
const TLSClient = require('./libs/tlsClient');

const debug = require('debug')('SFC');

class Control {
  constructor(config) {
    this.config = config;
    this.metrics = new Metrics({
      os,
      updateIntervalSeconds: this.config.updateIntervalSeconds,
      hostName: this.config.hostName,
    });
    this.registryService = null;
    this.configIsGood = false;
  }

  // Starts the client or server depending on the config
  init() {
    if (this.isService()) {
      debug('Running Service');
      this.configIsGood = true;
      this.netClient = new Client(net, this.config, this.metrics);
      this.startClient();
    } else if (this.isTLSService()) {
      debug('Running TLS Service');
      this.configIsGood = true;
      this.tlsClient = new TLSClient(tls, fs, this.config, this.metrics);
      this.startTLSClient();
    } else if (this.isRegistry()) {
      this.registryService = new Registry(net, loki, this.config);
      this.configIsGood = true;
      this.startRegistryService();
      debug(`Starting Registry. Listening for clients on "${this.config.registryHost}:${this.config.registryPort}"`);
    } else if (this.isTLSRegistry()) {
      debug('Running TLS Server');
      this.registryService = new TLSRegistry(tls, loki, fs, this.config);
      this.configIsGood = true;
      this.startRegistryService();
    } else {
      this.configIsGood = false; // eslint-disable-next-line no-console
      console.log('Service Fleet Control misconfiguration "role" should either be "server" or "client"');
    }
  }

  // Checks if the module is acting as a client
  isService() {
    return this.config.role === 'service';
  }

  // Checks if the module is acting as a server keeping track of clients
  isRegistry() {
    return this.config.role === 'registry';
  }

  isTLSService() {
    return this.config.role === 'tlsService';
  }

  isTLSRegistry() {
    return this.config.role === 'tlsRegistry';
  }

  startRegistryService() {
    this.registryService.listen();
  }

  startTlSRegistryService() {
    this.registryService.listen();
  }

  startClient() {
    this.netClient.start();
  }

  startTLSClient() {
    this.tlsClient.start();
  }
}

module.exports = Control;

