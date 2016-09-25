'use strict';

exports.config = {

    framework: 'jasmine2',

    baseUrl: 'http://example.wswebcreation.nl',

    specs: ['appium.ios.spec.js'],

    capabilities: {
        browserName: 'safari',   // not case sensitive
        deviceName: 'iPhone 6',  // Needs to be form the list of available devices
        platformName: 'ios',     // not case sensitive
        platformVersion: '10.0' // needed for specific ios version
        // automationName: 'XCUITest'
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