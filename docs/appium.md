Appium
==========
# READ FIRST
**This documentation explains how PixDiff can work with Appium. It will not explain how to install Appium or how to automate with Appium, please refer to the Appium documentation on the Appium site.**

PixDiff is tested with: 

* iOS simulators with Safari (see iOS config below)
* Samsung Galaxy S4 physical device with Chrome and Android Emulator Nexus 6 (default from AVD, see Android config below)

**Creating screenshots / region screenshots with the above configurations work. It is not tested with a Hybrid App.**
 
 
# iOS
## How screenshots works for iOS
Appium creates a screenshot of the complete screen of the device. When a screenshot of Safari is made, the screenshot can hold the following elements:

* Statusbar (the "small" top bar that will hold time, wifi, battery, ...)
* Addressbar (the bar that will hold the url)
* View (the actual view of the page you are visiting)
* Toolbar (will hold additional buttons for the browser)

See "Scrolling" for the behaviour of Safari and the screenshots below for the influence
The `saveScreen` and `checkScreen` methods use the complete screen, see below. 
The `saveRegion` and `checkScreen` also use the complete screenshot, but the position of the element on the screenshot may differ.
If for example the position after a scroll is not determined correctly it can fail, see ![Safari saveRegion / checkRegion, manual / simulated scroll](./images/scrolledPageRegion-safari-375x667-manual-fail.png "Safari saveRegion / checkRegion, Failed scroll").
The iOS method is smart enough to detect the way of scrolling and the position of the element on the page.

## Scrolling
### Manually
When a user scrolls the screen manually the the addressbar and the Toolbar are influenced by this behaviour. For Safari and Chrome the addressbar is made smaller and the toolbar is minimized.
### Javascript
When the scroll is automated with a Javascript scroll `browser.executeScript('arguments[0].scrollIntoView();', element(by.css('div h1')).getWebElement());` the view is scrolled, but the addressbar AND the toolbar **ARE NOT INFLUENCED** BY THIS BEHAVIOUR.
### Simulate
When the scroll is automated with a "native Appium" command the real use scroll is simulated and the behaviour of the addressbar and toolbar is the same as the manual scroll

## saveScreen / checkScreen
**Not scrolled:** 

![Safari saveScreen / checkScreen](./images/TEST_appium_iPhone_6_dpr_2_375-667.png "Safari saveScreen / checkScreen")

**Manual / Simulated scroll:** 

![Safari saveScreen / checkScreen, manual / simulated scroll](./images/scrolledPage-safari-375x667-manual.png "Safari saveScreen / checkScreen, manual / simulated scroll")

**Javascript scroll:** 

![Safari saveScreen / checkScreen,  JS scroll](./images/scrolledPage-safari-375x667.png "Safari saveScreen / checkScreen,  JS scroll")

## saveScreen / checkRegion
**Not scrolled:** 

![Safari saveRegion / checkRegion](./images/scrolledPageRegion-safari-375x667.png "Safari saveRegion / checkRegion")

**Manual / Simulated scroll:** 

![Safari saveRegion / checkRegion, manual / simulated scroll](./images/scrolledPageRegion-safari-375x667-manual-scroll.png "Safari saveRegion / checkRegion, manual / simulated scroll")

**Javascript scroll:** 

![Safari saveRegion / checkRegion,  JS scroll](./images/scrolledPageRegion-safari-375x667-JS-scroll.png "Safari saveRegion / checkRegion,  JS scroll")

## Capabilities iOS

```
{
    browserName: 'safari',   // {mandatory} not case sensitive
    deviceName: 'iPhone 6',  // {mandatory} Needs to be form the list of available devices
    platformName: 'ios',     // {mandatory} not case sensitive
    platformVersion: '9.3'  // {optional} needed for specific ios version, else takes the default
}
```
# Android
## How screenshots work on Android
Appium can create 2 types of screenshots for Android based on:
- Chromedriver (default)
- ADB (Appium >= 1.5.3)

### Chromedriver (default)
Chromedriver creates a screenshot of the **(visible)viewport**

![Chromedriver saveScreen / checkScreen] (./images/avdForNexus6ByGoogle_examplePage_ChromeDriver.png "Chromedriver saveScreen / checkScreen") 

### ADB (Appium >= 1.5.3)
ADB creates a screenshot of the **complete screen** (as iOS does with Safari).
This can be compared with the Native screenshot that can be made with a device. The ADB screenshot can hold:
* Statusbar (the "small" top bar that will hold time, wifi, battery, ...)
* Addressbar (the bar that will hold the url)
* View (the actual view of the page you are visiting)
* Toolbar (will hold additional buttons for the browser) 

To use ADB screenshots add this in this capability in the capabilities `nativeWebScreenshot: true`, see "Capabilities Android" example below.

![ADB saveScreen / checkScreen] (./images/avdForNexus6ByGoogle_examplePage_ADB.png "ADB saveScreen / checkScreen") 

## Capabilities Android

```
{
    browserName: 'chrome',                      // {mandatory} not case sensitive
    deviceName: 'AVD_for_Nexus_6_by_Google',    // {mandatory} Needs to be form the list of available devices
    platformName: 'android'                     // {mandatory} not case sensitive
    platformVersion: '7.0',                     // {optional} needed for specific Android version,
    nativeWebScreenshot: true                   // to use adb screenshots (complete screenshot), default ChromeDriver
}
```