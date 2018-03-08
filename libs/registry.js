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
const debug = require('debug')('SFC_registry');
const { groupBy } = require('lodash');

class Registry {
  constructor(net, loki, configuration) {
    Object.assign(this, configuration);
    this.net = net;
    this.Loki = loki;
    this.connection = null;
    this.totalNumberUpdatesSent = 0;
    this.db = new this.Loki('registry.db');
    this.serviceNetwork = this.db.addCollection('serviceNetwork');

    this.server = net.createServer((socket) => {
      socket.on('data', (data) => {
        const clientPacket = JSON.parse(data.toString());
        // Only insert a record if one doesn't exist already.
        if (!this.serviceExist(clientPacket.payload.groupingKey, clientPacket.payload.metrics.hostname)) this.serviceNetwork.insert(clientPacket.payload);
      });

      // Register a listener for disconnections so we can keep the "user" list updated
      socket.on('end', () => {
        this.totalNumberUpdatesSent += 1;
        debug(this.getServiceFleetStatus());
        debug('#'.repeat(220));
        debug('Total Requests: ', this.totalNumberUpdatesSent);
        debug('#'.repeat(220));
        debug('Client Disconected');
      });
    });
  }

  getServiceFleetStatus() {
    return groupBy(this.serviceNetwork.find(), aService => aService.groupingKey);
  }

  serviceExist(groupingKey, hostName) {
    return this.serviceNetwork.find({ groupingKey, 'metrics.hostname': hostName }).length > 0;
  }

  listen() {
    this.server.listen({ port: this.registryPort }, () => {
      debug(`Registry listening in: ${this.server.address()}`);
    });
  }
}

module.exports = Registry;

