const os = require('os');
const jsome = require('jsome');
const Store = require('../../../libs/store');
const Metrics = require('../../../libs/metrics');
const Protocol = require('../../../libs/protocol');
const chai = require('chai');
const mocks = require('../../mocks');
const Control = require('../../../index');

const { expect } = chai;

const control = new Control({
  os,
  updateIntervalSeconds: 1,
});

describe('Index Class', () => {
  describe('Control library construction', () => {
    it('Instantiates the Control object correctly', () => {
      expect(control).to.be.instanceof(Control);
    });

    it('Checks library properties', () => {
      expect(control).to.have.keys([
        'config',
        'store',
        'metrics',
        'protocol',
        'configIsGood',
        'registryService',
      ]);

      expect(control.store).to.be.instanceof(Store);

      expect(control.metrics).to.be.instanceof(Metrics);

      expect(control.protocol).to.be.instanceof(Protocol);
    });
  });

  describe('Control library configuration', () => {
    it('Config has required properties', () => {
      expect(control.config).to.have.keys([
        'os',
        'updateIntervalSeconds',
      ]);
    });
  });

  describe('Control library API is not modified', () => {
    const apiMethods = Object.getOwnPropertyNames(Control.prototype);
    expect(apiMethods).to.deep.equal([
      'constructor',
      'init',
      'isTLSService',
      'isTLSRegistry',
      'startTlSRegistryService',
      'startTLSClient',
      'stopTLSClient',
    ]);
  });
});
