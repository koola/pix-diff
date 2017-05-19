'use strict';

const PixDiff = require('../../'),
    SpecReporter = require('jasmine-spec-reporter'),
    camelCase = require('../../lib/camelCase');

exports.config = {
    baseUrl: 'http://getbootstrap.com/2.3.2/examples/hero.html',

    framework: 'jasmine2',

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 120000,
        isVerbose: true,
        includeStackTrace: true,
        print: function () {}
    },

    onPrepare: function () {
        browser.ignoreSynchronization = true;

        let env = jasmine.getEnv();

        env.addReporter(new SpecReporter({
            displayStacktrace: 'none',
            displayFailuresSummary: false,
            displayPendingSummary: false,
            displayPendingSpec: true,
            displaySpecDuration: true
        }));

        PixDiff.loadMatchers();

        return browser.getProcessedConfig().then(_ => {
            let testConfig = {
                browserName: camelCase(_.capabilities.browserName),
                deviceName: camelCase(_.capabilities.name),
                logName: camelCase(_.capabilities.logName),
                width: 1366,
                height: 768
            };
            testConfig.devicePixelRatio = _.devicePixelRatio[testConfig.browserName];
            testConfig.dprWidth = testConfig.width * testConfig.devicePixelRatio;
            testConfig.dprHeight = testConfig.height * testConfig.devicePixelRatio;

            browser.testConfig = testConfig;
            browser.isChrome = testConfig.browserName === 'chrome';
        });
    }
};