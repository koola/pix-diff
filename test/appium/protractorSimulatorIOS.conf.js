'use strict';

exports.config = {

    seleniumAddress: 'http://localhost:4445/wd/hub',

    framework: 'jasmine2',

    baseUrl: 'http://getbootstrap.com/2.3.2/examples/hero.html',

    specs: ['jasmineSafari.spec.js'],

    multiCapabilities: [
        {
            name: 'iOS Safari',
            deviceName:'iPhone Simulator',
            browserName: '',
            platformName:'ios',
            platformVersion:'9.3',
            app:'safari',
            username: process.env.SAUCE_USERNAME,
            accessKey: process.env.SAUCE_ACCESS_KEY
        }],

    onPrepare: function () {
        browser.ignoreSynchronization = true;
    },

    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000,
        showColors: true
    }
};