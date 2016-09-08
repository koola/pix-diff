Appium
==========
# READ FIRST
**This documentation explains how PixDiff can work with Appium. It will not explain how to install Appium or how to automate with Appium, please refer to the Appium documentation on the Appium site.**

PixDiff is tested with: 
* iOS simulators with Safari (see iOS config below)
* Samsung Galaxy S4 physical device with Chrome and Android Emulator Nexus 6 (default from AVD, see Android config below)

Creating screenshots / region screenshots with the above configurations work. It is not tested with a Hybrid App.
 
## How screenshots works
Appium creates a screenshot of the complete screen of the device. When a screenshot of a browser (Chrome or Safari) is made, the screenshot can hold the following elements:
* Statusbar (the "small" top bar that will hold time, wifi, battery, ...)
* Addressbar (the bar that will hold the url)
* View (the actual view of the page you are visiting)
* Toolbar (will hold additional buttons for the browser)

## Scrolling
### Manually
When a user scrolls the screen manually the the addressbar and the Toolbar are influenced by this behaviour. For Safari and Chrome the addressbar is made smaller and the toolbar is minimized.
### Javascript
When the scroll is automated with a Javascript scroll `browser.executeScript('arguments[0].scrollIntoView();', element(by.css('div h1')).getWebElement());` the view is scrolled, but the addressbar AND the toolbar **ARE NOT INFLUENCED** BY THIS BEHAVIOUR.
### Simulate
When the scroll is automated with a "native Appium" command the real use scroll is simulated and the behaviour of the addressbar and toolbar is the same as the manual scroll

# iOS

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

## Capabilities Android

```
{
    browserName: 'chrome',                      // {mandatory} not case sensitive
    deviceName: 'AVD_for_Nexus_6_by_Google',    // {mandatory} Needs to be form the list of available devices
    platformName: 'android'                     // {mandatory} not case sensitive
}
```