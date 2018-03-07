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

class Metrics {
  constructor(options) {
    this.os = options.os;
    this.updateIntervalSeconds = options.updateIntervalSeconds;
    this.hostName = options.hostName;
  }

  osInfo() {
    return {
      hostname: this.hostName || this.os.hostname(),
      numCpus: this.os.cpus().length,
      freemem: this.os.freemem(),
      loadadv: this.os.loadavg(),
      user: this.os.userInfo().username,
      uptime: this.os.uptime(),
    };
  }

  kpis() {
    return {
      ...process.memoryUsage(),
      ...this.osInfo(),
      updateIntervalSeconds: this.updateIntervalSeconds,
    };
  }
}

module.exports = Metrics;
