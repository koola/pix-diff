'use strict';

let config = require('./protractor.shared.conf.js').config;

config.directConnect = true;

config.specs = ['../jasmine.spec.js'];

config.devicePixelRatio = { 'chrome': 2, 'firefox': 1 };

config.multiCapabilities = [
    {
        applicationName: 'Chrome',
        browserName: 'chrome',
        logName: 'Chrome',
        maxInstances: 2,
        shardTestFiles: true
    }
//    {
//        applicationName: 'firefox',
//        browserName: 'firefox',
//        logName: 'Firefox',
//        maxInstances: 2,
//        shardTestFiles: true
//    }
];

exports.config = config;