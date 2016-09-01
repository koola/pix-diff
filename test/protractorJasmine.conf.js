'use strict';

exports.config = {

    framework: 'jasmine2',

    baseUrl: 'http://www.example.com',

    specs: ['jasmine.spec.js'],

    multiCapabilities: [
        {
            browserName: 'chrome',
            chromeOptions: {
                args: ['--no-sandbox']
            }
        },
        {
            browserName: 'firefox'
        }],

    directConnect: true,

    onPrepare: function () {
        browser.ignoreSynchronization = true;

        return browser.getProcessedConfig()
            .then(function(config){
                browser.browserName = config.capabilities.browserName.toLowerCase();
            });
    },

    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000,
        showColors: true
    }
};