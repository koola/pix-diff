'use strict';

var BlinkDiff = require('blink-diff'),
    fs = require('fs'),
    PixDiff = require('../');

describe('Pix-Diff', function () {

    var browserName = browser.browserName,
        headerElement = element(by.css('h1.page-header')),
        alertSuccessSmall = element(by.css('.uk-alert-success'));

    beforeEach(function () {
        browser.get(browser.baseUrl);
    });

    describe('method matchers', function () {

        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots',
                width: 800,
                height: 600
            });
        });

        it('should get a device pixel ratio', function () {
            expect(browser.pixDiff.devicePixelRatio).not.toBeUndefined();
        });

        it('should save the screen', function () {
            var tagName = 'examplePage';

            browser.pixDiff.saveScreen(tagName).then(function () {
                expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-' + browserName + '-800x600.png')).toBe(true);
            });
        });

        it('should save the screen region', function () {
            var tagName = 'examplePageRegion';

            browser.pixDiff.saveRegion(headerElement, tagName).then(function () {
                expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-' + browserName + '-800x600.png')).toBe(true);
            });
        });

        it('should match the page', function () {
            browser.pixDiff.checkScreen('examplePage').then(function (result) {
                expect(result.code).toEqual(BlinkDiff.RESULT_IDENTICAL);
            });
        });

        it('should match the page with custom matcher', function () {
            expect(browser.pixDiff.checkScreen('examplePage')).toMatchScreen();
        });

        it('should not match the page', function () {
            browser.pixDiff.checkScreen('exampleFail', {threshold: 1}).then(function (result) {
                expect(result.code).toEqual(BlinkDiff.RESULT_DIFFERENT);
            });
        });

        it('should not match the page with custom matcher', function () {
            expect(browser.pixDiff.checkScreen('exampleFail', {threshold: 1})).not.toMatchScreen();
        });

        it('should not crash with image not found', function () {
            browser.pixDiff.checkScreen('imageNotExist', {threshold: 1}).then(function () {
                fail('should not be called');
            }, function (error) {
                expect(error.message).toContain('no such file or directory');
            });
        });
    });

    describe('format image name', function () {

        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots',
                width: 800,
                height: 600,
                formatImageOptions: {'env': 'TEST'},
                formatImageName: '{env}_{tag}_{browserName}_{width}-{height}'
            });
        });

        it('should save screen with formatted basename', function () {
            var tagName = 'customImageName';

            browser.pixDiff.saveScreen(tagName).then(function () {
                expect(fs.existsSync(__dirname + '/screenshots/TEST_' + tagName + '_' + browserName + '_800-600.png')).toBe(true);
            });
        });
    });

    describe('scroll into view', function () {

        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots',
                width: 800,
                height: 600
            });

            browser.scrolledPage = browser.executeScript('arguments[0].scrollIntoView();', alertSuccessSmall.getWebElement());
        });

        it('should save a scrolled screen', function () {
            browser.scrolledPage.then(function () {
                browser.pixDiff.saveScreen('scrolledPage');
            });
        });

        it('should save a scrolled screen region', function () {
            browser.scrolledPage.then(function () {
                browser.pixDiff.saveRegion(alertSuccessSmall, 'scrolledPageRegion');
            });
        });
    });

    describe('baseline', function () {

        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots',
                baseline: true,
                width: 800,
                height: 600
            });
        });

        it('should save a screen when baseline image not found', function () {
            browser.pixDiff.checkScreen('baselineScreen').then(function () {
                fail('should not be called');
            }, function (error) {
                expect(error.message).toContain('Image not found');
            });
        });

        it('should use existing baseline image', function () {
            expect(browser.pixDiff.checkScreen('baselineScreen')).toMatchScreen();
        });

        it('should save a screen region when baseline image not found', function () {
            browser.pixDiff.checkRegion(headerElement, 'baselineRegion').then(function () {
                fail('should not be called');
            }, function (error) {
                expect(error.message).toContain('Image not found');
            });
        });

        it('should use existing baseline image', function () {
            expect(browser.pixDiff.checkRegion(headerElement, 'baselineRegion')).toMatchScreen();
        });
    });
});
