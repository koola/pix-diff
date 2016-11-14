'use strict';

let BlinkDiff = require('blink-diff'),
    PixDiff = require('../'),
    fs = require('fs'),
    path = require('path'),
    baselinePath = path.resolve(__dirname, '../test/baseline/desktop/'),
    differencePath = path.resolve(__dirname, '../test/diff/');

describe('Pix-Diff', () => {

    const browserName = browser.browserName,
        logName = browser.logName,
        dpr = browser.devicePixelRatio,
        pageHeader = element(by.css('div h1')),
        subHeader = element.all(by.css('div h2')).get(2),
        tagPage = 'examplePage',
        tagRegion = 'examplePageRegion',
        width = 1366,
        height = 768,
        dprWidth = width * dpr[browserName],
        dprHeight= height * dpr[browserName];

    beforeEach(() => {
        browser.pixDiff = new PixDiff({
            basePath: './test/baseline/desktop/',
            diffPath: './test/',
            width: width,
            height: height
        });

        browser.get(browser.baseUrl).then(()=> browser.sleep(500));
    });

    it('should save the screen', () => {
        browser.pixDiff.saveScreen(tagPage).then(() => {
            expect(fs.existsSync(`${baselinePath}/${tagPage}-${browserName}-${dprWidth}x${dprHeight}-dpr-${dpr[browserName]}.png`)).toBe(true);
        });
    });

    it('should save the region', () => {
        browser.pixDiff.saveRegion(subHeader, tagRegion).then(() => {
            expect(fs.existsSync(`${baselinePath}/${tagRegion}-${browserName}-${dprWidth}x${dprHeight}-dpr-${dpr[browserName]}.png`)).toBe(true);
        });
    });

    describe('compare screen', () => {

        it('should compare successfully with a baseline', () => {
            browser.pixDiff.checkScreen(tagPage).then((result) => {
                expect(result.code).toEqual(BlinkDiff.RESULT_IDENTICAL);
            });
        });

        it('should save a difference and fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Hello, fail";', pageHeader.getWebElement())
                .then(() => browser.pixDiff.checkScreen(tagPage, {threshold: 1}))
                .then((result) => {
                    expect(result.code).toBe(BlinkDiff.RESULT_DIFFERENT);
                    expect(fs.existsSync(`${differencePath}/${tagPage}-${browserName}-${dprWidth}x${dprHeight}-dpr-${dpr[browserName]}.png`)).toBe(true);
                });
        });

        it('should throw an error when no baseline is found', () => {
            browser.pixDiff.checkScreen('noImage').then(() => {
                fail(new Error('This should not fail'));
            }, error => {
                expect(error.message).toContain('no such file or directory');
            });
        });
    });

    describe('compare region', () => {

        it('should compare successfully with a baseline', () => {
            browser.pixDiff.checkRegion(subHeader, tagRegion).then((result) => {
                expect(result.code).toEqual(BlinkDiff.RESULT_IDENTICAL);
            });
        });

        it('should save a difference and fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].style.color = "#2d7091";', subHeader.getWebElement())
                .then(() => browser.pixDiff.checkRegion(subHeader, tagRegion, {threshold: 1}))
                .then((result) => {
                    expect(result.code).toBe(BlinkDiff.RESULT_DIFFERENT);
                    expect(fs.existsSync(`${differencePath}/${tagRegion}-${browserName}-${dprWidth}x${dprHeight}-dpr-${dpr[browserName]}.png`)).toBe(true);
                });
        });

        it('should throw an error when no baseline is found', () => {
            browser.pixDiff.checkRegion(subHeader, 'noImage').then(() => {
                fail(new Error('This should not fail'));
            }, error => {
                expect(error.message).toContain('no such file or directory');
            });
        });
    });

    describe('baseline', () => {

        beforeEach(function () {
            browser.pixDiff = new PixDiff({
                basePath: './test/baseline/desktop/',
                diffPath: './test/',
                baseline: true,
                width: width,
                height: height,
                formatImageName: '{tag}-{logName}-{width}x{height}-dpr-{dpr}'
            });
        });

        it('should save a screen region when baseline image not found', () => {
            const tagBaseline = 'baselineRegion';

            browser.pixDiff.checkScreen(tagBaseline).then(() => {
                fail('should not be called');
            }, (error) => {
                expect(error.message).toContain('Image not found');
                expect(fs.existsSync(`${baselinePath}/${tagBaseline}-${logName}-${dprWidth}x${dprHeight}-dpr-${dpr[browserName]}.png`)).toBe(true);
            });
        });
    });
});