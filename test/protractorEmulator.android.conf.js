'use strict';

exports.config = {

    framework: 'jasmine2',

    baseUrl: 'http://www.example.com',

    specs: ['appium.android.spec.js'],

    capabilities: {
        // IOS
        // bare minimum
        browserName: 'chrome',      // not case sensitive
        deviceName: 'AVD_for_Nexus_6_by_Google',     // Needs to be form the list of available devices
        platformName: 'android',    // not case sensitive

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