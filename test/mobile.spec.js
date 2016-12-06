'use strict';

let PixelDiff = require('pixel-diff'),
    PixDiff = require('../'),
    fs = require('fs'),
    path = require('path'),
    screenshotPath = path.resolve(__dirname, '../test/baseline/mobile/'),
    differencePath = path.resolve(__dirname, '../test/diff/');

describe('Pix-Diff', () => {

    const _ = browser.testConfig,
        tagScreen = 'exampleScreen',
        tagRegion = 'exampleRegion',
        screenElement = element(by.css('div h1')),
        regionElement = element.all(by.css('div h2')).get(2),
        devices = {
            iPhone: {
                blockOut : [{x: 0, y: 0, width: 750, height: 40}],
                name:'iPhoneSimulator-safari-750x1334-dpr-2'
            },
            iPad: {
                blockOut : [{x: 0, y: 0, width: 1536, height: 40}],
                name:'iPadSimulator-safari-1536x2048-dpr-2'
            }
        };

    beforeEach(() => {
        browser.pixDiff = new PixDiff({
            basePath: './test/baseline/mobile/',
            diffPath: './test/',
            formatImageName: '{tag}-{deviceName}-{browserName}-{width}x{height}-dpr-{dpr}'
        });

        browser.get(browser.baseUrl).then(()=> browser.sleep(500));
    });

    it('should save the screen', () => {
        browser.pixDiff.saveScreen(tagScreen)
            .then(() => expect(fs.existsSync(`${screenshotPath}/${tagScreen}-${devices[_.deviceName].name}.png`)).toBe(true));
    });

    it('should save the region', () => {
        browser.executeScript('arguments[0].scrollIntoView();', regionElement.getWebElement())
            .then(() => browser.pixDiff.saveRegion(regionElement, tagRegion))
            .then(() => expect(fs.existsSync(`${screenshotPath}/${tagRegion}-${devices[_.deviceName].name}.png`)).toBe(true));
    });

    describe('compare screen', () => {

        it('should compare successfully with a baseline', () => {
            browser.pixDiff.checkScreen(tagScreen, {blockOut: devices[_.deviceName].blockOut})
                .then(result => expect(result.code).toEqual(PixelDiff.RESULT_IDENTICAL));
        });

        it('should save a difference and fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Hello, fail";', screenElement.getWebElement())
                .then(() => browser.pixDiff.checkScreen(tagScreen, {threshold: 1}))
                .then(result => {
                    expect(result.code).toBe(PixelDiff.RESULT_DIFFERENT);
                    expect(fs.existsSync(`${differencePath}/${tagScreen}-${devices[_.deviceName].name}.png`)).toBe(true);
                });
        });

        it('should throw an error when no baseline is found', () => {
            browser.pixDiff.checkScreen('noImage')
                .then(() => fail(new Error('This should not fail')))
                .catch(error => expect(error.message).toContain('no such file or directory'));
        });
    });

    describe('compare region', () => {

        it('should compare successfully with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView();', regionElement.getWebElement())
                .then(() => browser.pixDiff.checkRegion(regionElement, tagRegion))
                .then(result => expect(result.code).toEqual(PixelDiff.RESULT_IDENTICAL));
        });

        it('should save a difference and fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', regionElement.getWebElement())
                .then(() => browser.pixDiff.checkRegion(regionElement, tagRegion, {threshold: 1}))
                .then(result => {
                    expect(result.code).toBe(PixelDiff.RESULT_DIFFERENT);
                    expect(fs.existsSync(`${differencePath}/${tagRegion}-${devices[_.deviceName].name}.png`)).toBe(true);
                });
        });

        it('should throw an error when no baseline is found', () => {
            browser.pixDiff.checkRegion(regionElement, 'noImage')
                .then(() => fail(new Error('This should not fail')))
                .catch(error => expect(error.message).toContain('no such file or directory'));
        });
    });
});