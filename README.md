Pix-Diff
==========

A lightweight protractor plugin for image comparison

[![dependencies Status](https://david-dm.org/koola/pix-diff.svg)](https://david-dm.org/koola/pix-diff)
[![Build Status](https://travis-ci.org/koola/pix-diff.svg)](https://travis-ci.org/koola/pix-diff)
[![Sauce Test Status](https://saucelabs.com/buildstatus/pixdiff)](https://saucelabs.com/u/pixdiff)
[![npm version](https://badge.fury.io/js/pix-diff.svg)](http://badge.fury.io/js/pix-diff)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/pixdiff.svg)](https://saucelabs.com/u/pixdiff)

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
Pix-Diff can be used for:

- Desktop browsers (Chrome / Firefox / Safari / Internet Explorer 11 / Microsoft Edge)
- Mobile browsers (Chrome / Safari on simulators / real devices) via Appium

For more information about mobile testing see the [Appium](./docs/appium.md) documentation.

Pix-Diff provides:

- Comparison methods `checkScreen` and `checkRegion`.
- Helper methods `saveScreen` and `saveRegion` for saving images.

Pix-Diff can work with Jasmine and Cucumber.js. See [Examples](./docs/examples.md) for the Jasmine and CucumberJS implementation.

###saveScreen or checkScreen
The methods `saveScreen` and `checkScreen` create a screenshot of the viewport. Be aware that there are different webdriver implementations in creating complete screenshots.
For example:

- **screenshot of visible viewport:**
    - Chrome
    - Safari
    - Firefox
    - Microsoft Edge
- **screenshots of complete page**
    - Firefox (version 47 and below)
    - Internet Explorer (11 and below)

###saveRegion or checkRegion
Images are cropped from the complete screenshot by using the `saveRegion` or `checkRegion` methods.
The methods will calculate the correct dimensions based upon the webdriver element selector

####PixDiff Parameters:

* ```basePath``` Defines the path to the reference images that are to be compared.
* ```baseline``` Toggles saving the screen when not found in reference images (default: false)
* ```width``` Browser width when set resizes the browser width.
* ```height``` Browser height when set resizes the browsers height.
* ```formatImageName``` Naming format for images (default: ```"{tag}-{browserName}-{width}x{height}"```)
* ```formatImageOptions``` Additional options to be used with ```formatImageName```

####Method options:

* ```blockOut``` Object or list of objects with coordinates that should be blocked before comparing. (default: none)
* ```debug``` When set, then block-out regions will be shown on the output image. (default: false)

Additional BlinkDiff options can be passed in, see [here](https://github.com/yahoo/blink-diff#object-usage) for all parameters available.

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
{descriptionInCamelCase}-{browserName}-{width}x{height}-dpr-{dpr}.png
```

The naming convention can be customized by passing the parameter ```formatImageName``` with a format string like:

```text
{browserName}_{tag}__{width}-{height}
```
The following variables can be passed to format the string
* ```browserName``` The browser name property from the capabilities
* ```deviceName``` The device name property from the capabilities
* ```dpr``` The device pixel ratio
* ```logName``` The logName from capabilities
* ```name``` The name from capabilities

Images specified via name in the spec method will be selected according to the browsers current resolution. That is to say that multiple images can share the same name differentated by resolution.

##Tests

#### Local
- `npm test` or `npm test -- local`: Run all tests on a local machine with Chrome and Firefox (first run `npm run wd-update` to update the webdriver. This needs to be done once after install)

#### Sauce Labs
- `npm test -- saucelabs`: This command is used to test the build with [Travis-ci](https://travis-ci.org/koola/pix-diff/). It runs a variety of desktop and mobile browser tests, see [here](./test/conf/protractor.saucelabs.conf.js)

###Dependencies
* [blink-diff](https://github.com/yahoo/blink-diff)
* [png-image](https://github.com/koola/png-image)
* [camel-case](https://github.com/blakeembrey/camel-case)
* [mkdirp](https://github.com/substack/node-mkdirp)

###Dev-Dependencies
* [grunt](https://github.com/gruntjs/grunt)
* [grunt-cli](https://github.com/gruntjs/grunt-cli)
* [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean)
* [grunt-protractor-runner](https://github.com/teerapap/grunt-protractor-runner)
* [load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks)
* [protractor](https://github.com/angular/protractor)

##License

The MIT License

Copyright 2016 Koola.
