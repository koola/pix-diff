'use strict';

var BlinkDiff = require('blink-diff'),
    fs = require('fs'),
    PixDiff = require('../');

describe('Pix-Diff', function () {

    var browserName = browser.browserName;

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

            browser.pixDiff.saveRegion(element(by.css('div h1')), tagName).then(function () {
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
            browser.pixDiff.checkScreen('example-fail', {threshold: 1}).then(function (result) {
                expect(result.code).toEqual(BlinkDiff.RESULT_DIFFERENT);
            });
        });

        it('should not match the page with custom matcher', function () {
            expect(browser.pixDiff.checkScreen('exampleFail', {threshold: 1})).not.toMatchScreen();
        });

        it('should not crash with image not found', function () {
            var errorThrown = false;
            browser.pixDiff.checkScreen('imageNotExist', {threshold: 1}).then(function () {
                fail('must not do a comparison.');
            }).catch(function () {
                errorThrown = true;
            }).then(function () {
                expect(errorThrown).toBe(true);
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
            var tagName = 'customName';

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
                height: 200
            });
        });

        it('should save a scrolled screen', function () {
            var tagName = 'scrolledPage',
                headerElement = element(by.css('div h1'));

            browser.executeScript('arguments[0].scrollIntoView();', headerElement.getWebElement())
                .then(function () {
                    browser.pixDiff.saveScreen(tagName);
                });
        });

        it('should save a scrolled screen region', function () {
            var tagName = 'scrolledPageRegion',
                headerElement = element(by.css('div h1'));

            browser.executeScript('arguments[0].scrollIntoView();', headerElement.getWebElement())
                .then(function () {
                    browser.pixDiff.saveRegion(element(by.css('div h1')), tagName);
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
            browser.pixDiff.checkScreen('baselineScreen').catch(function (err) {
                expect(err.message).toContain('Image not found');
            });
        });

        it('should use existing baseline image', function () {
            expect(browser.pixDiff.checkScreen('baselineScreen')).toMatchScreen();
        });

        it('should save a screen region when baseline image not found', function () {
            var headerElement = element(by.css('div h1'));

            browser.pixDiff.checkRegion(headerElement, 'baselineRegion').catch(function (err) {
                expect(err.message).toContain('Image not found');
            });
        });

        it('should use existing baseline image', function () {
            var headerElement = element(by.css('div h1'));

            expect(browser.pixDiff.checkRegion(headerElement, 'baselineRegion')).toMatchScreen();
        });
    });
});
