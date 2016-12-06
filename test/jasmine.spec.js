'use strict';

let PixelDiff = require('pixel-diff'),
    PixDiff = require('../'),
    fs = require('fs'),
    path = require('path'),
    screenshotPath = path.resolve(__dirname, '../test/baseline/desktop/'),
    differencePath = path.resolve(__dirname, '../test/diff/');

describe('Pix-Diff', () => {

    const _ = browser.testConfig,
        tagScreen = 'exampleScreen',
        tagRegion = 'exampleRegion',
        screenElement = element(by.css('div h1')),
        regionElement = element.all(by.css('div h2')).get(2);

    beforeEach(() => {
        browser.pixDiff = new PixDiff({
            basePath: './test/baseline/desktop/',
            diffPath: './test/',
            width: _.width,
            height: _.height
        });

        browser.get(browser.baseUrl).then(()=> browser.sleep(500));
    });

    it('should save the screen', () => {
        browser.pixDiff.saveScreen(tagScreen)
            .then(() => expect(fs.existsSync(`${screenshotPath}/${tagScreen}-${_.browserName}-${_.dprWidth}x${_.dprHeight}-dpr-${_.devicePixelRatio}.png`)).toBe(true));
    });

    it('should save the region', () => {
        browser.pixDiff.saveRegion(regionElement, tagRegion)
            .then(() => expect(fs.existsSync(`${screenshotPath}/${tagRegion}-${_.browserName}-${_.dprWidth}x${_.dprHeight}-dpr-${_.devicePixelRatio}.png`)).toBe(true));
    });

    it('should get static variables', () => {
        expect(PixDiff.THRESHOLD_PIXEL).toEqual('pixel');
        expect(PixDiff.THRESHOLD_PERCENT).toEqual('percent');
    });

    describe('compare screen', () => {

        it('should compare successfully with a baseline', () => {
            browser.pixDiff.checkScreen(tagScreen)
                .then(result => expect(result.code).toEqual(PixelDiff.RESULT_IDENTICAL));
        });

        it('should save a difference and fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Hello, fail";', screenElement.getWebElement())
                .then(() => browser.pixDiff.checkScreen(tagScreen, {threshold: 1}))
                .then(result => {
                    expect(result.code).toBe(PixelDiff.RESULT_DIFFERENT);
                    expect(fs.existsSync(`${differencePath}/${tagScreen}-${_.browserName}-${_.dprWidth}x${_.dprHeight}-dpr-${_.devicePixelRatio}.png`)).toBe(true);
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
            browser.pixDiff.checkRegion(regionElement, tagRegion)
                .then(result => expect(result.code).toEqual(PixelDiff.RESULT_IDENTICAL));
        });

        it('should save a difference and fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].style.color = "#2d7091";', regionElement.getWebElement())
                .then(() => browser.pixDiff.checkRegion(regionElement, tagRegion, {threshold: 1}))
                .then(result => {
                    expect(result.code).toBe(PixelDiff.RESULT_DIFFERENT);
                    expect(fs.existsSync(`${differencePath}/${tagRegion}-${_.browserName}-${_.dprWidth}x${_.dprHeight}-dpr-${_.devicePixelRatio}.png`)).toBe(true);
                });
        });

        it('should throw an error when no baseline is found', () => {
            browser.pixDiff.checkRegion(regionElement, 'noImage')
                .then(() => fail(new Error('This should not fail')))
                .catch(error => expect(error.message).toContain('no such file or directory'));
        });
    });

    describe('baseline', () => {

        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: './test/baseline/desktop/',
                diffPath: './test/',
                baseline: true,
                width: _.width,
                height: _.height,
                formatImageName: '{tag}-{logName}-{width}x{height}-dpr-{dpr}'
            });
        });

        it('should save a screen region when baseline image not found', () => {
            const tagBaseline = 'baselineRegion';

            browser.pixDiff.checkScreen(tagBaseline)
                .then(() => fail('This should not fail'))
                .catch(error => {
                    expect(error.message).toContain('Image not found');
                    expect(fs.existsSync(`${screenshotPath}/${tagBaseline}-${_.logName}-${_.dprWidth}x${_.dprHeight}-dpr-${_.devicePixelRatio}.png`)).toBe(true);
                });
        });
    });
});