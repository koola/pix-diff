'use strict';

var BlinkDiff = require('blink-diff'),
    fs = require('fs');

describe('Pix-Diff', function() {

    beforeEach(function() {
        browser.get(browser.baseUrl);
    });

    it('should save the screen', function () {
        var tagName = 'examplePage';

        browser.pixDiff.saveScreen(tagName).then(function() {
            expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-chrome-800x600.png')).toBe(true);
        });
    });

    it('should save the screen region', function () {
        var tagName = 'examplePageRegion';

        browser.pixDiff.saveRegion(element(by.css('div h1')), tagName).then(function() {
            expect(fs.existsSync(__dirname + '/screenshots/' + tagName + '-chrome-800x600.png')).toBe(true);
        });
    });

    it('should match the page', function () {
        browser.pixDiff.checkScreen('example-page').then(function(result) {
            expect(result.code).toEqual(BlinkDiff.RESULT_IDENTICAL);
        });
    });

    it('should match the page with custom matcher', function () {
        expect(browser.pixDiff.checkScreen('example-page')).toMatchScreen();
    });

    it('should not match the page', function () {
        browser.pixDiff.checkScreen('example-fail', {threshold:1}).then(function(result) {
            expect(result.code).toEqual(BlinkDiff.RESULT_DIFFERENT);
        });
    });

    it('should not match the page with custom matcher', function () {
        expect(browser.pixDiff.checkScreen('example-fail', {threshold:1})).not.toMatchScreen();
    });
});