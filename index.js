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
const tls = require('tls');
const fs = require('fs');
const loki = require('lokijs');

const Metrics = require('./libs/metrics');
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
    if (this.isTLSService()) {
      debug('Running TLS Service');
      this.configIsGood = true;
      this.tlsClient = new TLSClient(tls, fs, this.config, this.metrics);
      this.startTLSClient();
    } else if (this.isTLSRegistry()) {
      debug('Running TLS Server');
      this.registryService = new TLSRegistry(tls, loki, fs, this.config);
      this.configIsGood = true;
      this.startTlSRegistryService();
    } else {
      this.configIsGood = false; // eslint-disable-next-line no-console
      console.log('Service Fleet Control misconfiguration "role" should either be "server" or "client"');
    }
  }

  isTLSService() {
    return this.config.role === 'tlsService';
  }

  isTLSRegistry() {
    return this.config.role === 'tlsRegistry';
  }

  startTlSRegistryService() {
    this.registryService.listen();
  }

  startTLSClient() {
    this.tlsClient.start();
  }
}

module.exports = Control;

