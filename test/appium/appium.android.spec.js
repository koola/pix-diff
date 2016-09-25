'use strict';

var BlinkDiff = require('blink-diff'),
    fs = require('fs'),
    PixDiff = require('../../index'),
    path = require('path'),
    screenshotPath = path.resolve(__dirname, '../screenshots/');

describe('Pix-Diff', function () {
    var bannerHeader = element(by.css('h1.page-header')),
        alertSuccessSmall = element(by.css('.uk-alert-success')),
        ADBScreenshot;

    beforeEach(function () {
        browser.get(browser.baseUrl)
            .then(function () {
                // Needed to be sure that the scrollbar is gone
                browser.sleep(1000);
                return browser.getProcessedConfig();
            })
            .then(function(_){
                ADBScreenshot = _.capabilities.nativeWebScreenshot || false;
            });
    });

    describe('method matchers', function () {
        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots',
                androidNative: ADBScreenshot
            });
        });

        it('should save the screen', function () {
            var tagName = 'examplePage';

            browser.pixDiff.saveScreen(tagName)
                .then(function () {
                    expect(fs.existsSync(screenshotPath + '/' + tagName + '-chrome-360x640.png')).toBe(true);
                });
        });

        fit('should save the screen region', function () {
            var tagName = 'examplePageRegion';

            browser.pixDiff.saveRegion(bannerHeader, tagName).then(function () {
                expect(fs.existsSync(screenshotPath + '/' + tagName + '-chrome-360x640.png')).toBe(true);
            });
        });

        it('should match the page', function () {
            return browser.pixDiff.checkScreen('examplePage')
                .then(function (result) {
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

    describe('format image name', function () {
        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots',
                formatImageOptions: {'env': 'TEST'},
                formatImageName: '{env}_{tag}_{deviceName}_dpr_{dpr}_{width}-{height}',
                androidNative: ADBScreenshot
            });
        });

        it('should save screen with formatted basename', function () {
            var tagName = 'appium';

            browser.pixDiff.saveScreen(tagName).then(function () {
                expect(fs.existsSync(screenshotPath + '/TEST_' + tagName + '_avdForNexus5ByGoogle_dpr_3_360-640.png')).toBe(true);
            });
        });
    });

    describe('scroll into view', function () {
        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots',
                androidNative: ADBScreenshot
            });
        });

        it('should save a scrolled screen', function () {
            var tagName = 'scrolledPage';

            browser.executeScript('arguments[0].scrollIntoView();', alertSuccessSmall.getWebElement())
                .then(function () {
                    if(ADBScreenshot) {
                        browser.sleep(1000);
                    }
                    browser.pixDiff.saveScreen(tagName);
                });
        });

        fit('should save a scrolled screen region', function () {
            var tagName = 'scrolledPageRegion';

            browser.executeScript('arguments[0].scrollIntoView();', alertSuccessSmall.getWebElement())
                .then(function () {
                    if(ADBScreenshot) {
                        browser.sleep(1000);
                    }
                    browser.pixDiff.saveRegion(alertSuccessSmall, tagName);
                });
        });
    });
});
