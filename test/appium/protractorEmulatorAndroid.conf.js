'use strict';

exports.config = {

    seleniumAddress: 'http://localhost:4445/wd/hub',

    framework: 'jasmine2',

    baseUrl: 'http://getbootstrap.com/2.3.2/examples/hero.html',

    specs: ['jasmineAndroidBrowser.spec.js'],

    capabilities: {
        name: 'Android Browser',
        deviceName:'Samsung Galaxy S4 Emulator',
        browserName: '',
        platformName:'Android',
        platformVersion:'4.4',
        app: 'browser',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY
    },

    onPrepare: function () {
        browser.ignoreSynchronization = true;
    },

    jasmineNodeOpts: {
        defaultTimeoutInterval: 600000,
        showColors: true
    }
};