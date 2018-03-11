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
const express = require('express');
// Include the module
const Control = require('../../index');

const logger = console.log;

const app = express();
// Create the configuration
const myConfig = {
  serviceName: 'Authentication', // A name to easily identify the service being monitored
  updateIntervalSeconds: 5, // Time interval, in seconds, between updates
  role: 'tlsService', // Role can either be 'service' or 'registry'
  groupingKey: 'AuthenticationService', // A grouping key so all the services of the same type are hold together
  registryHost: 'localhost', // The host against to which the service should send updates/register
  registryPort: 50000, // The port against to which the service should send updates/register
  hostName: 'fake.host.co',
  clientKey: `${__dirname}/../../tests/certs/client/client.key`,
  clientCert: `${__dirname}/../../tests/certs/client/client.crt`,
  ca: `${__dirname}/../../tests/certs/ca/ca.crt`,
  useSelfSignedCerts: true,
  makeClientThrow: false,
};
// ^^^ If makeClientThrow === true client will throw an error and stop app execution
// if false it will show a message and let your app run. This behaviour might change
// once code is stable!

// Create an instance
const control = new Control(myConfig);

// Start it
control.init();


// Setup your express routes, configuration, middlewares, etc.
app.get('/auth', (req, res) => {
  logger('Got request to /auth');
  res.send('Hello I am a mock auth service');
});

const expressApp = app.listen(() => logger('Mock Service 1 listening on port: ', expressApp.address().port));
