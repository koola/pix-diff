'use strict';

exports.config = {

    framework: 'jasmine2',

    baseUrl: 'http://www.example.com',

    specs: ['appium.ios.spec.js'],

    capabilities: {
        browserName: 'safari',   // not case sensitive
        deviceName: 'iPhone 6',  // Needs to be form the list of available devices
        platformName: 'ios',     // not case sensitive
        platformVersion: '9.3',  // needed for specific ios version

    },
    seleniumAddress: 'http://localhost:4726/wd/hub',

    onPrepare: function () {
        browser.ignoreSynchronization = true;
    },

    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000,
        showColors: true
    }
};