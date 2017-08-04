'use strict';

let config = require('./protractor.shared.conf.js').config;

const desktopSpecs = ['../desktop.spec.js'];
const mobileSpecs = ['../mobile.spec.js'];

config.sauceUser = process.env.SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY;
config.sauceBuild = process.env.TRAVIS_JOB_NUMBER;

config.seleniumAddress = 'http://ondemand.saucelabs.com:80/wd/hub';

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
        appiumVersion: '1.6.3',
        browserName: 'Safari',
        deviceName: 'iPhone 6 Simulator',
        deviceOrientation: 'portrait',
        platformName: 'iOS',
        platformVersion: '10.0',
        logName: 'iPhone 6 Simulator Safari',
        'tunnel-identifier': config.sauceBuild,
        shardTestFiles: true,
        specs: mobileSpecs
    },
    {
        name: 'iPad',
        appiumVersion: '1.6.3',
        browserName: 'Safari',
        deviceName: 'iPad Air 2 Simulator',
        deviceOrientation: 'portrait',
        platformName: 'iOS',
        platformVersion: '10.0',
        logName: 'iPad Air 2 Simulator Safari',
        'tunnel-identifier': config.sauceBuild,
        shardTestFiles: true,
        specs: mobileSpecs
    },
    {
        name: 'Chrome',
        browserName: 'chrome',
        platform: 'Windows 10',
        version: 'latest',
        logName: 'Chrome ',
        screenResolution: '1400x1050',
        'tunnel-identifier': config.sauceBuild,
        shardTestFiles: true,
        specs: desktopSpecs
    },
//    {
//        name: 'Firefox',
//        browserName: 'firefox',
//        platform: 'Windows 10',
//        version: 'latest',
//        logName: 'Firefox ',
//        screenResolution: '1400x1050',
//        'tunnel-identifier': config.sauceBuild,
//        shardTestFiles: true,
//        specs: desktopSpecs
//    },
    {
        name: 'Internet Explorer',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11.0',
        logName: 'IE ',
        screenResolution: '1400x1050',
        'tunnel-identifier': config.sauceBuild,
        shardTestFiles: true,
        specs: desktopSpecs
    },
    {
        name: 'Microsoft Edge',
        browserName: 'MicrosoftEdge',
        platform: 'Windows 10',
        version: 'latest',
        logName: 'Microsoft Edge ',
        screenResolution: '1400x1050',
        'tunnel-identifier': config.sauceBuild,
        shardTestFiles: true,
        specs: desktopSpecs
    },
    {
        name: 'Safari',
        browserName: 'safari',
        platform: 'OS X 10.11',
        version: '9',
        logName: 'Safari #1 ',
        screenResolution: '1600x1200',
        'tunnel-identifier': config.sauceBuild,
        shardTestFiles: true,
        specs: desktopSpecs
    },
    {
        name: 'Safari',
        browserName: 'safari',
        platform: 'OS X 10.11',
        version: '10',
        logName: 'Safari #2 ',
        screenResolution: '1600x1200',
        'tunnel-identifier': config.sauceBuild,
        shardTestFiles: true,
        specs: desktopSpecs
    }
];

exports.config = config;