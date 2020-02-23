const mocks = {
  configA: {
    serviceName: 'ServiceName_configA', // A name to easily identify the service being monitored
    updateIntervalSeconds: 1, // Time interval, in seconds, between updates
    role: 'tlsService', // Role can either be 'service' or 'registry'
    groupingKey: 'ServiceGroup_configA', // A grouping key so all the services of the same type are hold together
    registryHost: 'localhost', // The host against to which the service should send updates/register
    registryPort: 50000, // The port against to which the service should send updates/register
    clientKey: `${__dirname}certs/client/client.key`,
    clientCert: `${__dirname}certs/client/client.crt`,
    ca: `${__dirname}certs/ca/ca.crt`,
    useSelfSignedCerts: true,
    makeClientThrow: false,
    clientShouldUseCerts: false, // If true the registry should have requestCert set to true
  },
};

module.exports = mocks;
