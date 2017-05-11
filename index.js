'use strict';

const assert = require('assert'),
    PixelDiff = require('pixel-diff'),
    camelCase = require('./lib/camelCase'),
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
 * @param {object} options.formatImageOptions Custom variables for Image Name
 * @param {string} options.formatImageName Custom format image name
 * @param {object} options.offsets Mobile iOS/Android offsets required for obtaining element position
 *
 * @property {string} basePath Directory where baseline images are read/saved
 * @property {string} diffPath Directory where difference images are saved
 * @property {boolean} baseline Toggle saving baseline imags if not found
 * @property {int} width Width of browser
 * @property {int} height Height of browser
 * @property {object} formatOptions Flat object that holds custom options for formatString
 * @property {string} formatString Customizable image filename naming convention
 * @property {object} offsets Object with statusBar, addressBar and toolBar key/values
 * @property {int} devicePixelRatio Ratio of the (vertical) size of one physical pixel on the current display device to the size of one device independent pixels(dips)
 * @property {int} innerHeight Viewport height
 * @property {int} pageWidth Full page width
 * @property {int} pageHeight Full page height
 * @property {string} browserName Browser name from the WebDriver capabilities
 * @property {string} logName Log name from WebDriver capabilities
 * @property {string} name Name from WebDriver capabilities
 * @property {string} platformName Platform name from WebDriver capabilities
 * @property {string} deviceName Device name from WebDriver capabilities
 * @property {boolean} nativeWebScreenshot Android native screenshot from WebDriver capabilities
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
        this.offsets = options.offsets || {};
        this.devicePixelRatio = 1;
        this.innerHeight = 0;
        this.pageWidth = 0;
        this.pageHeight = 0;

        this.offsets.ios = Object.assign({statusBar: 20, addressBar: 44}, this.offsets.ios);
        this.offsets.android = Object.assign({statusBar: 24, addressBar: 56, toolBar: 48}, this.offsets.android);

        fs.ensureDirSync(this.basePath);
        fs.ensureDirSync(this.diffPath);

        if (this.width && this.height) {
            assert.ok(Number.isInteger(this.width), 'Option width not an Integer.');
            assert.ok(Number.isInteger(this.height), 'Option height not an Integer.');

            browser.driver.manage().window().setSize(this.width, this.height);
        }

        this._formatCapabilities();
    }

    /**
     * Load matchers for pix-diff
     *
     * @static
     * @method loadMatchers
     * @example
     *      const pixDiff = require('pix-diff');
     *      pixDiff.loadMatchers();
     * @public
     */
    static loadMatchers() {
        return browser.getProcessedConfig().then(_ => {
            let framework = _.framework ? _.framework.toLowerCase() : 'jasmine2';
            if (['jasmine', 'jasmine2', 'mocha'].indexOf(framework) >= 0) {
                require(path.resolve(__dirname, 'framework', framework));
            }
        });
    }

    /**
     * Unknown result of the comparison
     *
     * @static
     * @property RESULT_UNKNOWN
     * @type {int}
     * @public
     */
    static get RESULT_UNKNOWN() {
        return PixelDiff.RESULT_UNKNOWN;
    }

    /**
     * The images are too different
     *
     * @static
     * @property RESULT_DIFFERENT
     * @type {int}
     * @public
     */
    static get RESULT_DIFFERENT() {
        return PixelDiff.RESULT_DIFFERENT;
    }

    /**
     * The images are very similar, but still below the threshold
     *
     * @static
     * @property RESULT_SIMILAR
     * @type {int}
     * @public
     */
    static get RESULT_SIMILAR() {
        return PixelDiff.RESULT_SIMILAR;
    }

    /**
     * The images are identical (or near identical)
     *
     * @static
     * @property RESULT_IDENTICAL
     * @type {int}
     * @public
     */
    static get RESULT_IDENTICAL() {
        return PixelDiff.RESULT_IDENTICAL;
    }

    /**
     * Threshold-type for pixel
     *
     * @static
     * @property THRESHOLD_PIXEL
     * @type {string}
     * @public
     */
    static get THRESHOLD_PIXEL() {
        return PixelDiff.THRESHOLD_PIXEL;
    }

    /**
     * Threshold-type for percent of all pixels
     *
     * @static
     * @property THRESHOLD_PERCENT
     * @type {string}
     * @public
     */
    static get THRESHOLD_PERCENT() {
        return PixelDiff.THRESHOLD_PERCENT;
    }

    /**
     * Merges non-default options from optionsB into optionsA
     *
     * @method _mergeDefaultOptions
     * @param {object} optionsA
     * @param {object} optionsB
     * @returns {object}
     * @private
     */
    _mergeDefaultOptions(optionsA, optionsB = {}) {
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
     * @returns {string}
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
     * Formats the webdriver capabilities and sets defaults
     *
     * @method _formatCapabilities
     * @private
     */
    _formatCapabilities() {
        return browser.getProcessedConfig().then(_ => {
            this.browserName = _.capabilities.browserName ? camelCase(_.capabilities.browserName) : '';
            this.name = _.capabilities.name ? camelCase(_.capabilities.name) : '';
            this.logName = _.capabilities.logName ? camelCase(_.capabilities.logName) : '';
            this.platformName = _.capabilities.platformName ? _.capabilities.platformName.toLowerCase() : '';
            this.deviceName = _.capabilities.deviceName ? camelCase(_.capabilities.deviceName) : '';
            this.nativeWebScreenshot = _.capabilities.nativeWebScreenshot || false;
        });
    }

    /**
     * Promise sleep for pre-determined time
     *
     * @method _sleep
     * @param {int} timeout in milliseconds (default: 1000)
     * @returns {Promise}
     * @private
     */
    _sleep(timeout = 1000) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    /**
     * Check if browser is firefox
     *
     * @method _isFirefox
     * @returns {boolean}
     * @private
     */
    _isFirefox() {
        return this.browserName === 'firefox';
    }

    /**
     * Check if browser is internet explorer
     *
     * @method _isInternetExplorer
     * @returns {boolean}
     * @private
     */
    _isInternetExplorer() {
        return this.browserName === 'internetExplorer';
    }

    /**
     * Check if platformName is Android
     *
     * @method _isAndroid
     * @returns {boolean}
     * @private
     */
    _isAndroid() {
        return this.platformName === 'android';
    }

    /**
     * Check if platformName is iOS
     *
     * @method _isIOS
     * @returns {boolean}
     * @private
     */
    _isIOS() {
        return this.platformName === 'ios';
    }

    /**
     * Check if Mobile
     *
     * @method _isMobile
     * @returns {boolean}
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
     * @param {Promise} element
     * @returns {Promise}
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
     * @param {Promise} element
     * @returns {Promise}
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
     * @param {Promise} element
     * @returns {Promise}
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
     * @param {Promise} element
     * @returns {Promise}
     * @private
     */
    _getElementPositionIOS(element) {
        function getDataObject(element, addressBar, statusBar) {
            var screenHeight = window.screen.height,
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
     * @param {Promise} element
     * @returns {Promise}
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
     * @returns {Promise}
     * @private
     */
    _checkImageExists(tag) {
        return new Promise((resolve, reject) => {
            fs.access(path.join(this.basePath, this._formatFileName(tag)), fs.F_OK, error => {
                if (error) {
                    reject(!this.baseline ? error : new Error('Image not found, saving current image as new baseline.'));
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Get browser instance data
     *
     * @method _getBrowserData
     * @returns {Promise}
     * @private
     */
    _getBrowserData() {
        function getDataObject (isMobile) {
            return {
                devicePixelRatio: window.devicePixelRatio,
                height: (isMobile) ? window.screen.height : window.outerHeight,
                width: (isMobile) ? window.screen.width : window.outerWidth,
                innerHeight: window.innerHeight,
                scrollHeight: document.body.scrollHeight,
                scrollWidth: document.body.scrollWidth
            };
        }
        return browser.executeScript(getDataObject, this._isMobile())
            .then(screen => {
                this.devicePixelRatio = this._isFirefox() ? this.devicePixelRatio : screen.devicePixelRatio;
                this.width = screen.width * this.devicePixelRatio;
                this.height = screen.height * this.devicePixelRatio;
                this.innerHeight = screen.innerHeight * this.devicePixelRatio;
                this.pageWidth = screen.scrollWidth * this.devicePixelRatio;
                this.pageHeight = screen.scrollHeight * this.devicePixelRatio;
            });
    }

    /**
     * Determine the rectangles conform the correct browser / devicePixelRatio
     *
     * @method _getElementRectangle
     * @param {Promise} element The ElementFinder to get the rectangles of
     * @returns {object} returns the correct rectangles rectangles
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
     * Scrolls the page and takes screenshots
     *
     * @method _takeScreenshots
     * @param {int} scrollTimeout Time between scrolls in milliseconds (default: 1000)
     * @returns {Promise}
     * @private
     */
    _takeScreenshots(scrollTimeout) {
        let screens = [];

        return this._getBrowserData()
            .then(() => {
                return [...Array(Math.ceil(this.pageHeight / this.innerHeight)).keys()].reduce((promise, i) => {
                    return promise.then(() => browser.driver.executeScript(`window.scrollTo(0, + ${(this.innerHeight / this.devicePixelRatio) * i});`))
                        .then(() => this._sleep(scrollTimeout))
                        .then(() => browser.takeScreenshot())
                        .then(image => {
                            screens.push(new Buffer(image, 'base64'));
                        });
                }, Promise.resolve());
            })
            .then(() => Promise.resolve(screens));
    }

    /**
     * Runs comparison against baseline screenshot with defaults
     *
     * @method _runComparison
     * @param {string} tag Baseline image name
     * @param {PNGImage} image Screenshot image
     * @param {object} defaults Default Pixel-Diff options
     * @param {object} options Non-default Pixel-Diff options
     * @returns {Promise}
     * @private
     */
    _runComparison(tag, image, defaults = {}, options = {}) {
        defaults = Object.assign({
            imageAPath: path.join(this.basePath, tag),
            imageB: new Buffer(image, 'base64'),
            imageOutputPath: path.join(this.diffPath, path.basename(tag)),
            imageOutputLimit: PixelDiff.OUTPUT_DIFFERENT
        }, defaults);

        return new PixelDiff(this._mergeDefaultOptions(defaults, options)).runWithPromise();
    }

    /**
     * Saves an image of the whole page
     *
     * @method savePage
     * @example
     *     browser.pixdiff.savePage('imageA');
     *
     * @param {string} tag Baseline image name
     * @param {int} scrollTimeout Time between scrolls in milliseconds (default: 1000)
     * @returns {Promise}
     * @reject {Error}
     * @fulfil {null}
     * @public
     */
    savePage(tag, scrollTimeout) {
        if (this._isFirefox() || this._isInternetExplorer()) {
            return this.saveScreen(tag);
        }
        return this._takeScreenshots(scrollTimeout)
            .then(screens => {
                this.width = this.pageWidth;
                this.height = this.pageHeight;
                let png = new PNGImage({
                    imagePath: screens,
                    imageOutputPath: path.join(this.basePath, this._formatFileName(tag)),
                    composeOffset: (this.innerHeight * screens.length) - this.pageHeight
                });

                return png.compose().then(png.writeImage);
            });
    }

    /**
     * Saves an image of the screen
     *
     * @method saveScreen
     * @example
     *     browser.pixdiff.saveScreen('imageA');
     *
     * @param {string} tag Baseline image name
     * @returns {Promise}
     * @reject {Error}
     * @fulfil {null}
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
     * @param {Promise} element The ElementFinder for element lookup
     * @param {string} tag Baseline image name
     * @returns {Promise}
     * @reject {Error}
     * @fulfil {null}
     * @public
     */
    saveRegion(element, tag) {
        let rect;

        return this._getBrowserData()
            .then(() => this._getElementRectangle(element))
            .then(elementRect => {
                rect = elementRect;
                return browser.takeScreenshot();
            })
            .then(image => {
                return new PNGImage({
                    imagePath: new Buffer(image, 'base64'),
                    imageOutputPath: path.join(this.basePath, this._formatFileName(tag)),
                    cropImage: rect
                }).runWithPromise();
            });
    }

    /**
     * Runs the comparison against the page
     *
     * @method checkPage
     * @example
     *  browser.pixdiff.checkPage('imageA')
     *      .then(result => { console.log(result.code); });
     *
     * @param {string} tag Baseline image name
     * @param {object} options Non-default Pixel-Diff options
     * @returns {object} result
     * @reject {Error} - Baseline image not found
     * @fulfil {object} - PixelDiff result.code
     *
     *  - `RESULT_UNKNOWN`: 0
     *  - `RESULT_DIFFERENT`: 1
     *  - `RESULT_SIMILAR`: 7
     *  - `RESULT_IDENTICAL`: 5
     * @public
     */
    checkPage(tag, options = {}) {
        if (this._isFirefox() || this._isInternetExplorer()) {
            return this.checkScreen(tag);
        }
        return this._takeScreenshots()
            .then(screens => {
                this.width = this.pageWidth;
                this.height = this.pageHeight;
                let png = new PNGImage({
                    imagePath: screens,
                    composeOffset: (this.innerHeight * screens.length) - this.pageHeight
                });
                return png.compose().then(png.toBuffer);
            })
            .then(image => this._runComparison(this._formatFileName(tag), image, options));
    }

    /**
     * Runs the comparison against the screen
     *
     * @method checkScreen
     * @example
     *  browser.pixdiff.checkScreen('imageA', {blockOut: [{x: 0, y: 0, width: 1366, height: 30}]})
     *      .then(result => { console.log(result.code); });
     *
     * @param {string} tag Baseline image name
     * @param {object} options Non-default Pixel-Diff options
     * @returns {object} result
     * @reject {Error} - Baseline image not found
     * @fulfil {object} - PixelDiff result.code
     *
     *  - `RESULT_UNKNOWN`: 0
     *  - `RESULT_DIFFERENT`: 1
     *  - `RESULT_SIMILAR`: 7
     *  - `RESULT_IDENTICAL`: 5
     * @public
     */
    checkScreen(tag, options = {}) {
        return this._getBrowserData()
            .then(() => this._checkImageExists(tag))
            .then(() => browser.takeScreenshot(), error => {
                if (this.baseline) {
                    return this.saveScreen(tag).then(() => { throw error; });
                }
                throw error;
            })
            .then(image => this._runComparison(this._formatFileName(tag), image, options));
    }

    /**
     * Runs the comparison against a region
     *
     * @method checkRegion
     * @example
     *  browser.pixdiff.checkRegion(element(By.id('elementId')), 'imageA', {debug: true})
     *      .then(result => { console.log(result.code); });
     *
     * @param {Promise} element The ElementFinder for element lookup
     * @param {string} tag Baseline image name
     * @param {object} options Non-default Pixel-Diff options
     * @returns {object} result
     * @reject {Error} - Baseline image not found
     * @fulfil {object} - PixelDiff `result.code`
     *
     *  - `RESULT_UNKNOWN`: `0`
     *  - `RESULT_DIFFERENT`: `1`
     *  - `RESULT_SIMILAR`: `7`
     *  - `RESULT_IDENTICAL`: `5`
     * @public
     */
    checkRegion(element, tag, options = {}) {
        let defaults = {};

        return this._getBrowserData()
            .then(() => this._checkImageExists(tag))
            .then(() => this._getElementRectangle(element), (error) => {
                if (this.baseline) {
                    return this.saveRegion(element, tag).then(() => { throw error; });
                }
                throw error;
            })
            .then(rect => {
                defaults.cropImageB = rect;
                return browser.takeScreenshot();
            })
            .then(image => this._runComparison(this._formatFileName(tag), image, defaults, options));
    }
}

module.exports = PixDiff;
