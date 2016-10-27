'use strict';

exports.config = {

    seleniumAddress: 'http://localhost:4445/wd/hub',

    framework: 'jasmine2',

    baseUrl: 'http://getbootstrap.com/2.3.2/examples/hero.html',

    specs: ['jasmineSafari.spec.js'],

    capabilities: {
        name: 'iOS Safari',
        deviceName:'iPhone Simulator',
        browserName: '',
        platformName:'ios',
        platformVersion:'9.3',
        app:'safari',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
    },

    onPrepare: function () {
        browser.ignoreSynchronization = true;
    },

    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000,
        showColors: true
    }
};