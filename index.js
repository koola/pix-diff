'use strict';

const assert = require('assert'),
    BlinkDiff = require('blink-diff'),
    camelCase = require('camel-case'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    PNGImage = require('png-image');

/**
 * Pix-diff protractor plugin class
 *
 * @constructor
 * @class PixDiff
 * @param {object} options
 * @param {string} options.basePath Path to baseline images folder
 * @param {string} options.diffPath Path to difference folder
 * @param {string} options.baseline Save images not found in baseline
 * @param {string} options.width Width of browser
 * @param {string} options.height Height of browser
 * @param {string} options.formatImageOptions Custom variables for Image Name
 * @param {string} options.formatImageName Custom format image name
 *
 * @property {string} basePath
 * @property {string} diffPath
 * @property {boolean} baseline
 * @property {int} width
 * @property {int} height
 * @property {string} formatOptions
 * @property {string} formatString
 * @property {object} mobileOffsets
 * @property {int} devicePixelRatio
 * @property {string} browserName
 * @property {string} name
 * @property {string} platformName
 * @property {string} deviceName
 * @property {string} nativeWebScreenshot
 */
class PixDiff {
    constructor(options) {
        assert.ok(options.basePath, 'Image baseline path not given.');
        assert.ok(options.diffPath, 'Image difference path not given.');

        this.basePath = path.normalize(options.basePath);
        this.diffPath = path.join(path.normalize(options.diffPath), 'diff');
        this.baseline = options.baseline || false;
        this.width = options.width;
        this.height = options.height;
        this.formatOptions = options.formatImageOptions || {};
        this.formatString = options.formatImageName || '{tag}-{browserName}-{width}x{height}-dpr-{dpr}';
        this.mobileOffsets = {};
        this.devicePixelRatio = 1;

        if (!fs.existsSync(this.basePath) || !fs.statSync(this.basePath).isDirectory()) {
            mkdirp.sync(this.basePath);
        }
        if (!fs.existsSync(this.diffPath) || !fs.statSync(this.diffPath).isDirectory()) {
            mkdirp.sync(this.diffPath);
        }

        // Initialize
        browser.getProcessedConfig()
            .then(_ => {
            // Desktop
            this.browserName = _.capabilities.browserName ? camelCase(_.capabilities.browserName) : '';
            this.name = _.capabilities.name ? camelCase(_.capabilities.name) : '';
            // Mobile
            this.platformName = _.capabilities.platformName ? _.capabilities.platformName.toLowerCase() : '';
            this.deviceName = _.capabilities.deviceName ? camelCase(_.capabilities.deviceName) : '';
            this.nativeWebScreenshot = _.capabilities.nativeWebScreenshot ? _.capabilities.nativeWebScreenshot : false;
            // Matchers for jasmine(2)/mocha
            if (_.framework !== 'custom') {
                require(path.resolve(__dirname, 'framework', _.framework));
            }

            if (this.width && this.height) {
                browser.driver.manage().window().setSize(this.width, this.height);
            }
        });
    }

    /**
     * Merges non-default options from optionsB into optionsA
     *
     * @method mergeDefaultOptions
     * @param {object} optionsA
     * @param {object} optionsB
     * @return {object}
     * @private
     */
    _mergeDefaultOptions(optionsA, optionsB) {
        optionsB = (typeof optionsB === 'object') ? optionsB : {};

        Object.keys(optionsB).forEach((value) => {
            if (!optionsA.hasOwnProperty(value)) {
                optionsA[value] = optionsB[value];
            }
        });

        return optionsA;
    }

    /**
     * Formatted image name with description and capabilities
     *
     * @method _getImageName
     * @param {string} tag
     * @return {string}
     * @private
     */
    _getImageName(tag) {
        let defaults = {
                'tag': camelCase(tag),
                'browserName': this.browserName,
                'deviceName': this.deviceName,
                'name': this.name,
                'dpr': this.devicePixelRatio,
                'width': this.width,
                'height': this.height
            },
            formatString = this.formatString;

        defaults = this._mergeDefaultOptions(defaults, this.formatOptions);

        Object.keys(defaults).forEach(value => {
            formatString = formatString.replace(`{${value}}`, defaults[value]);
        });

        return `${formatString}.png`;
    }

    /**
     * Check if browser is firefox
     *
     * @method isFirefox
     * @return {boolean}
     * @private
     */
    _isFirefox() {
        return this.browserName === 'firefox';
    }

    /**
     * Check if browser is internet explorer
     *
     * @method _isInternetExplorer
     * @return {boolean}
     * @private
     */
    _isInternetExplorer() {
        return this.browserName === 'internetExplorer';
    }

    /**
     * Check if platformName is Android
     *
     * @method isAndroid
     * @return {boolean}
     * @private
     */
    _isAndroid() {
        return this.platformName === 'android';
    }

    /**
     * Check if platformName is iOS
     *
     * @method isIOS
     * @return {boolean}
     * @private
     */
    _isIOS() {
        return this.platformName === 'ios';
    }

    /**
     * Check if Mobile
     *
     * @method isAppium
     * @return {boolean}
     * @private
     */
    _isMobile() {
        return this.deviceName !== '';
    }

    /**
     * Get the position of the element
     * Firefox and IE take a screenshot of the complete page. Chrome takes a screenshot of the viewport.
     *
     * @todo Refactor implementation for broader support
     *
     * @method _getElementPosition
     * @param {promise} element
     * @return {promise}
     * @private
     */
    _getElementPosition(element) {
        if (this._isFirefox() || this._isInternetExplorer()) {
            return this._getElementPositionTopPage(element);
        } else if (this._isIOS()) {
            return this._getElementPositionIOS(element);
        } else if (this._isAndroid() || this.nativeWebScreenshot) {
            return this._getElementPositionAndroid(element);
        }

        return this._getElementPositionTopWindow(element);
    }

    /**
     * Get the position of a given element according to the TOP of the PAGE
     *
     * @method _getElementPositionTopPage
     * @param {promise} element
     * @returns {promise}
     * @private
     */
    _getElementPositionTopPage(element) {
        return element.getLocation().then(function (point) {
            return {
                x: Math.floor(point.x),
                y: Math.floor(point.y)
            };
        });
    }

    /**
     * Get the position of a given element according to the TOP of the WINDOW
     *
     * @method _getElementPositionTopWindow
     * @param {promise} element
     * @returns {promise}
     * @private
     */
    _getElementPositionTopWindow(element) {
        return browser.executeScript('return arguments[0].getBoundingClientRect();', element.getWebElement())
            .then(function (position) {
                return {
                    x: Math.floor(position.left),
                    y: Math.floor(position.top)
                };
            });
    }

    /**
     * Get the position of a given element for the IOS Safari browser
     *
     * @method _getElementPositionIOS
     * @param {promise} element
     * @returns {promise}
     * @private
     */
    _getElementPositionIOS(element) {
        function getDataObject (element, addressBarHeight, statusBarHeight, toolbarHeight) {
            var elementPosition = element.getBoundingClientRect(),
                screenHeight = window.screen.height,
                windowInnerHeight = window.innerHeight,
                y;

            if (screenHeight === addressBarHeight + statusBarHeight + toolbarHeight + windowInnerHeight) {
                // Address bar and Toolbar still visible
                y = statusBarHeight + addressBarHeight;
            } else {
                // Address bar collapsed and Toolbar disappeared due to manual scrolling
                y = screenHeight - windowInnerHeight;
            }

            return {
                x: elementPosition.left,
                y: y + elementPosition.top
            };
        }

        var _ = this._mergeDefaultOptions(this.mobileOffsets, { addressBar: 44, statusBar: 20, toolbar: 44 });

        return browser.executeScript(getDataObject, element.getWebElement(), _.addressBar, _.statusBar, _.toolbar);
    }

    /**
     * Get the position of a given element for the Android browser
     *
     * @method _getElementPositionAndroid
     * @param {promise} element
     * @returns {promise}
     * @private
     */
    _getElementPositionAndroid(element) {
        function getDataObject (element, addressBarHeight, statusBarHeight, toolbarHeight) {
                var elementPosition = element.getBoundingClientRect(),
                        screenHeight = window.screen.height,
                        windowInnerHeight = window.innerHeight,
                        addressBarCurrentHeight = 0;

                    if (screenHeight === (addressBarHeight + statusBarHeight + toolbarHeight + windowInnerHeight )) {
                        addressBarCurrentHeight = addressBarHeight;
                    }

                    return {
                        x: elementPosition.left,
                        y: statusBarHeight + addressBarCurrentHeight + elementPosition.top
                };
        }

        var _ = this._mergeDefaultOptions(this.mobileOffsets, { addressBar: 53, statusBar: 24, toolbar: 0 });

        return browser.executeScript(getDataObject, element.getWebElement(), _.addressBar, _.statusBar, _.toolbar);
    }

    /**
     * Checks if image exists as a baseline image
     *
     * @method _checkImageExists
     * @param {string} tag
     * @return {promise}
     * @private
     */
    _checkImageExists(tag) {
        var deferred = protractor.promise.defer();

        fs.access(path.join(this.basePath, this._getImageName(tag)), fs.F_OK, error => {
            if (error) {
                if (!this.baseline) {
                    deferred.reject(error.message);
                } else {
                    deferred.reject(new Error('Image not found, saving current image as new baseline.'));
                }
            } else {
                deferred.fulfill();
            }
        });

        return deferred.promise;
    }

    /**
     * Get browser instance data
     *
     * @method _getBrowserData
     * @return {promise}
     * @private
     */
    _getBrowserData() {
        return browser.controlFlow().execute(() => {
            function getDataObject (isMobile) {
                return {
                    pixelRatio: window.devicePixelRatio,
                    height: (isMobile) ? window.screen.height : window.outerHeight,
                    width: (isMobile) ? window.screen.width : window.outerWidth
                };
            }
            return browser.executeScript(getDataObject, this._isMobile())
                .then((screen) => {
                    this.devicePixelRatio = this._isFirefox() ? this.devicePixelRatio : screen.pixelRatio;
                    this.width = screen.width * this.devicePixelRatio;
                    this.height = screen.height * this.devicePixelRatio;
                });
        });
    }

    /**
     * Determine the rectangles conform the correct browser / devicePixelRatio
     *
     * @method _getElementRectangle
     * @param {Promise} element The ElementFinder to get the rectangles of
     * @return {object} returns the correct rectangles rectangles
     * @private
     */
    _getElementRectangle(element) {
        let rect,
            size;

        return element.getSize()
            .then(elementSize => {
                size = elementSize;
                return this._getElementPosition(element);
            })
            .then(point => {
                rect = {
                    height: size.height,
                    width: size.width,
                    x: Math.floor(point.x),
                    y: Math.floor(point.y)
                };

                Object.keys(rect).map(value => {
                    rect[value] *= this.devicePixelRatio;
                });

                return rect;
            });
    }

    /**
     * Saves an image of the screen
     *
     * @method saveScreen
     * @example
     *     browser.pixdiff.saveScreen('imageA');
     *
     * @param {string} tag Arbitrary name
     * @return {Promise} Image saved when the promise is resolved
     * @public
     */
    saveScreen(tag) {
        return this._getBrowserData()
            .then(() => browser.takeScreenshot())
            .then(image => {
                return new PNGImage({
                    imagePath: new Buffer(image, 'base64'),
                    imageOutputPath: path.join(this.basePath, this._getImageName(tag))
                }).runWithPromise();
            });
    }

    /**
     * Saves an image of the screen region
     *
     * @method saveRegion
     * @example
     *     browser.pixdiff.saveRegion(element(By.id('elementId')), 'imageA');
     *
     * @param {promise} element The ElementFinder for element lookup
     * @param {string} tag Arbitrary name
     * @return {promise} Image region saved when the promise is resolved
     * @public
     */
    saveRegion(element, tag) {
        let rect;

        return this._getBrowserData()
            .then(() => this._getElementRectangle(element))
            .then((elementRect) => {
                rect = elementRect;
                return browser.takeScreenshot();
            })
            .then((image) => {
                return new PNGImage({
                    imagePath: new Buffer(image, 'base64'),
                    imageOutputPath: path.join(this.basePath, this._getImageName(tag)),
                    cropImage: rect
                }).runWithPromise();
            });
    }

    /**
     * Runs the comparison against the screen
     *
     * @method checkScreen
     * @example
     *     browser.pixdiff.checkScreen('imageA', {debug: true});
     *
     * @param {string} tag Arbitrary name
     * @param {object} options Non-default Blink-Diff options
     * @return {object} result The BlinkDiff result
     * @public
     */
    checkScreen(tag, options) {
        let defaults;

        return this._getBrowserData()
            .then(() => this._checkImageExists(tag), (error) => { throw error.message; })
            .then(() => browser.takeScreenshot())
            .then((image) => {
                tag = this._getImageName(tag);
                defaults = {
                    imageAPath: path.join(this.basePath, tag),
                    imageB: new Buffer(image, 'base64'),
                    imageOutputPath: path.join(this.diffPath, path.basename(tag)),
                    imageOutputLimit: BlinkDiff.OUTPUT_DIFFERENT
                };
                return new BlinkDiff(this._mergeDefaultOptions(defaults, options)).runWithPromise();
            })
            .then((result) => {
                return result;
            });
    }

    /**
     * Runs the comparison against a region
     *
     * @method checkRegion
     * @example
     *     browser.pixdiff.checkRegion(element(By.id('elementId')), 'imageA', {debug: true});
     *
     * @param {promise} element The ElementFinder for element lookup
     * @param {string} tag Arbitrary name
     * @param {object} options Non-default Blink-Diff options
     * @return {object} result The BlinkDiff result
     * @public
     */
    checkRegion(element, tag, options) {
        let rect,
            defaults;

        return this._getBrowserData()
            .then(() => this._checkImageExists(tag), (error) => { throw error.message; })
            .then(() => this._getElementRectangle(element))
            .then((elementRect) => {
                rect = elementRect;
                return browser.takeScreenshot();
            })
            .then((image) => {
                tag = this._getImageName(tag);
                defaults = {
                    imageAPath: path.join(this.basePath, tag),
                    imageB: new Buffer(image, 'base64'),
                    imageOutputPath: path.join(this.diffPath, path.basename(tag)),
                    imageOutputLimit: BlinkDiff.OUTPUT_DIFFERENT,
                    cropImageB: rect
                };
                return new BlinkDiff(this._mergeDefaultOptions(defaults, options)).runWithPromise();
            })
            .then((result) => {
                return result;
            });
    }
}

module.exports = PixDiff;