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
const chai = require('chai');
const Metrics = require('../../../libs/metrics');

const { expect } = chai;
const metrics = new Metrics({
  os,
  updateIntervalSeconds: 1,
});

describe('Metrics Class', () => {
  describe('Metrics library construction', () => {
    it('Instantiates the Metrics object correctly', (done) => {
      expect(metrics).to.be.instanceof(Metrics);
      done();
    });
  });

  describe('Metrics library methods', () => {
    it('osInfo() returns correct data structure', (done) => {
      const osInfo = metrics.osInfo();
      expect(osInfo).to.have.all.keys([
        'freemem',
        'hostname',
        'loadadv',
        'numCpus',
        'uptime',
        'user',
      ]);
      done();
    });

    it('kpis() returns correct data structure', (done) => {
      const kpis = metrics.kpis();
      expect(kpis).to.have.all.keys([
        'external',
        'heapTotal',
        'heapUsed',
        'rss',
        'freemem',
        'hostname',
        'loadadv',
        'numCpus',
        'uptime',
        'user',
        'updateIntervalSeconds',
      ]);
      done();
    });
  });
});
