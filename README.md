Pix-Diff
==========

A lightweight protractor plugin for image comparison

[![dependencies Status](https://david-dm.org/koola/pix-diff.svg)](https://david-dm.org/koola/pix-diff)
[![Build Status](https://travis-ci.org/koola/pix-diff.svg)](https://travis-ci.org/koola/pix-diff)
[![Sauce Test Status](https://saucelabs.com/buildstatus/pixdiff)](https://saucelabs.com/u/pixdiff)
[![npm version](https://badge.fury.io/js/pix-diff.svg)](https://www.npmjs.com/package/pix-diff)

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

Refer to [docs](./docs/index.md) for more documentation and examples.

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
* ```height``` The calculated DPR height
* ```logName``` The logName from capabilities
* ```name``` The name from capabilities
* ```width``` The calculated DPR width

Images specified via name in the spec method will be selected according to the tag name, then browsers current resolution. That is to say multiple images can share the same name differentiated by resolution.

##Tests

#### Local
- `npm test` or `npm test -- local`: Run all tests on a local machine with Chrome and Firefox.

Be sure to first run `npm run wd-update` to update the webdriver at least once after install.

#### Sauce Labs
- `npm test -- saucelabs`: This command is used to test the build on [Travis-ci](https://travis-ci.org/koola/pix-diff/). It runs a variety of desktop and mobile browser Continuous Integration tests.

###Dependencies
* [blink-diff](https://github.com/yahoo/blink-diff)
* [png-image](https://github.com/koola/png-image)
* [camel-case](https://github.com/blakeembrey/camel-case)
* [fs-extra](https://github.com/jprichardson/node-fs-extra)

###Dev-Dependencies
* [grunt](https://github.com/gruntjs/grunt)
* [grunt-cli](https://github.com/gruntjs/grunt-cli)
* [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean)
* [grunt-conventional-changelog](https://github.com/btford/grunt-conventional-changelog)
* [grunt-jsdoc-to-markdown](https://github.com/jsdoc2md/grunt-jsdoc-to-markdown)
* [grunt-protractor-runner](https://github.com/teerapap/grunt-protractor-runner)
* [jasmine-spec-reporter](https://github.com/bcaudan/jasmine-spec-reporter)
* [jshint](https://github.com/jshint/jshint)
* [load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks)
* [protractor](https://github.com/angular/protractor)

##License

The MIT License

Copyright 2016 Koola.