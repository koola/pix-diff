'use strict';

var fs = require('fs'),
    PixDiff = require('../../');

describe('Pix-Diff Android', function () {

    var headerElement = element.all(by.css('div h2')).get(2);

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

        it('should save the screen', function (done) {
            var tagName = 'examplePage';

            browser.pixDiff.saveScreen(tagName).then(function () {
                expect(fs.existsSync(__dirname + '/../screenshots/'+ tagName +'-browser-720x1280.png')).toBe(true);
                done();
            });
        });

        it('should save the screen region', function (done) {
            var tagName = 'examplePageRegion';

            browser.pixDiff.saveRegion(element(by.css('h1')), tagName).then(function () {
                expect(fs.existsSync(__dirname + '/../screenshots/'+ tagName +'-browser-720x1280.png')).toBe(true);
                done();
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

    describe('scroll into view', function () {

        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots'
            });

            browser.scrolledPage = browser.executeScript('arguments[0].scrollIntoView();', headerElement.getWebElement());
        });

        it('should save a scrolled screen', function (done) {
            browser.scrolledPage.then(function () {
                browser.pixDiff.saveScreen('scrolledPage');
                done();
            });
        });

        it('should save a scrolled screen region', function (done) {
            browser.scrolledPage.then(function () {
                browser.pixDiff.saveRegion(headerElement, 'scrolledPageRegion');
                done();
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
                expect(fs.existsSync(__dirname + '/../screenshots/TEST_appium_browser_samsungGalaxyS4Emulator_dpr_2_720-1280.png')).toBe(true);
            });
        });
    });

});
