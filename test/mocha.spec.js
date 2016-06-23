'use strict';

var expect = require('chai').expect,
    blinkDiff = require('blink-diff'),
    fs = require('fs'),
    PixDiff = require('../');

describe('Pix-Diff', function() {

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

            browser.pixDiff.saveRegion(element(by.css('div h1')), tagName).then(function () {
                expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-chrome-800x600.png')).to.be.true;
            });
        });

        it('should match the page', function () {
            browser.pixDiff.checkScreen('example-page-mocha').then(function (result) {
                expect(result.code).to.equal(blinkDiff.RESULT_IDENTICAL);
            });
        });

        it('should match the page with custom matcher', function () {
            expect(browser.pixDiff.checkScreen('example-page-mocha')).to.matchScreen();
        });

        it('should not match the page', function () {
            browser.pixDiff.checkScreen('example-fail', {threshold: 1}).then(function (result) {
                expect(result.code).to.equal(blinkDiff.RESULT_DIFFERENT);
            });
        });

        it('should not match the page with custom matcher', function () {
            expect(browser.pixDiff.checkScreen('example-fail', {threshold: 1})).not.to.matchScreen();
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
                expect(fs.existsSync(__dirname + '/screenshots/TEST_' + tagName + '_chrome_800-600.png')).to.be.true;
            });
        });
    });
});