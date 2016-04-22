'use strict';

var expect = require('chai').expect,
    blinkDiff = require('blink-diff'),
    fs = require('fs');

describe("Pix-Diff", function() {

    beforeEach(function () {
        browser.get(browser.baseUrl);
    });

    it("should save the screen", function () {
        var tagName = 'examplePageMocha';

        browser.pixDiff.saveScreen(tagName).then(function () {
            expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-chrome-800x600.png')).to.be.true;
        });
    });

    it("should match the page", function () {
        browser.pixDiff.checkScreen('example-page-mocha').then(function(result) {
            expect(result.code).to.equal(blinkDiff.RESULT_IDENTICAL);
        });
    });

    it("should match the page with custom matcher", function () {
        expect(browser.pixDiff.checkScreen('example-page-mocha')).to.matchScreen();
    });

    it("should not match the page", function () {
        browser.pixDiff.checkScreen('example-fail', {threshold:1}).then(function(result) {
            expect(result.code).to.equal(blinkDiff.RESULT_DIFFERENT);
        });
    });

    it("should not match the page with custom matcher", function () {
        expect(browser.pixDiff.checkScreen('example-fail', {threshold:1})).not.to.matchScreen();
    });
});