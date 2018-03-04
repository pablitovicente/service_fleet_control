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
const logger = console.log;

class Client {
  constructor(net) {
    this.net = net;
    this.connection = null;

    process.on('uncaughtException', (err) => {
      console.log('Can not send health status. Configured Registry is down or unrechable.');
      console.log(err.stack);
    });
  }

  registerErrorListner() {
    this.connection.on('error', (error) => {
      logger(error);
    });
  }

  registerDisconnectionEvent() {
    this.connection.on('close', () => {
      logger('Connection closed by server');
    });
  }

  // In the future we might allow the server to control its fleet for example to shoot down services
  // registerDataEvent() {
  //   this.connection.on('data', (data) => {
  //     logger(data.toString()); // data is a buffer so string it!
  //   });
  // }

  connect(host, port) {
    this.connection = this.net.createConnection({ host, port }, () => {
      logger('CLIENT CONNECTED TO SERVER');
      this.registerErrorListner();
      this.registerDisconnectionEvent();
    });
  }

  disconnect() {
    this.connection.end();
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

    this.connection.write(JSON.stringify(message), () => {
      this.disconnect();
    });
  }
}

module.exports = Client;
