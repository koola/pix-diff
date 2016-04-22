'use strict';

exports.config = {

    framework: 'jasmine2',

    baseUrl: 'http://www.example.com',

    specs: ['jasmine.spec.js'],

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ['--no-sandbox']
        }
    },

    directConnect: true,

    onPrepare: function() {
        var PixDiff = require('../');
        browser.pixDiff = new PixDiff({
            basePath: 'test/screenshots',
            width: 800,
            height: 600
        });

        browser.ignoreSynchronization = true;
    },

    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000,
        showColors: true
    }
};