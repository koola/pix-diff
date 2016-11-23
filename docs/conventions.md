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

```
  browser.pixDiff = new PixDiff(
        {
          basePath: '/path/',
          diffPath: '/diff/',
          formatImageOptions: {platform: 'linux'},
          formatImageName: '{tag}-{platform}-{browserName}-{width}x{height}',
        }
  );
```
