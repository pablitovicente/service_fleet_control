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
const mocha = require('mocha');
const chai = require('chai');
const loki = require('lokijs');
const { groupBy } = require('lodash');
const Store = require('../../../libs/store');

const { expect } = chai;

let store = null;

const dataMocks = {
  recordOne: {
    online: true,
    metrics: {
      hostname: 'netflix.com',
    },
    groupingKey: 'Streaming',
  },
  recordTwo: {
    online: true,
    metrics: {
      hostname: 'spotify.com',
    },
    groupingKey: 'Streaming',
  },
  recordThree: {
    online: true,
    metrics: {
      hostname: 'google.com',
    },
    groupingKey: 'OAuth',
  },
};

const expectedRecordFields = [
  'online',
  'metrics',
  'groupingKey',
  'meta',
  '$loki',
];

const validSearchCriteria = {
  'metrics.hostname': 'netflix.com',
  groupingKey: 'Streaming',
};

const invalidSearchCriteria = {
  'metrics.hostname': '123',
  groupingKey: 'Surfing',
};

const updatedRecordOne = {
  online: false,
  metrics: {
    hostname: 'netflix.com',
  },
  groupingKey: 'Streaming',
};



describe('Store Class', () => {
  before(() => {
    store = new Store(
      {
        dbName: 'registry.test.db',
        dbCollection: 'serviceNetworkTest',
      },
      loki,
      groupBy,
    );
  });

  describe('Instantiation', () => {
    it('Instantiates the Store object correctly', (done) => {
      expect(store).to.be.instanceof(Store);
      done();
    });

    it('Config is valid', (done) => {
      expect(store).to.have.all.keys([
        'config',
        'DbDriver',
        'groupBy',
        'db',
        'collection',
      ]);

      expect(store.config.dbName).to.be.eql('registry.test.db');
      expect(store.config.dbCollection).to.be.eql('serviceNetworkTest');
      expect(store.collection.constructor.name).to.be.eql('LokiEventEmitter');
      expect(store.db.constructor.name).to.be.eql('Loki');
      done();
    });
  });

  describe('Store Operations', () => {
    let firstRecordId = null;
    it('Inserts a record', (done) => {
      const recOne = store.insert(Object.assign({}, dataMocks.recordOne));
      
      expect(recOne).to.have.all.keys(expectedRecordFields);
      expect(recOne.online).to.be.true;
      expect(recOne.metrics.hostname).to.be.eql('netflix.com');
      expect(recOne.groupingKey).to.be.eql('Streaming');
      firstRecordId = recOne.$loki;
      done();
    });

    it('Inserts more records', (done) => {
      const recTwo = store.insert(Object.assign({}, dataMocks.recordTwo));
      expect(recTwo).to.have.all.keys(expectedRecordFields);
      
      const recThree = store.insert(Object.assign({}, dataMocks.recordThree));
      expect(recThree).to.have.all.keys(expectedRecordFields);

      done();
    });

    it('Record does exist', (done) => {
      const recordExists = store.recordExists(validSearchCriteria);
      
      expect(recordExists).to.be.true;
      done();
    });

    it('Record does not exist', (done) => {
      const recordExists = store.recordExists(invalidSearchCriteria);
      
      expect(recordExists).to.be.false;
      done();
    });

    it('Returns all records', (done) => {
      const allRecords = store.getAll();
      const recordsWithMetaDataStripped = allRecords.map((aRecord) => {
        const tmpObj = Object.assign({}, aRecord);
        delete tmpObj.$loki;
        delete tmpObj.meta;
        return tmpObj;
      });

      expect(allRecords.length).to.be.eql(3);
      expect(recordsWithMetaDataStripped).to.deep.eql(Object.values(dataMocks));
      done();
    });

    it('Record does update correctly', (done) => {
      store.updateExisting(updatedRecordOne);
      const found = Object.assign(store.getOne(validSearchCriteria));
      delete found.$loki;
      delete found.meta;
      const recordExists = store.recordExists(validSearchCriteria);
      
      expect(recordExists).to.be.true;
      expect(found).to.deep.eql(updatedRecordOne);
      done();
    });

    it('Returns an aggregation by Service Type of records', (done) => {
      const aggregatedData = store.aggregate();
      expect(aggregatedData).to.have.all.keys(['Streaming', 'OAuth']);
      expect(aggregatedData.Streaming.length).to.be.eql(2);
      expect(aggregatedData.OAuth.length).to.be.eql(1);
      done();
    });
  });
});
