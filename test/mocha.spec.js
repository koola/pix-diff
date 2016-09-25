'use strict';

var expect = require('chai').expect,
    blinkDiff = require('blink-diff'),
    fs = require('fs'),
    PixDiff = require('../');

describe('Pix-Diff', function() {

    var headerElement = element(by.css('h1.page-header')),
        alertSuccessSmall = element(by.css('.uk-alert-success'));

    beforeEach(function () {
        browser.get(browser.baseUrl);
    });

    describe('method matchers', function() {

        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: 'test/screenshots',
                width: 800,
                height: 600
            });
        });

        it('should save the screen', function () {
            var tagName = 'examplePageMocha';

            browser.pixDiff.saveScreen(tagName).then(function () {
                expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-chrome-800x600.png')).to.be.true;
            });
        });

        it('should save the screen region', function () {
            var tagName = 'examplePageRegionMocha';

            browser.pixDiff.saveRegion(headerElement, tagName).then(function () {
                expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-chrome-800x600.png')).to.be.true;
            });
        });

        it('should match the page', function () {
            browser.pixDiff.checkScreen('examplePageMocha').then(function (result) {
                expect(result.code).to.equal(blinkDiff.RESULT_IDENTICAL);
            });
        });

        it('should match the page with custom matcher', function () {
            expect(browser.pixDiff.checkScreen('examplePageMocha')).to.matchScreen();
        });

        it('should not match the page', function () {
            browser.pixDiff.checkScreen('example-fail', {threshold: 1}).then(function (result) {
                expect(result.code).to.equal(blinkDiff.RESULT_DIFFERENT);
            });
        });

        it('should not match the page with custom matcher', function () {
            expect(browser.pixDiff.checkScreen('exampleFail', {threshold: 1})).not.to.matchScreen();
        });

        it('should not crash with image not found', function () {
            browser.pixDiff.checkScreen('imageNotExist', {threshold: 1}).then(function () {
                fail('should not be called');
            }, function (error) {
                expect(error.message).to.contain('no such file or directory');
            });
        });
    });
});
