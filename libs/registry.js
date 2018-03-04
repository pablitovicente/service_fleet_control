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

class Registry {
  constructor(net, configuration) {
    Object.assign(this, configuration);
    this.serviceNetwork = {};
    this.net = net;
    this.connection = null;
    this.totalNumberUpdatesSent = 0;

    this.server = net.createServer((socket) => {
      socket.on('data', (data) => {
        const clientPacket = JSON.parse(data.toString());
        logger(`${socket.id} sent a message.`);
        logger(JSON.stringify(clientPacket, null, 2));
        logger('%'.repeat(220));

        if (!this.groupingKeyExists(clientPacket.payload.groupingKey)) {
          this.serviceNetwork[clientPacket.payload.groupingKey] = {};
          this.serviceNetwork[clientPacket.payload.groupingKey][clientPacket.payload.metrics.hostname] = clientPacket.payload;
        } else {
          this.serviceNetwork[clientPacket.payload.groupingKey][clientPacket.payload.metrics.hostname] = clientPacket.payload;
        }
      });

      // Register a listener for disconnections so we can keep the "user" list updated
      socket.on('end', () => {
        this.totalNumberUpdatesSent += 1;
        // const disconnectedClient = socket.id;
        // delete users[socket.id];
        // logger.info(`${disconnectedClient} disconnected.`);
        logger(this.serviceNetwork);
        logger('#'.repeat(220));
        logger('Total Requests: ', this.totalNumberUpdatesSent);
        logger('#'.repeat(220));
        logger('Client Disconected');
      });
    });

    process.on('uncaughtException', (err) => {
      logger('Oh Oh Registry Crashed!');
      logger(err.stack);
    });
  }

  groupingKeyExists(groupingKey) {
    return Object
      .keys(this.serviceNetwork)
      .filter(aGroupingKey => aGroupingKey === groupingKey)
      .length > 0;
  }

  listen() {
    this.server.listen({ port: this.registryPort }, () => {
      logger('Server listening in: ', this.server.address());
    });
  }
}

module.exports = Registry;

