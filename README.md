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

The package can be used directly in individual tests or via ```onPrepare``` in the Protractor configuration file.

**Example:**
```javascript
exports.config = {
   // your config here ...

    onPrepare: function() {
        var PixDiff = require('pix-diff');
        browser.pixDiff = new PixDiff(
            {
                basePath: 'path/to/screenshots/',
                width: 1280,
                height: 1024
            }
        );
    },
}
```

PixDiff provides two comparison methods ```checkScreen``` and ```checkRegion``` along with Jasmine ```toMatchScreen``` and Mocha ```matchScreen``` matchers. Two helper methods ```saveScreen``` and ```saveRegion``` are provided for saving images.
PixDiff can also work with Cucumber.js. There are no comparison methods provided for Cucumber.js because Cucumber.js doesn't have its own ```expect``` methods.

**Jasmine Example:**
```javascript
describe("Example page", function() {

    beforeEach(function() {
        browser.get('http://www.example.com/');
    });

    it("should match the page", function () {
        expect(browser.pixDiff.checkScreen('examplePage')).toMatchScreen();
    });

    it("should not match the page", function () {
        element(By.buttonText('yes')).click();
        expect(browser.pixDiff.checkScreen('examplePage')).not.toMatchScreen();
    });

    it("should match the title", function () {
        expect(browser.pixDiff.checkRegion(element(By.id('title')), 'example page title')).toMatchScreen();
    });

    it("should match the title", function () {
        expect(browser.pixDiff.checkRegion(element(By.id('title')), 'example page title', {
            blockOut: [{x: 10, y: 132, width: 100, height: 50}]})).toMatchScreen();
    });
});
```

**Cucumber Example:**
```javascript
var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

function CucumberSteps() {
    this.Given(/^I load the url$/, function () {
        return browser.get('http://www.example.com/');
    });

    this.Then(/^Pix\-Diff should match the page$/, function () {
        return browser.pixDiff.checkScreen('examplePage')
            .then(function (result) {
                return expect(result.differences).to.equal(0);
            });
    });

    this.Then(/^Pix\-Diff should not match the page$/, function () {
        element(By.buttonText('yes')).click();
        return browser.pixDiff.checkScreen('examplePage')
            .then(function (result) {
                return expect(result.differences).to.not.equal(0);
            });
    });

    this.Then(/^Pix\-Diff should match the title$/, function () {
        return browser.pixDiff.checkRegion(element(By.id('title')), 'example page title')
            .then(function (result) {
                return expect(result.differences).to.equal(0);
            });
    });

    this.Then(/^Pix\-Diff should match the title with blockout$/, function () {
        return browser.pixDiff.checkRegion(element(By.id('title')), 'example page title', {
            blockOut: [{x: 10, y: 132, width: 100, height: 50}]})
            .then(function (result) {
                return expect(result.differences).to.equal(0);
            });
    });
}

module.exports = CucumberSteps;
```

####PixDiff Parameters:

* ```basePath``` Defines the path to the reference images that are to be compared.
* ```width``` Browser width (default: 1280)
* ```height``` Browser height (default: 1024)
* ```formatImageName``` Naming format for images (default: ```"{tag}-{browserName}-{width}x{height}"```)

####Function options:

* ```blockOut``` Object or list of objects with coordinates that should be blocked before comparing. (default: none)
* ```debug``` When set, then block-out regions will be shown on the output image. (default: false)

####Cropping
Images can be cropped before they are compared by using the ```checkRegion``` function. The function will calculate the correct dimensions based upon the webdriver element selector (see example above).

####Block-Out
Sometimes, it is necessary to block-out some specific areas in an image that should be ignored for comparisons. For example, this can be IDs or even time-labels that change with the time. Adding block-outs to images may decrease false positives and therefore stabilizes these comparisons (see example above).

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
```

Images specified via name in the spec method will be selected according to the browsers current resolution. That is to say that multiple images can share the same name differentated by resolution.

##Documentation

todo

##Tests

Run all tests with the following command:
```shell
npm test
```

Run all tests by framework:
```shell
npm test -- jasmine/mocha/cucumber
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
* [chai-as-promised](https://github.com/domenic/chai-as-promised)
* [cucumber](https://github.com/cucumber/cucumber-js)
* [protractor-cucumber-framework](https://github.com/mattfritz/protractor-cucumber-framework)

##License

The MIT License

Copyright 2016 Koola.
