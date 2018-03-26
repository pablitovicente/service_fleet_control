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
class Protocol {
  constructor() {
    this.validActions = [
      'HEALTH',
      'LEAVE',
      'JOIN',
      'SHUTDOWN',
    ];
  }

  buildMessage(action, payload) {
    if (!this.isValidMessage(action)) throw new Error('Invalid Message! This means this NPM module is broken! This should never Happen as the protocol is internal to the Module!');
    return JSON.stringify({
      action,
      payload,
    });
  }

  isValidMessage(action) {
    return this.validActions.indexOf(action) !== -1;
  }
}

module.exports = Protocol;
