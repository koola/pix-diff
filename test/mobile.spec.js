'use strict';

let BlinkDiff = require('blink-diff'),
    PixDiff = require('../'),
    fs = require('fs'),
    path = require('path'),
    baselinePath = path.resolve(__dirname, '../test/baseline/mobile/'),
    differencePath = path.resolve(__dirname, '../test/diff/');

describe('Pix-Diff', () => {

    const deviceName = browser.deviceName,
        pageHeader = element(by.css('div h1')),
        subHeader = element.all(by.css('div h2')).get(2),
        tagPage = 'examplePage',
        tagRegion = 'examplePageRegion',
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
        browser.pixDiff.saveScreen(tagPage).then(() => {
            expect(fs.existsSync(`${baselinePath}/${tagPage}-${devices[deviceName].name}.png`)).toBe(true);
        });
    });

    it('should save the region', () => {
        browser.executeScript('arguments[0].scrollIntoView();', subHeader.getWebElement())
            .then(() => browser.pixDiff.saveRegion(subHeader, tagRegion))
            .then(() => {
                expect(fs.existsSync(`${baselinePath}/${tagRegion}-${devices[deviceName].name}.png`)).toBe(true);
            });
    });

    describe('compare screen', () => {

        it('should compare successfully with a baseline', () => {
            browser.pixDiff.checkScreen(tagPage, {blockOut: devices[deviceName].blockOut})
                .then((result) => {
                    expect(result.code).toEqual(BlinkDiff.RESULT_IDENTICAL);
                });
        });

        it('should save a difference and fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Hello, fail";', pageHeader.getWebElement())
                .then(() => browser.pixDiff.checkScreen(tagPage, {threshold: 1}))
                .then((result) => {
                    expect(result.code).toBe(BlinkDiff.RESULT_DIFFERENT);
                    expect(fs.existsSync(`${differencePath}/${tagPage}-${devices[deviceName].name}.png`)).toBe(true);
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
            browser.executeScript('arguments[0].scrollIntoView();', subHeader.getWebElement())
                .then(() => browser.pixDiff.checkRegion(subHeader, tagRegion))
                .then((result) => {
                    expect(result.code).toEqual(BlinkDiff.RESULT_IDENTICAL);
                });
        });

        it('should save a difference and fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', subHeader.getWebElement())
                .then(() => browser.pixDiff.checkRegion(subHeader, tagRegion, {threshold: 1}))
                .then((result) => {
                    expect(result.code).toBe(BlinkDiff.RESULT_DIFFERENT);
                    expect(fs.existsSync(`${differencePath}/${tagRegion}-${devices[deviceName].name}.png`)).toBe(true);
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
});