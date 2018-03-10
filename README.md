# Service Fleet Control [![Build Status](https://travis-ci.org/pablitovicente/kaos_control.svg?branch=master)](https://travis-ci.org/pablitovicente/kaos_control)[![Maintainability](https://api.codeclimate.com/v1/badges/55329212248ff0e5c5c4/maintainability)](https://codeclimate.com/github/pablitovicente/kaos_control/maintainability)

ALPHA STILL IN DEVELOPMENT! 

> A module for service discovery and health status check for your fleet of microservices

## Install

```bash
npm i -save service_fleet_control
```

## @TODO before this can be used
* ~~Implement Registry Server~~
* Encryption
* ~~Better Error Handling~~
* 'Garbage collect' clients that do not report in time
* Refactor for solving the poor composition implementation
* ~~Expose a REST API to obtain the data~~ Now exposes a method for the implementer to use
* Add validation schemas for both Service and Registry
* Drop JSON for Protocol Buffers
* Add more test coverage
* Refactor classes using better patterns
* ~~Add usage examples~~

## General Concept

* The module allows for the creation of either a `Service Registry` or `Service Client`
* The Registry listens for updates from clients and keeps track of them
* The Clients send updates to the Registry
* The general idea is that the Registry provides a single point for obtaining information about the health of your micro-services
* Instead of using HTTP it uses TCP to keep the memory & cpu footpring as low as possible

## Usage

See ./examples/ folder.

## Debugging
This module uses the Debug module for debugging for example for developement start the apps with

```bash
DEBUG=SFC,SFC_registry node your_registry_implementation_or_service_using_the_module.js
```

Namespaces are:
* SFC for main module
* SFC_registry for the registry lib
* SFC_client for the client lib

## Future Features!
* Allow Services to comunicate its API via swagger or graphql
* Allow Registry to shootdown Services via exposition of an API

## Using this module? 
* Please leave feedback and ideas in its Github Issues Section!
* Ideas and Collaborators welcome!
* If this is useful for you donate to an Environmental Organization or Local School needing resources :)

## License

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)

[npm-image]: https://img.shields.io/npm/v/live-xxx.svg
[npm-url]: https://www.npmjs.com/package/kaos_control
