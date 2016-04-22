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

    onPrepare: function() {
        var chai = require('chai').use(require('chai-as-promised'));
        chai.config.truncateThreshold = 0;

        var PixDiff = require('../');
        browser.pixDiff = new PixDiff({
            basePath: 'test/screenshots',
            width: 800,
            height: 600
        });

        browser.ignoreSynchronization = true;
    },

    mochaOpts: {
        enableTimeouts: false,
        reporter: 'spec',
        slow: 3000,
        ui: 'bdd'
    }
};