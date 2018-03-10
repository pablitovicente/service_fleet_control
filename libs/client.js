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
const debug = require('debug')('SFC_client');

class Client {
  constructor(net, config, metrics) {
    this.net = net;
    this.config = config;
    this.metrics = metrics;
  }

  registerErrorListner() {
    this.socket.on('error', (error) => {
      if (this.config.makeClientThrow) {
        throw new Error(JSON.stringify(error));
      } else {
        debug('Something is wrong with the configuration or the environtment, is the registry up?');
        debug(error);
      }
    });
  }

  registerDisconnectionEvent() {
    this.socket.on('close', () => {
      debug('Client Disconnected.');
    });
  }

  connect(host, port) {
    this.socket = new this.net.Socket();
    this.registerErrorListner();
    this.registerDisconnectionEvent();
    this.socket.connect({ host, port }, () => {
      debug('CLIENT CONNECTED TO SERVER');
    });
  }

  disconnect() {
    this.socket.end();
    this.socket = null;
  }

  send(payload, metrics) {
    const message = {
      type: 'HEALTH',
      payload: {
        ...payload,
        metrics: metrics.kpis(),
        time: new Date(),
      },
    };

    debug(JSON.stringify(message, null, 2));
    this.socket.write(JSON.stringify(message), () => {
      this.disconnect();
    });
  }

  start() {
    setInterval(
      () => {
        this.connect(this.config.registryHost, this.config.registryPort);
        this.send(
          {
            serviceName: this.config.serviceName,
            groupingKey: this.config.groupingKey,
          },
          this.metrics,
        );
      },
      this.config.updateIntervalSeconds * 1000,
    );
  }
}

module.exports = Client;
