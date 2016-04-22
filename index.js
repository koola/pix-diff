var blinkDiff = require('blink-diff'),
    pngImage = require('png-image'),
    assert = require('assert'),
    path = require('path'),
    util = require('util'),
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
 * @param {string} options.formatImageName Custom format image name
 *
 * @property {string} _basePath
 * @property {int} _width
 * @property {int} _height
 * @property {object} _capabilities
 * @property {webdriver|promise} _flow
 */
function PixDiff(options) {
    this._basePath = options.basePath;
    assert.ok(options.basePath, "Image base path not given.");

    if (!fs.existsSync(options.basePath + '/diff') || !fs.statSync(options.basePath + '/diff').isDirectory()) {
        fs.mkdirSync(options.basePath + '/diff');
    }

    this._width = options.width || 1280;
    this._height = options.height || 1024;

    this._formatString = options.formatImageName || "{tag}-{browserName}-{width}x{height}";

    this._flow = browser.controlFlow();

    // init
    browser.driver.manage().window().setSize(this._width, this._height)
        .then(function () {
            return browser.getProcessedConfig()
        })
        .then(function (data) {
            this._capabilities = data.capabilities;
            assert.ok(this._capabilities.browserName, "Browser name is undefined.");
            // Require PixDiff matchers
            require(path.resolve('framework', data.framework));
        }.bind(this));
}

PixDiff.prototype = {

    /**
     * Merges non-default options from optionsB into optionsA
     *
     * @method _mergeDefaultOptions
     * @param {object} optionsA
     * @param {object} optionsB
     * @return {object}
     * @private
     */
    _mergeDefaultOptions: function(optionsA, optionsB) {
        optionsB = (typeof optionsB === 'object') ? optionsB : {};

        for (var option in optionsB) {
            if (!optionsA.hasOwnProperty(option)) {
                optionsA[option] = optionsB[option];
            }
        }
        return optionsA;
    },

    /**
     * Format string with description and capabilities
     *
     * @method _format
     * @param {string} formatString
     * @param {string} description
     * @return {string}
     * @private
     */
    _format: function(formatString, description) {
        var formatOptions = {
            'tag': camelCase(description),
            'browserName': this._capabilities.browserName,
            'width': this._width,
            'height': this._height
        };

        for (var option in formatOptions ) {
            formatString = formatString.replace('{' + option + '}', formatOptions[option]);
        }
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
    saveScreen: function(tag) {
        return this._flow.execute(function() {
            return browser.takeScreenshot()
                .then(function(image) {
                    return new pngImage({
                        imagePath: new Buffer(image, 'base64'),
                        imageOutputPath: path.join(this._basePath, this._format(this._formatString, tag))
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
    saveRegion: function(element, tag) {
        var size,
            rect;

        return this._flow.execute(function() {
            return element.getSize()
                .then(function(elementSize) {
                    size = elementSize;
                    return element.getLocation();
                })
                .then(function(point) {
                    rect = {height: size.height, width: size.width, x: Math.floor(point.x), y: Math.floor(point.y)};
                    return browser.takeScreenshot();
                })
                .then(function(image) {
                    return new pngImage({
                        imagePath: new Buffer(image, 'base64'),
                        imageOutputPath: path.join(this._basePath, this._format(this._formatString, tag)),
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
    checkScreen: function(tag, options) {
        var defaults;

        return this._flow.execute(function() {
            return browser.takeScreenshot()
                .then(function(image) {
                    tag = this._format(this._formatString, tag);
                    defaults = {
                        imageAPath: path.join(this._basePath, tag),
                        imageB: new Buffer(image, 'base64'),
                        imageOutputPath: path.join(this._basePath, 'diff', path.basename(tag)),
                        imageOutputLimit: blinkDiff.OUTPUT_DIFFERENT
                    };
                    return new blinkDiff(this._mergeDefaultOptions(defaults, options)).runWithPromise();
                }.bind(this))
                .then(function(result) {
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
    checkRegion: function(element, tag, options) {
        var size,
            rect,
            defaults;

        return this._flow.execute(function() {
            return element.getSize()
                .then(function(elementSize) {
                    size = elementSize;
                    return element.getLocation();
                })
                .then(function(point) {
                    rect = {height: size.height, width: size.width, x: Math.floor(point.x), y: Math.floor(point.y)};
                    return browser.takeScreenshot();
                })
                .then(function(image) {
                    tag = this._format(this._formatString, tag);
                    defaults = {
                        imageAPath: path.join(this._basePath, tag),
                        imageB: new Buffer(image, 'base64'),
                        imageOutputPath: path.join(this._basePath, 'diff', path.basename(tag)),
                        imageOutputLimit: blinkDiff.OUTPUT_DIFFERENT,
                        cropImageB: rect
                    };
                    return new blinkDiff(this._mergeDefaultOptions(defaults, options)).runWithPromise();
                }.bind(this))
                .then(function(result) {
                    return result;
                });
        }.bind(this));
    }
};

module.exports = PixDiff;