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

const app = express();
// Create the configuration
const myConfig = {
  serviceName: 'Authentication', // A name to easily identify the service being monitored
  updateIntervalSeconds: 2, // Time interval, in seconds, between updates
  role: 'registry', // Role can either be 'service' or 'registry'
  groupingKey: 'AuthenticationService', // A grouping key so all the services of the same type are hold together
  registryHost: 'localhost', // The host against to which the service should send updates/register
  registryPort: 50000, // The port against to which the service should send updates/register
};

const control = new Control(myConfig);

control.init();


app.get('/service_status', (req, res) => {
  res.status(200).send(control.registryService.getServiceFleetStatus());
});


app.listen(3001, () => console.log('Example app listening on port 3001!'));
