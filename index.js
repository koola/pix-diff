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
 * @param {int} options.width Width of browser
 * @param {int} options.height Height of browser
 * @param {boolean} options.autoResize Automatically resize the browser
 * @param {string} options.formatImageOptions Custom variables for Image Name
 * @param {string} options.formatImageName Custom format image name
 *
 * @property {string} basePath
 * @property {boolean} baseline
 * @property {int} width
 * @property {int} height
 * @property {boolean} autoResize
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

    this.baseline = options.baseline === true || false;

    this.width = options.width || 1280;
    this.height = options.height || 1024;

    this.autoResize = options.autoResize === false || true;

    this.formatOptions = options.formatImageOptions || {};
    this.formatString = options.formatImageName || '{tag}-{browserName}-{width}x{height}';

    this.flow = browser.controlFlow();

    this.devicePixelRatio = 1;

    // initialize
    browser.getProcessedConfig().then(function (_) {
        assert.ok(_.capabilities.browserName, 'Browser name is undefined.');

        this.browserName = camelCase(_.capabilities.browserName);
        this.platformName = _.capabilities.platformName ? camelCase(_.capabilities.platformName) : '';
        this.deviceName = _.capabilities.deviceName ? camelCase(_.capabilities.deviceName) : '';

        if (_.framework !== 'custom') {
            // Require PixDiff matchers for jasmine(2)/mocha
            require(path.resolve(__dirname, 'framework', _.framework));
        }

        return this.getPixelDeviceRatio();

    }.bind(this)).then(function (ratio) {
        this.devicePixelRatio = ratio;

        return this.getBrowserDimensions();

    }.bind(this)).then(function (dimensions) {
        if (this.platformName) {
            this.height = dimensions.height;
            this.width = dimensions.width;
        }
        else if (this.autoResize) {
            browser.driver.manage().window().setSize(this.width, this.height);
        }
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

        Object.keys(optionsB).forEach(function (value) {
            if (!optionsA.hasOwnProperty(value)) {
                optionsA[value] = optionsB[value];
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
            'browserName': this.browserName,
            'deviceName': this.deviceName,
            'dpr': this.devicePixelRatio,
            'width': this.width,
            'height': this.height
        };

        defaults = this.mergeDefaultOptions(defaults, this.formatOptions);

        Object.keys(defaults).forEach(function (value) {
            formatString = formatString.replace('{' + value + '}', defaults[value]);
        });
        return formatString + '.png';
    },

    /**
     * Check if browser is firefox
     *
     * @method isFirefox
     * @return {boolean}
     * @private
     */
    isFirefox: function () {
        return this.browserName === 'firefox';
    },

    /**
     * Check if browser is internet explorer
     *
     * @method isFirefox
     * @return {boolean}
     * @private
     */
    isInternetExplorer: function () {
        return this.browserName === 'internet explorer';
    },

    /**
     * Return the device pixel ratio (firefox always equals 1)
     *
     * @method getPixelDeviceRatio
     * @return {integer}
     * @private
     */
    getPixelDeviceRatio: function () {
        var ratio;

        return this.flow.execute(function () {
            return browser.executeScript('return window.devicePixelRatio;')
                .then(function (devicePixelRatio) {
                    ratio = Math.floor(devicePixelRatio);
                    return (ratio > 1 && !this.isFirefox()) ? ratio : this.devicePixelRatio;
                }.bind(this));
        }.bind(this));
    },

    /**
     * Get the position of the element
     * Firefox and IE make a screenshot of the complete page, not of the visbile part. The rest of the browsers make a
     * screenshot of the visible part
     *
     * @method getElementPosition
     * @param {promise} element
     * @return {promise}
     * @private
     */
    getElementPosition: function (element) {
        if (this.isFirefox() || this.isInternetExplorer()) {
            return this.getElementPositionTopPage(element);
        }
        return this.getElementPositionTopWindow(element);
    },

    /**
     * Get the position of a given element according to the TOP of the PAGE
     *
     * @method getElementPositionTopPage
     * @param {promise} element
     * @returns {promise}
     * @private
     */
    getElementPositionTopPage: function (element) {
        return element.getLocation().then(function (point) {
            return {
                x: point.x,
                y: point.y
            };
        });
    },

    /**
     * Get the position of a given element according to the TOP of the WINDOW
     *
     * @method getElementPositionTopWindow
     * @param {promise} element
     * @returns {promise}
     * @private
     */
    getElementPositionTopWindow: function (element) {
        return browser.executeScript('return arguments[0].getBoundingClientRect();', element.getWebElement())
            .then(function (position) {
                return {
                    x: position.left,
                    y: position.top
                };
            });
    },

    /**
     * Get the height and width of the browser
     *
     * @method getDeviceDimensions
     * @returns {promise}
     * @private
     */
    getBrowserDimensions: function () {
        return browser.executeScript('return { height: window.screen.height, width: window.screen.width};');
    },

    /**
     * Checks if image exists as baseline
     *
     * @method checkImageExists
     * @param {string} tag
     * @return {promise}
     * @private
     */
    checkImageExists: function (tag) {
        var deferred = protractor.promise.defer();

        fs.access(path.join(this.basePath, this.format(this.formatString, tag)), fs.F_OK, function (e) {
            if (e) {
                if (!this.baseline) {
                    deferred.reject(new Error(e.message));
                }
                else {
                    deferred.reject(new Error('Image not found, saving current image as new baseline.'));
                }
            } else {
                deferred.fulfill();
            }
        }.bind(this));

        return deferred.promise;
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
                    return this.getElementPosition(element);
                }.bind(this))
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
            return this.checkImageExists(tag)
                .then(function () {
                    return browser.takeScreenshot();
                }, function (e) {
                        if (this.baseline) {
                            return this.saveScreen(tag).then(function () {
                                throw e;
                            });
                        }
                        throw e;
                    }.bind(this))
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
            return this.checkImageExists(tag)
                .then(function () {
                    return element.getSize();
                }, function (e) {
                    if (this.baseline) {
                        return this.saveRegion(element, tag).then(function () {
                            throw e;
                        });
                    }
                    throw e;
                }.bind(this))
                .then(function (elementSize) {
                    size = elementSize;
                    return this.getElementPosition(element);
                }.bind(this))
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
