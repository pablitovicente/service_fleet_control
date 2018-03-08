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
  constructor(net) {
    this.net = net;
  }

  registerErrorListner() {
    this.socket.on('error', (error) => {
      debug('Socket Error:');
      debug(error);
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
}

module.exports = Client;
