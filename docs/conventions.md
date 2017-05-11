# Conventions
There are directory and naming conventions that must be met.

## Directory structure
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
The `basePath` directory must contain all the *approved* images. You may create subdirectories for better organization, but the relative path should then be given in the test spec method. Failed comparisons generate a diff image under the **diff** folder.

## Baselines

Passing the boolean parameter `baseline: true` will automatically generate images under the `basePath` directory and fail the spec when a baseline image is not found as below:

```text
`Image not found, saving current image as new baseline.`
```

Alternatively you can use helper methods `saveImage` and `saveRegion` to manually capture baseline images.

```javascript
  pixDiff.saveImage('homepage');
  pixDiff.saveRegion(element(By.id('elementId')), 'login');
```

## Image naming

Images should obey the following default format:

```text
{descriptionInCamelCase}-{browserName}-{width}x{height}-dpr-{dpr}.png
```

The naming convention can be customized by passing the parameter ```formatImageName``` with a format string like:

```text
{browserName}_{tag}__{width}-{height}
```
The following *default* variables can be passed to format the string:
* `browserName` The browser name property from the capabilities
* `deviceName` The device name property from the capabilities
* `dpr` The device pixel ratio
* `height` The calculated DPR height
* `logName` The logName from capabilities
* `name` The name from capabilities
* `width` The calculated DPR width

Images specified via name in the spec method will be selected according to the tag name, then browsers current resolution. That is to say multiple images can share the same name differentiated by resolution.

Format options can be extended by using `formatImageOptions` as example:

```javascript
  browser.pixDiff = new PixDiff(
        {
          basePath: '/path/',
          diffPath: '/diff/',
          formatImageOptions: {platform: 'linux'},
          formatImageName: '{tag}-{platform}-{browserName}-{width}x{height}',
        }
  );
```

## Test Framework matchers

Jasmine(2) and Mocha matchers are provided for convenience. Use the static `loadMatchers()` method outside of `describe` block to initiate the loading:

```javascript
  const PixDiff = require('pix-diff');

  PixDiff.loadMatchers();
```

The Matcher is automatically selected according to the framework specified in the protractor configuration file. If not specified, `jasmine2` is default.

```javascript
  expect(pixDiff.checkScreen('homepage')).toPass();
  // OR
  expect(pixDiff.checkScreen('homepage')).not.toPass();
```

The `toPass` method evaluates the result object as an boolean value. Alternatively written without using matchers:

```javascript
  pixDiff.checkScreen('homepage').then(result => {
    expect(result.code).toEqual(PixDiff.RESULT_IDENTICAL);
  });
```
