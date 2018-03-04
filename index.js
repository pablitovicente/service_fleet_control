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

const Metrics = require('./libs/metrics');
const Client = require('./libs/client');

class Control {
  constructor(configuration) {
    Object.assign(this, configuration);
    this.metrics = new Metrics({ os });
    this.netClient = new Client(net, this.metrics, configuration);
  }

  // Starts the client or server depending on the configuration
  init() {
    if (this.isService()) {
      console.log('Running Client');
      this.stayAlive();
    } else if (this.isRegistry()) {
      console.log(`Starting Registry. Listening for clients on "${this.registryHost}:${this.registryPort}"`);
    } else {
      throw new Error('Kaos/Control misconfiguration "role" should either be "server" or "client"');
    }
  }

  // Checks if the module is acting as a client
  isService() {
    return this.role === 'service';
  }

  // Checks if the module is acting as a server keeping track of clients
  isRegistry() {
    return this.role === 'registry';
  }

  stayAlive() {
    setInterval(
      () => {
        this.netClient.connect(this.registryHost, this.registryPort);
        this.netClient.send(
          {
            serviceName: this.serviceName,
            groupingKey: this.groupingKey,
          },
          this.metrics,
        );
      },
      this.updateIntervalSeconds * 1000,
    );
  }
}

module.exports = Control;

