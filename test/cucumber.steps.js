'use strict';

var BlinkDiff = require('blink-diff'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    fs = require('fs'),
    PixDiff = require('../index');

chai.use(chaiAsPromised);
var expect = chai.expect;

function CucumberSteps() {

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

        return browser.pixDiff.saveRegion(element(by.css('div h1')), tagName)
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
        var errorThrown = false;

        return browser.pixDiff.checkScreen('imageNotExist', {threshold: 1})
            .then(function () {
                fail('must not do a comparison.');
            })
            .catch(function () {
                errorThrown = true;
            })
            .then(function () {
                return expect(errorThrown).to.equal(true);
            });
    });

    this.Then(/^Pix\-Diff should save screen with formatted basename$/, function () {
        var tagName = 'customName';

        return browser.pixDiff.saveScreen(tagName)
            .then(function () {
                return expect(fs.statSync(__dirname + '/screenshots/TEST_' + tagName + '_chrome_800-600.png').isFile()).to.equal(true);
            });
    });
}

module.exports = CucumberSteps;