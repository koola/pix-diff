'use strict';

exports.config = {

    framework: 'mocha',

    baseUrl: 'http://www.example.com',

    specs: ['mocha.spec.js'],

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ['--no-sandbox']
        }
    },

    directConnect: true,

    onPrepare: function() {
        var chai = require('chai');
        chai.config.truncateThreshold = 0;

        browser.ignoreSynchronization = true;
    },

    mochaOpts: {
        enableTimeouts: false,
        reporter: 'spec',
        slow: 3000,
        ui: 'bdd'
    }
};