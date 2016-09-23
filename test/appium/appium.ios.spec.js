'use strict';

var BlinkDiff = require('blink-diff'),
    fs = require('fs'),
    PixDiff = require('../../index');

describe('Pix-Diff', function() {

    beforeEach(function () {
        browser.get(browser.baseUrl);
    });

    describe('method matchers', function() {

        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots'
            });
        });

        it('should save the screen', function () {
            var tagName = 'examplePage';

            browser.pixDiff.saveScreen(tagName).then(function () {
                expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-safari-375x667.png')).toBe(true);
            });
        });

        it('should save the screen region', function () {
            var tagName = 'examplePageRegion';

            browser.pixDiff.saveRegion(element(by.css('div h1')), tagName).then(function () {
                expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-safari-375x667.png')).toBe(true);
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
                formatImageOptions: {'env': 'TEST'},
                formatImageName: '{env}_{tag}_{deviceName}_dpr_{dpr}_{width}-{height}'
            });
        });

        it('should save screen with formatted basename', function () {
            var tagName = 'appium';

            browser.pixDiff.saveScreen(tagName).then(function () {
                expect(fs.existsSync(__dirname + '/screenshots/TEST_' + tagName + '_iPhone_6_dpr_2_375-667.png')).toBe(true);
            });
        });
    });

    describe('scroll into view', function () {
        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots',
            });

            browser.executeScript(changeMarginTop);

            /**
             * changeMarginTop
             * Add extra margin to top to be able to scroll
             */
            function changeMarginTop() {
                var css = 'div h1 {' +
                        'margin-top: 1200px !important;' +
                        '}',
                    head = document.head || document.getElementsByTagName('head')[0],
                    style = document.createElement('style');

                style.type = 'text/css';
                style.appendChild(document.createTextNode(css));
                head.appendChild(style);
            }
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
});
