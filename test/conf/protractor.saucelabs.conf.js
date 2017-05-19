'use strict';

let config = require('./protractor.shared.conf.js').config;
let SauceLabs = require('saucelabs');

const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;
const TRAVIS_JOB_ID = process.env.TRAVIS_JOB_NUMBER;
const desktopSpecs = ['../desktop.spec.js'];
const mobileSpecs = ['../mobile.spec.js'];

let JOB_ID;

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
        appiumVersion: "1.6.3",
        browserName: 'Safari',
        deviceName: "iPhone 6 Simulator",
        deviceOrientation: "portrait",
        platformName: 'iOS',
        platformVersion: '10.0',
        logName: 'iPhone 6 Simulator Safari',
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: TRAVIS_JOB_ID,
        'tunnel-identifier': TRAVIS_JOB_ID,
        shardTestFiles: true,
        specs: mobileSpecs
    },
    {
        name: 'iPad',
        appiumVersion: "1.6.3",
        browserName: 'Safari',
        deviceName: "iPad Air 2 Simulator",
        deviceOrientation: "portrait",
        platformName: 'iOS',
        platformVersion: '10.0',
        logName: 'iPad Air 2 Simulator Safari',
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: TRAVIS_JOB_ID,
        'tunnel-identifier': TRAVIS_JOB_ID,
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
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: TRAVIS_JOB_ID,
        'tunnel-identifier': TRAVIS_JOB_ID,
        shardTestFiles: true,
        specs: desktopSpecs
    },
    {
        name: 'Firefox',
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'latest',
        logName: 'Firefox ',
        screenResolution: '1400x1050',
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: TRAVIS_JOB_ID,
        'tunnel-identifier': TRAVIS_JOB_ID,
        shardTestFiles: true,
        specs: desktopSpecs
    },
    {
        name: 'Internet Explorer',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11.0',
        logName: 'Internet Explorer 11',
        screenResolution: '1400x1050',
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: TRAVIS_JOB_ID,
        'tunnel-identifier': TRAVIS_JOB_ID,
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
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: TRAVIS_JOB_ID,
        'tunnel-identifier': TRAVIS_JOB_ID,
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
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: TRAVIS_JOB_ID,
        'tunnel-identifier': TRAVIS_JOB_ID,
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
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: TRAVIS_JOB_ID,
        'tunnel-identifier': TRAVIS_JOB_ID,
        shardTestFiles: true,
        specs: desktopSpecs
    }
];

config.onComplete = function () {
    return browser.getSession().then(session => {
        JOB_ID = session.getId();
    });
};

config.onCleanUp = function (exitCode) {
    const saucelabs = new SauceLabs({
        username: SAUCE_USERNAME,
        password: SAUCE_ACCESS_KEY
    });

    return new Promise((resolve, reject) => {
        saucelabs.updateJob(JOB_ID, {
                passed: exitCode === 0
            },
            () => resolve(),
            error => reject('Error:', error));
    });
};

exports.config = config;