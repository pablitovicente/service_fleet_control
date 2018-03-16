# Service Fleet Control [![Build Status](https://travis-ci.org/pablitovicente/service_fleet_control.svg?branch=master)](https://travis-ci.org/pablitovicente/service_fleet_control) [![Maintainability](https://api.codeclimate.com/v1/badges/a2110cffbdb6fa57caaf/maintainability)](https://codeclimate.com/github/pablitovicente/service_fleet_control/maintainability)



> A module for service discovery and health status check for your fleet of microservices
> Include it in your nodejs services and implement a registry server using this module so 
>you can have information about the status of all of your services.
>
> You only need to configure the module in your clients and you can know at any time what
> services are up, in what host, what are the basic OS metrics and what your NodeJS service 
> memory usage is.

## ALPHA STILL IN DEVELOPMENT! 
* Non secure Net Client/Server has been deprecated; check the new examples
* The module can already be used for studying its behaviour


## Install

```bash
npm i -save service_fleet_control
```

## @TODO before reaching an stable API & Protocol 
* ~~Implement Registry Server~~
* ~~Method for retreiving the data~~
* ~~Add usage examples~~
* ~~Mark offline hosts  via status property 'online'~~
* ~~Error Handling for net/tls!~~
* ~~Encryption~~
* ~~Remove code duplication after TLS support added~~
* ~~Extract DB methods to its own class~~
* ~~Make TLS Client Certs Optional~~
* ~~Implement correct data buffering to support large payloads~~
* Define inital protocol
* Improve Buffer Logic (Move to Class)
* Don't depend on data arrival to registry for refreshing status. Update via interval.
* Full Error Checking!
* Add more test coverage
* Refactor for solving the poor composition/DI implementations
* Refactor classes using better patterns
* Add validation schemas for both Service and Registry
* Create a full sample implementation
* Drop JSON for Protocol Buffers
* Add compression (For basic JSON data is not worth - need to research more)


## General Concept

* The module allows for the creation of either a `Service Registry` or `Service Client`
* The Registry listens for updates from clients and keeps track of them
* The Clients send updates to the Registry
* The general idea is that the Registry provides a single point for obtaining information about the health of your micro-services
* Instead of using HTTP it uses TCP to keep the memory & cpu footpring as low as possible

## Usage

* See ./examples/ folder to check how to use this module for your services (Full app example will be created in the comming weeks)
* The examples have a very low update interval in a real world scenario you will probably check less often than a second
* Although traffic is encrypted you should never open services ports until they are mature enough so you should use your internal network and proxy the data through another service to the outside world

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

# Credits
* [Heziode](https://github.com/Heziode) for the best [script](https://github.com/Heziode/Simple-TLS-Client-Server-with-Node.js/blob/master/genkey.sh) for generating certificates for client/server.
* The local 'Pizza Dev Team' for inspiring me to learn more.

## License

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)

[npm-image]: https://img.shields.io/npm/v/live-xxx.svg
[npm-url]: https://www.npmjs.com/package/kaos_control
