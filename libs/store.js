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

class Store {
  constructor(config, DbDriver, _groupBy) {
    this.config = config;
    this.DbDriver = DbDriver;
    this.groupBy = _groupBy;
    this.db = new this.DbDriver(this.config.dbName);
    this.collection = null;

    this.setupRegistryCollection();
  }

  setupRegistryCollection() {
    this.collection = this.db.addCollection(this.config.dbCollection, {
      indices: ['groupingKey', 'metrics.hostname'],
    });
  }

  getAll() {
    return this.collection.find();
  }

  insert(record) {
    this.collection.insert(record);
  }

  updateExisting(serviceUpdate) {
    const current = this.collection.findObject({
      groupingKey: serviceUpdate.groupingKey,
      'metrics.hostname': serviceUpdate.metrics.hostname,
    });

    if (current != null) {
      const currentKeys = Object.keys(current);
      currentKeys.forEach((aKey) => {
        if (aKey !== 'meta' && aKey !== '$loki') {
          current[aKey] = serviceUpdate[aKey];
        }
      });
      this.collection.update(current);
    }
  }

  recordExists(filter) {
    return this.collection.find(filter).length > 0;
  }

  aggregate() {
    return this.groupBy(this.getAll(), aService => aService.groupingKey);
  }
}

module.exports = Store;
