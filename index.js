'use strict';

const assert = require('assert'),
    BlinkDiff = require('blink-diff'),
    camelCase = require('camel-case'),
    fs = require('fs-extra'),
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
 * @param {boolean} options.baseline Save images not found in baseline
 * @param {int} options.width Width of browser
 * @param {int} options.height Height of browser
 * @param {string} options.formatImageOptions Custom variables for Image Name
 * @param {string} options.formatImageName Custom format image name
 * @param {object} options.offsets Mobile offsets required for obtaining element position
 *
 * @property {string} basePath
 * @property {string} diffPath
 * @property {boolean} baseline
 * @property {int} width
 * @property {int} height
 * @property {string} formatOptions
 * @property {string} formatString
 * @property {object} offsets
 * @property {int} devicePixelRatio
 * @property {string} browserName
 * @property {string} logName
 * @property {string} name
 * @property {string} platformName
 * @property {string} deviceName
 * @property {boolean} nativeWebScreenshot
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
        this.offsets = options.offsets || {ios: {}, android: {}};
        this.devicePixelRatio = 1;

        if (this.offsets) {
            assert.ok(this.offsets.ios, 'Offset key ios not found.');
            assert.ok(this.offsets.android, 'Offset key android not found.');

            this.offsets.ios = this._mergeDefaultOptions(this.offsets.ios, {statusBar: 20, addressBar: 44});
            this.offsets.android = this._mergeDefaultOptions(this.offsets.android, {statusBar: 24, addressBar: 56, toolBar: 48});
        }

        fs.ensureDirSync(this.basePath);
        fs.ensureDirSync(this.diffPath);

        if (this.width && this.height) {
            assert.ok(Number.isInteger(this.width), 'Option width not an Integer.');
            assert.ok(Number.isInteger(this.height), 'Option height not an Integer.');

            browser.driver.manage().window().setSize(this.width, this.height)
        }

        browser.getProcessedConfig().then(_ => {
            this.browserName = _.capabilities.browserName ? camelCase(_.capabilities.browserName) : '';
            this.name = _.capabilities.name ? camelCase(_.capabilities.name) : '';
            this.logName = _.capabilities.logName ? camelCase(_.capabilities.logName) : '';
            // Mobile
            this.platformName = _.capabilities.platformName ? _.capabilities.platformName.toLowerCase() : '';
            this.deviceName = _.capabilities.deviceName ? camelCase(_.capabilities.deviceName) : '';
            this.nativeWebScreenshot = _.capabilities.nativeWebScreenshot || false;

            if (_.framework !== 'custom') {
                require(path.resolve(__dirname, 'framework', _.framework));
            }
        });
    }

    /**
     * Merges non-default options from optionsB into optionsA
     *
     * @method _mergeDefaultOptions
     * @param {object} optionsA
     * @param {object} optionsB
     * @return {object}
     * @private
     */
    _mergeDefaultOptions(optionsA, optionsB) {
        optionsB = (typeof optionsB === 'object') ? optionsB : {};

        Object.keys(optionsB).forEach(value => {
            if (!optionsA.hasOwnProperty(value)) {
                optionsA[value] = optionsB[value];
            }
        });

        return optionsA;
    }

    /**
     * Formatted image name with description and capabilities
     *
     * @method _formatFileName
     * @param {string} tag
     * @return {string}
     * @private
     */
    _formatFileName(tag) {
        let defaults = {
                'tag': camelCase(tag),
                'browserName': this.browserName,
                'deviceName': this.deviceName,
                'logName': this.logName,
                'name': this.name,
                'dpr': this.devicePixelRatio,
                'width': this.width,
                'height': this.height
            },
            formatString = this.formatString;

        defaults = this._mergeDefaultOptions(defaults, this.formatOptions);

        Object.keys(defaults).forEach(value => {
            formatString = formatString.replace('{' + value + '}', defaults[value]);
        });

        return formatString + '.png';
    }

    /**
     * Check if browser is firefox
     *
     * @method _isFirefox
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
     * @method _isAndroid
     * @return {boolean}
     * @private
     */
    _isAndroid() {
        return this.platformName === 'android';
    }

    /**
     * Check if platformName is iOS
     *
     * @method _isIOS
     * @return {boolean}
     * @private
     */
    _isIOS() {
        return this.platformName === 'ios';
    }

    /**
     * Check if Mobile
     *
     * @method _isMobile
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
     * @method _getElementPosition
     * @param {promise} element
     * @return {promise}
     * @private
     */
    _getElementPosition(element) {
        if (this._isIOS()) {
            return this._getElementPositionIOS(element);
        } else if (this._isAndroid() && this.nativeWebScreenshot) {
            this._getElementPositionAndroid(element);
        } else if (this._isFirefox() || this._isInternetExplorer()) {
            return this._getElementPositionTopPage(element);
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
        return element.getLocation()
            .then(point => {
                return {x: point.x, y: point.y};
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
        return browser.driver.executeScript('return arguments[0].getBoundingClientRect();', element.getWebElement())
            .then(position => {
                return {x: position.left, y: position.top};
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
        function getDataObject(element, addressBar, statusBar) {
            var
                screenHeight = window.screen.height,
                screenWidth = window.screen.width,
                windowInnerHeight = window.innerHeight,
                rotatedScreenHeight = screenHeight > screenWidth ? screenWidth : screenHeight,
                elementPosition = element.getBoundingClientRect(),
                y = statusBar + addressBar + elementPosition.top;

            if (screenHeight === windowInnerHeight || rotatedScreenHeight === windowInnerHeight) {
                y = elementPosition.top;
            }

            return {
                x: elementPosition.left,
                y: y
            };
        }

        return browser.driver.executeScript(getDataObject, element.getWebElement(),
            this.offsets.ios.addressBar, this.offsets.ios.statusBar);
    }

    /**
      * Get the position of a given element for the Android devices browser
      *
      * @method _getElementPositionAndroid
      * @param {promise} element
      * @returns {promise}
      * @private
      */
    _getElementPositionAndroid(element) {
        function getDataObject(element, statusBarHeight, addressBarHeight, toolBarHeight) {
            var elementPosition = element.getBoundingClientRect(),
                screenHeight = window.screen.height,
                windowInnerHeight = window.innerHeight,
                addressBarCurrentHeight = 0;

            if (screenHeight === (statusBarHeight + addressBarHeight + windowInnerHeight + toolBarHeight)) {
                addressBarCurrentHeight = addressBarHeight;
            } else if (screenHeight === (statusBarHeight + addressBarHeight + windowInnerHeight)) {
                addressBarCurrentHeight = addressBarHeight;
            }

            return {
                x: elementPosition.left,
                y: statusBarHeight + addressBarCurrentHeight + elementPosition.top
            };
        }

        return browser.driver.executeScript(getDataObject, element.getWebElement(),
            this.offsets.android.statusBar, this.offsets.android.addressBar, this.offsets.android.toolBar);
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

        fs.access(path.join(this.basePath, this._formatFileName(tag)), fs.F_OK, error => {
            if (error) {
                if (!this.baseline) {
                    deferred.reject(error);
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
                    devicePixelRatio: window.devicePixelRatio,
                    height: (isMobile) ? window.screen.height : window.outerHeight,
                    width: (isMobile) ? window.screen.width : window.outerWidth
                };
            }
            return browser.executeScript(getDataObject, this._isMobile())
                .then((screen) => {
                    this.devicePixelRatio = this._isFirefox() ? this.devicePixelRatio : screen.devicePixelRatio;
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
                    imageOutputPath: path.join(this.basePath, this._formatFileName(tag))
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
                    imageOutputPath: path.join(this.basePath, this._formatFileName(tag)),
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
            .then(() => this._checkImageExists(tag))
            .then(() => browser.takeScreenshot(), (error) => {
                if (this.baseline) {
                    return this.saveScreen(tag).then(() => { throw error; });
                }
                throw error;
            })
            .then((image) => {
                tag = this._formatFileName(tag);
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
            .then(() => this._checkImageExists(tag))
            .then(() => this._getElementRectangle(element), (error) => {
                if (this.baseline) {
                    return this.saveScreen(tag).then(() => { throw error; });
                }
                throw error;
            })
            .then((elementRect) => {
                rect = elementRect;
                return browser.takeScreenshot();
            })
            .then((image) => {
                tag = this._formatFileName(tag);
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