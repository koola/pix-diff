'use strict';

exports.config = {

    framework: 'jasmine2',

    baseUrl: 'http://example.wswebcreation.nl',

    specs: ['appium.android.spec.js'],

    capabilities: {
        // bare minimum
        browserName: 'chrome',                      // not case sensitive
        deviceName: 'AVD_for_Nexus_5_by_Google',    // Needs to be from the list of available AVD's
        platformName: 'android',                    // not case sensitive
        nativeWebScreenshot: true

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