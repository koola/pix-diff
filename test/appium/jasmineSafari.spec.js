'use strict';

var fs = require('fs'),
    PixDiff = require('../../');

describe('Pix-Diff iOS', function () {

    var headerElement = element(by.css('div h1'));

    beforeEach(function () {
        browser.get(browser.baseUrl);
    });

    describe('method matchers', function () {

        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots'
            });
        });

        it('should get a device pixel ratio', function () {
            expect(browser.pixDiff.devicePixelRatio).not.toBeUndefined();
        });

        it('should save the screen', function () {
            var tagName = 'examplePage';

            browser.pixDiff.saveScreen(tagName).then(function () {
                expect(fs.existsSync(__dirname + '/../screenshots/'+ tagName +'-safari-750x1334.png')).toBe(true);
            });
        });

        it('should save the screen region', function () {
            var tagName = 'examplePageRegion';

            browser.pixDiff.saveRegion(headerElement, tagName).then(function () {
                expect(fs.existsSync(__dirname + '/../screenshots/'+ tagName +'-safari-750x1334.png')).toBe(true);
            });
        });

        it('should match the page with custom matcher', function () {
            expect(browser.pixDiff.checkScreen('examplePage')).toMatchScreen();
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
                formatImageOptions: {'env': 'TEST'},
                formatImageName: '{env}_{tag}_{browserName}_{deviceName}_dpr_{dpr}_{width}-{height}'
            });
        });

        it('should save screen with formatted basename', function () {
            browser.pixDiff.saveScreen('appium').then(function () {
                expect(fs.existsSync(__dirname + '/../screenshots/TEST_appium_safari_iPhoneSimulator_dpr_2_750-1334.png')).toBe(true);
            });
        });
    });

});
