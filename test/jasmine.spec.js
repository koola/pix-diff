'use strict';

var BlinkDiff = require('blink-diff'),
    fs = require('fs'),
    PixDiff = require('../');

describe('Pix-Diff', function() {

    beforeEach(function () {
        browser.get(browser.baseUrl);
    });

    describe('mathod matchers', function() {

        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots',
                width: 800,
                height: 600
            });
        });

        it('should save the screen', function () {
            var tagName = 'examplePage';

            browser.pixDiff.saveScreen(tagName).then(function () {
                expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-chrome-800x600.png')).toBe(true);
            });
        });

        it('should save the screen region', function () {
            var tagName = 'examplePageRegion';

            browser.pixDiff.saveRegion(element(by.css('div h1')), tagName).then(function () {
                expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-chrome-800x600.png')).toBe(true);
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
            browser.pixDiff.checkScreen('imagenotexst', {threshold: 1}).then(function () {
                fail('must not do a comparison.');
            }).catch(function () {
                // good
                errorThrown = true;
            }).then(function () {
                expect(errorThrown).toBe(true);
            });
        });
    });

    describe('format image name', function() {

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
                expect(fs.existsSync(__dirname + '/screenshots/TEST_' + tagName + '_chrome_800-600.png')).toBe(true);
            });
        });
    });
});
