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
const chai = require('chai');
const Protocol = require('../../../libs/protocol');

const { expect } = chai;
const protocol = new Protocol();

describe('Protocol Class', () => {
  describe('Protocol library construction', () => {
    it('Instantiates the Protocol object correctly', (done) => {
      expect(protocol).to.be.instanceof(Protocol);
      done();
    });
  });

  describe('Protocol', () => {
    it('Ensures the supported messages are defined', () => {
      expect(protocol.validActions).to.deep.equal([
        'HEALTH',
        'LEAVE',
        'JOIN',
        'SHUTDOWN',
      ]);
    });
  });

  describe('Protocol Methods', () => {
    it('Validates a Message', () => {
      const validMessage = 'HEALTH';
      const invalidMessage = 'HEY! HO! LET`S GO!';
      expect(protocol.isValidMessage(validMessage)).to.be.true;
      expect(protocol.isValidMessage(invalidMessage)).to.be.false;
    });

    it('Builds a Message Correctly', () => {
      const action = 'HEALTH';
      const payload = { mem: 50 };
      const message = JSON.parse(protocol.buildMessage(action, payload));
      expect(message).to.include.all.keys(['action', 'payload']);
      expect(message.action).to.be.eql(action);
      expect(message.payload).to.be.eql(payload);
    });

    it('Throws on invalid message construction attempt', () => {
      const action = 'HEALTH invalid';
      const payload = { mem: 50 };
      expect(() => protocol.buildMessage(action, payload)).to.throw('Invalid Message! This means this NPM module is broken! This should never Happen as the protocol is internal to the Module!');
    });
  });
});
