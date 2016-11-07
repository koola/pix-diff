let config = require('./protractor.shared.conf.js').config;

config.directConnect = true;

config.specs= ['../jasmine.spec.js'];

config.multiCapabilities = [
    {
        applicationName: "Chrome",
        browserName: 'chrome',
        logName: "Chrome",
        maxInstances: 10,
        shardTestFiles: true
    },
    {
        applicationName: 'firefox',
        browserName: 'firefox',
        logName: 'Firefox',
        maxInstances: 10,
        shardTestFiles: true
    }
];

exports.config = config;