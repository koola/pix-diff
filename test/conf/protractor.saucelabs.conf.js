'use strict';

let config = require('./protractor.shared.conf.js').config;

const sauceUsername = process.env.SAUCE_USERNAME,
    sauceAccessKey = process.env.SAUCE_ACCESS_KEY,
    travisBuild = process.env.TRAVIS_JOB_NUMBER,
    desktopSpecs = ['../jasmine.spec.js'],
    mobileSpecs = ['../mobile.spec.js'];

config.seleniumAddress = travisBuild ? 'http://localhost:4445/wd/hub' : 'http://ondemand.saucelabs.com:80/wd/hub';

config.devicePixelRatio = {
    'chrome': 1,
    'firefox': 1,
    'internetExplorer': 1,
    'microsoftEdge': 1,
    'safari': 1
};

config.multiCapabilities = [
    {
        name: 'iPhone',
        browserName: 'Safari',
        deviceName: 'iPhone Simulator',
        platformName: 'iOS',
        platformVersion: '10.0',
        logName: 'iPhone 6 Simulator Safari',
        username: sauceUsername,
        accessKey: sauceAccessKey,
        build: travisBuild,
        'tunnel-identifier': travisBuild,
        shardTestFiles: true,
        passed: true,
        specs: mobileSpecs
    },
    {
        name: 'iPad',
        appiumVersion: '1.6.0',
        browserName: 'Safari',
        deviceName: 'iPad Simulator',
        platformName: 'iOS',
        platformVersion: '10.0',
        logName: 'iPad Air 2 Simulator Safari',
        username: sauceUsername,
        accessKey: sauceAccessKey,
        build: travisBuild,
        'tunnel-identifier': travisBuild,
        shardTestFiles: true,
        passed: true,
        specs: mobileSpecs
    },
    {
        name: 'Chrome',
        browserName: 'chrome',
        platform: 'Windows 10',
        version: 'latest',
        logName: 'Chrome latest',
        screenResolution: '1400x1050',
        username: sauceUsername,
        accessKey: sauceAccessKey,
        build: travisBuild,
        'tunnel-identifier': travisBuild,
        shardTestFiles: true,
        passed: true,
        specs: desktopSpecs
    },
    {
        name: 'Firefox',
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'latest',
        logName: 'Firefox latest',
        screenResolution: '1400x1050',
        username: sauceUsername,
        accessKey: sauceAccessKey,
        build: travisBuild,
        'tunnel-identifier': travisBuild,
        shardTestFiles: true,
        passed: true,
        specs: desktopSpecs
    },
    {
        name: 'Internet Explorer',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11.0',
        logName: 'Internet Explorer 11',
        screenResolution: '1400x1050',
        username: sauceUsername,
        accessKey: sauceAccessKey,
        build: travisBuild,
        'tunnel-identifier': travisBuild,
        shardTestFiles: true,
        passed: true,
        specs: desktopSpecs
    },
    {
        name: 'Microsoft Edge',
        browserName: 'MicrosoftEdge',
        platform: 'Windows 10',
        version: 'latest',
        logName: 'Microsoft Edge latest',
        screenResolution: '1400x1050',
        username: sauceUsername,
        accessKey: sauceAccessKey,
        build: travisBuild,
        'tunnel-identifier': travisBuild,
        shardTestFiles: true,
        passed: true,
        specs: desktopSpecs
    },
    {
        name: 'Safari',
        browserName: 'safari',
        platform: 'OS X 10.11',
        version: '9',
        logName: 'Safari 9',
        screenResolution: '1600x1200',
        username: sauceUsername,
        accessKey: sauceAccessKey,
        build: travisBuild,
        'tunnel-identifier': travisBuild,
        shardTestFiles: true,
        passed: true,
        specs: desktopSpecs
    },
    {
        name: 'Safari',
        browserName: 'safari',
        platform: 'OS X 10.11',
        version: '10',
        logName: 'Safari 10',
        screenResolution: '1600x1200',
        username: sauceUsername,
        accessKey: sauceAccessKey,
        build: travisBuild,
        'tunnel-identifier': travisBuild,
        shardTestFiles: true,
        passed: true,
        specs: desktopSpecs
    }
];

exports.config = config;