'use strict';

var BlinkDiff = require('blink-diff'),
    PngImage = require('png-image'),
    assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    camelCase = require('camel-case');

/**
 * Pix-diff protractor plugin class
 *
 * @constructor
 * @class PixDiff
 * @param {object} options
 * @param {string} options.basePath Path to screenshots folder
 * @param {string} options.width Width of browser
 * @param {string} options.height Height of browser
 * @param {string} options.formatImageOptions Custom variables for Image Name
 * @param {string} options.formatImageName Custom format image name
 *
 * @property {string} basePath
 * @property {int} width
 * @property {int} height
 * @property {string} formatOptions
 * @property {string} formatString
 * @property {object} capabilities
 * @property {webdriver|promise} flow
 * @property {int} devicePixelRatio
 */
function PixDiff(options) {
    this.basePath = options.basePath;
    assert.ok(options.basePath, 'Image base path not given.');

    if (!fs.existsSync(options.basePath + '/diff') || !fs.statSync(options.basePath + '/diff').isDirectory()) {
        fs.mkdirSync(options.basePath + '/diff');
    }

    this.width = options.width || 1280;
    this.height = options.height || 1024;

    this.formatOptions = options.formatImageOptions || {};
    this.formatString = options.formatImageName || '{tag}-{browserName}-{width}x{height}';

    this.flow = browser.controlFlow();

    this.devicePixelRatio = 1;

    // init
    browser.driver.manage().window().setSize(this.width, this.height)
        .then(function () {
            return browser.getProcessedConfig();
        })
        .then(function (data) {
            this.capabilities = data.capabilities;
            assert.ok(this.capabilities.browserName, 'Browser name is undefined.');
            // Require PixDiff matchers
            require(path.resolve(__dirname, 'framework', data.framework));
            return browser.driver.executeScript('return window.devicePixelRatio;');
        }.bind(this))
        .then(function (ratio) {
            this.devicePixelRatio = Math.floor(ratio);
        }.bind(this));
}

PixDiff.prototype = {

    /**
     * Merges non-default options from optionsB into optionsA
     *
     * @method mergeDefaultOptions
     * @param {object} optionsA
     * @param {object} optionsB
     * @return {object}
     * @private
     */
    mergeDefaultOptions: function (optionsA, optionsB) {
        optionsB = (typeof optionsB === 'object') ? optionsB : {};

        Object.keys(optionsB).forEach(function (option) {
            if (!optionsA.hasOwnProperty(option)) {
                optionsA[option] = optionsB[option];
            }
        });
        return optionsA;
    },

    /**
     * Format string with description and capabilities
     *
     * @method format
     * @param {string} formatString
     * @param {string} description
     * @return {string}
     * @private
     */
    format: function (formatString, description) {
        var defaults = {
            'tag': camelCase(description),
            'browserName': this.capabilities.browserName,
            'width': this.width,
            'height': this.height
        };

        defaults = this.mergeDefaultOptions(defaults, this.formatOptions);

        Object.keys(defaults).forEach(function (option) {
            formatString = formatString.replace('{' + option + '}', defaults[option]);
        });
        return formatString + '.png';
    },

    /**
     * Saves an image of the screen
     *
     * @method saveScreen
     * @example
     *     browser.pixdiff.saveScreen('imageA');
     *
     * @param {string} tag
     * @public
     */
    saveScreen: function (tag) {
        return this.flow.execute(function () {
            return browser.takeScreenshot()
                .then(function (image) {
                    return new PngImage({
                        imagePath: new Buffer(image, 'base64'),
                        imageOutputPath: path.join(this.basePath, this.format(this.formatString, tag))
                    }).runWithPromise();
                }.bind(this));
        }.bind(this));
    },

    /**
     * Saves an image of the screen region
     *
     * @method saveRegion
     * @example
     *     browser.pixdiff.saveRegion(element(By.id('elementId')), 'imageA');
     *
     * @param {promise} element
     * @param {string} tag
     * @public
     */
    saveRegion: function (element, tag) {
        var size,
            rect;

        return this.flow.execute(function () {
            return element.getSize()
                .then(function (elementSize) {
                    size = elementSize;
                    return element.getLocation();
                })
                .then(function (point) {
                    rect = {height: size.height, width: size.width, x: Math.floor(point.x), y: Math.floor(point.y)};
                    return browser.takeScreenshot();
                })
                .then(function (image) {
                    if (this.devicePixelRatio > 1) {
                        Object.keys(rect).forEach(function (item) {
                            rect[item] *= this.devicePixelRatio;
                        }.bind(this));
                    }
                    return new PngImage({
                        imagePath: new Buffer(image, 'base64'),
                        imageOutputPath: path.join(this.basePath, this.format(this.formatString, tag)),
                        cropImage: rect
                    }).runWithPromise();
                }.bind(this));
        }.bind(this));
    },

    /**
     * Runs the comparison against the screen
     *
     * @method checkScreen
     * @example
     *     browser.pixdiff.checkScreen('imageA', {debug: true});
     *
     * @param {string} tag
     * @param {object} options
     * @return {object} result
     * @public
     */
    checkScreen: function (tag, options) {
        var defaults;

        return this.flow.execute(function () {
            return browser.takeScreenshot()
                .then(function (image) {
                    tag = this.format(this.formatString, tag);
                    defaults = {
                        imageAPath: path.join(this.basePath, tag),
                        imageB: new Buffer(image, 'base64'),
                        imageOutputPath: path.join(this.basePath, 'diff', path.basename(tag)),
                        imageOutputLimit: BlinkDiff.OUTPUT_DIFFERENT
                    };
                    return new BlinkDiff(this.mergeDefaultOptions(defaults, options)).runWithPromise();
                }.bind(this))
                .then(function (result) {
                    return result;
                });
        }.bind(this));
    },

    /**
     * Runs the comparison against a region
     *
     * @method checkRegion
     * @example
     *     browser.pixdiff.checkRegion(element(By.id('elementId')), 'imageA', {debug: true});
     *
     * @param {promise} element
     * @param {string} tag
     * @param {object} options
     * @return {object}
     * @public
     */
    checkRegion: function (element, tag, options) {
        var size,
            rect,
            defaults;

        return this.flow.execute(function () {
            return element.getSize()
                .then(function (elementSize) {
                    size = elementSize;
                    return element.getLocation();
                })
                .then(function (point) {
                    rect = {height: size.height, width: size.width, x: Math.floor(point.x), y: Math.floor(point.y)};
                    return browser.takeScreenshot();
                })
                .then(function (image) {
                    tag = this.format(this.formatString, tag);
                    defaults = {
                        imageAPath: path.join(this.basePath, tag),
                        imageB: new Buffer(image, 'base64'),
                        imageOutputPath: path.join(this.basePath, 'diff', path.basename(tag)),
                        imageOutputLimit: BlinkDiff.OUTPUT_DIFFERENT,
                        cropImageB: rect
                    };
                    return new BlinkDiff(this.mergeDefaultOptions(defaults, options)).runWithPromise();
                }.bind(this))
                .then(function (result) {
                    return result;
                });
        }.bind(this));
    }
};

module.exports = PixDiff;