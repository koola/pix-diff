Pix-Diff
==========

A lightweight protractor plugin for image comparison

[![Build Status](https://travis-ci.org/koola/pix-diff.svg)](https://travis-ci.org/koola/pix-diff)
[![npm version](https://badge.fury.io/js/pix-diff.svg)](http://badge.fury.io/js/pix-diff)

[![NPM](https://nodei.co/npm/pix-diff.png)](https://nodei.co/npm/pix-diff/)

##Installation

Install this module locally with the following command:
```shell
npm install pix-diff
```

Save to dependencies or dev-dependencies:
```shell
npm install --save pix-diff
npm install --save-dev pix-diff
```

##Usage
PixDiff can be used for:

- desktop browsers (Chrome / Firefox / Safari / Internet Explorer 10/11 *!Edge not tested!*)
- mobile / tablet browsers (Chrome / Safari on emulators / real devices) based on Appium

For more information about mobile testing see the [Appium](./docs/appium.md) documentation.

#### Note 1
Some cloudservices that provide emulators / real devices in the cloud (like [Perfecto](https://www.perfectomobile.com/) or [SauceLabs](https://saucelabs.com/)) create screenshots of the complete screen (like a native screenshot). 
The needs a different way of determining the position of an element. Pixdiff can already do this for iOS Safari, but to get this working for Android add `androidNative: true` to the PixDiff parameters. 

The package can be used directly in individual tests or via ```onPrepare``` in the Protractor configuration file.

**Example:**
```javascript
exports.config = {
   // your config here ...

    onPrepare: function() {
        var PixDiff = require('pix-diff');
        browser.pixDiff = new PixDiff(
            {
                // See `PixDiff Parameters` for more parameters
                basePath: 'path/to/screenshots/',
                width: 1280,
                height: 1024
            }
        );
    },
}
```

PixDiff provides two comparison methods ```checkScreen``` and ```checkRegion``` along with Jasmine ```toMatchScreen``` and Mocha ```matchScreen``` matchers. 
Two helper methods ```saveScreen``` and ```saveRegion``` are provided for saving images.
PixDiff can also work with Cucumber.js. There are no comparison methods provided for Cucumber.js because Cucumber.js doesn't have its own ```expect``` methods.
See [Examples](./images/examples.md) for the Jasmine and CucumberJS implementation.

####PixDiff Parameters:

* ```basePath``` Defines the path to the reference images that are to be compared.
* ```baseline``` Toggles saving the screen when not found in reference images (default: false)
* ```width``` Browser width (default: 1280)
* ```height``` Browser height (default: 1024)
* ```autoResize``` Auto (re)size the browser (default: true)
* ```androidNative``` PixDiff needs to calculate element position based on a native device screenshot(default: false)
* ```formatImageName``` Naming format for images (default: ```"{tag}-{browserName}-{width}x{height}"```)

####Function options:

* ```blockOut``` Object or list of objects with coordinates that should be blocked before comparing. (default: none)
* ```debug``` When set, then block-out regions will be shown on the output image. (default: false)

####Cropping
Images can be cropped before they are compared by using the ```checkRegion``` function. The function will calculate the correct dimensions based upon the webdriver element selector (see example above).

####Block-Out
Sometimes, it is necessary to block-out some specific areas in an image that should be ignored for comparisons. For example, this can be IDs or even time-labels that change with the time. Adding block-outs to images may decrease false positives and therefore stabilizes these comparisons (see example above).

####Different webdriver implementation
There is a difference in the webdriver implementation in taking screenshots. Firefox and Internet Explorer (not tested Edge yet) take a screenshot of the complete page, even if the page needs to be scrolled. Chrome and Safari only take a screenshot of the visible portion of the page.
Keep this in mind when comparing screenshots of screens with each other.

## Conventions
There are directory and naming conventions that must be met.

**Directory structure**
```text
path
└── to
    └── screenshots
        ├── diff
        │   └── examplePage-chrome-1280x1024.png
        ├── examplePage-chrome-800x600.png
        ├── examplePage-chrome-1280x1024.png
        ├── examplePageTitle-chrome-800x600.png
        └── examplePageTitle-chrome-1280x1024.png
```
The ```basePath``` directory must contain all the *approved* images. You may create subdirectories for better organisation, but the relative path should then be given in the test spec method. Failed comparisons generate a diff image under the **diff** folder.

**Image naming**

Images should obey the following default format:

```text
{descriptionInCamelCase}-{browserName}-{browserWidth}x{browserHeight}.png
```

The naming convention can be customized by passing the parameter ```formatImageName``` with a format string like:

```text
{browserName}_{tag}__{width}-{height}
{deviceName}_{tag}__{dpr}_{width}-{height}
```
The following variables can be passed to format the string
* ```browserName``` The browser name property from the capabilities
* ```dpr``` The device pixel ratio

The following variables can be passed to format the string
* ```browserName``` The browserName property from the capabilities (available for desktop and Appium)
* ```deviceName``` The deviceName property from the capabilities (only default available for Appium, or manually added for desktop)
* ```dpr``` The devicePixelRatio (available for desktop and Appium)

Images specified via name in the spec method will be selected according to the browsers current resolution. That is to say that multiple images can share the same name differentated by resolution.

##Documentation

todo

##Tests

Run all tests with the following command:
```shell
npm test
```

Run all tests by framework/device:
```shell
npm test -- jasmine/mocha/cucumber/iosSim/androidEmChromeDriver/androidEmADB
```

###Dependencies
* [blink-diff](https://github.com/yahoo/blink-diff)
* [png-image](https://github.com/koola/png-image)
* [camel-case](https://github.com/blakeembrey/camel-case)

###Dev-Dependencies
* [grunt](https://github.com/gruntjs/grunt)
* [grunt-cli](https://github.com/gruntjs/grunt-cli)
* [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean)
* [grunt-protractor-runner](https://github.com/teerapap/grunt-protractor-runner)
* [load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks)
* [protractor](https://github.com/angular/protractor)
* [mocha](https://github.com/mochajs/mocha)
* [chai](https://github.com/chaijs/chai)
* [cucumber](https://github.com/cucumber/cucumber-js)
* [protractor-cucumber-framework](https://github.com/mattfritz/protractor-cucumber-framework)

##License

The MIT License

Copyright 2016 Koola.
