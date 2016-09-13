'use strict';

var expect = require('chai').expect,
    BlinkDiff = require('blink-diff'),
    fs = require('fs'),
    PixDiff = require('../');

function CucumberSteps() {

    var headerElement = element(by.css('div h1'));

    this.Given(/^I set up the matchers environment$/, function () {
        browser.get(browser.baseUrl);

        browser.pixDiff = new PixDiff({
            basePath: 'test/screenshots',
            width: 800,
            height: 600
        });
    });

    this.Given(/^I set up the format image name environment$/, function () {
        browser.get(browser.baseUrl);

        browser.pixDiff = new PixDiff({
            basePath: 'test/screenshots',
            width: 800,
            height: 600,
            formatImageOptions: {'env': 'TEST'},
            formatImageName: '{env}_{tag}_{browserName}_{width}-{height}'
        });
    });

    this.Then(/^Pix\-Diff should save the screen$/, function () {
        var tagName = 'examplePage';

        return browser.pixDiff.saveScreen(tagName)
            .then(function () {
                return expect(fs.statSync(__dirname + '/screenshots/' + tagName + '-chrome-800x600.png').isFile()).to.equal(true);
            });
    });

    this.Then(/^Pix\-Diff should save the screen region$/, function () {
        var tagName = 'examplePageRegion';

        return browser.pixDiff.saveRegion(headerElement, tagName)
            .then(function () {
                return expect(fs.statSync(__dirname + '/screenshots/' + tagName + '-chrome-800x600.png').isFile()).to.equal(true);
            });
    });

    this.Then(/^Pix\-Diff should match the page$/, function () {
        return browser.pixDiff.checkScreen('examplePage')
            .then(function (result) {
                return expect(result.code).to.equal(BlinkDiff.RESULT_IDENTICAL);
            });
    });

    this.Then(/^Pix\-Diff should not match the page$/, function () {
        return browser.pixDiff.checkScreen('example-fail', {threshold: 1})
            .then(function (result) {
                return expect(result.code).to.equal(BlinkDiff.RESULT_DIFFERENT);
            });
    });

    this.Then(/^Pix\-Diff should not crash with image not found$/, function () {
        return browser.pixDiff.checkScreen('imageNotExist', {threshold: 1}).then(function () {
            fail('should not be called');
        }, function (error) {
            expect(error.message).to.contain('no such file or directory');
        });
    });
}

module.exports = CucumberSteps;