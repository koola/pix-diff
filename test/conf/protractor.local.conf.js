'use strict';

let config = require('./protractor.shared.conf.js').config;

config.directConnect = true;

config.specs = ['../jasmine.spec.js'];

config.devicePixelRatio = { 'chrome': 2, 'firefox': 1 };

config.multiCapabilities = [
    {
        browserName: 'chrome',
        logName: 'Chrome',
        chromeOptions: {
            args: ['disable-infobars']
        }
    }
];

exports.config = config;