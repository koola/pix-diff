'use strict';

const SpecReporter = require('jasmine-spec-reporter'),
    camelCase = require('camel-case');

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

//        env.clearReporters();

        env.addReporter(new SpecReporter({
            displayStacktrace: 'none',
            displayFailuresSummary: false,
            displayPendingSummary: false,
            displayPendingSpec: true,
            displaySpecDuration: true
        }));

        return browser.getProcessedConfig()
            .then(_ => {
                browser.browserName = camelCase(_.capabilities.browserName);
                browser.deviceName = camelCase(_.capabilities.name);
                browser.logName = camelCase(_.capabilities.logName);
                browser.devicePixelRatio = _.devicePixelRatio;
            });
    }
};