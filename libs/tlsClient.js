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
  constructor(tls, fs, os, config, Metrics, Protocol) {
    this.tls = tls;
    this.fs = fs;
    this.protocol = new Protocol();
    this.config = config;
    this.metrics = new Metrics({
      os,
      updateIntervalSeconds: this.config.updateIntervalSeconds,
      hostName: this.config.hostName,
    });
    this.ticker = null;
    this.tlsOptions = {
      hostname: this.config.registryHost,
      port: this.config.registryPort,
    };
    this.usingSelfSignedCerts();
    this.clientShouldUseCerts();
  }

  clientShouldUseCerts() {
    debug('Service configured to send client certificates');
    if (this.config.clientShouldUseCerts === true) {
      this.tlsOptions.key = this.fs.readFileSync(this.config.clientKey);
      this.tlsOptions.cert = this.fs.readFileSync(this.config.clientCert);
    }
  }

  usingSelfSignedCerts() {
    if (this.config.useSelfSignedCerts === true) {
      // eslint-disable-next-line no-console
      console.log(`
      +-----------------------------------------------------------------------------------------------+
      | WARNING YOU ARE SETTING YOUR OWN CA MAKE SURE YOU ARE IN DEV AND YOU KNOW WHAT YOU ARE DOING! |
      +-----------------------------------------------------------------------------------------------+
      `);
      // Necessary only if the server uses the self-signed certificate
      this.tlsOptions.ca = this.fs.readFileSync(this.config.ca);
    }
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

  connect() {
    this.socket = this.tls.connect(this.tlsOptions, () => {
      debug(`TLS client connected: ${this.socket.authorized}`);
    });
    this.registerErrorListner();
    this.registerDisconnectionEvent();
  }

  disconnect() {
    this.socket.end();
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

  stop() {
    clearInterval(this.ticker);
    this.ticker = null;
  }

  start() {
    this.ticker = setInterval(
      () => {
        this.connect();
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
    return this.ticker;
  }
}

module.exports = Client;
