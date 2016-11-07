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
        const tagName = 'examplePage';

        browser.pixDiff.saveScreen(tagName).then(() => {
            expect(fs.existsSync(`${baselinePath}/${tagName}-${devices[deviceName]['name']}.png`)).toBe(true);
        });
    });

    it('should save the region', () => {
        const tagName = 'examplePageRegion';

        browser.executeScript('arguments[0].scrollIntoView();', subHeader.getWebElement());
        browser.pixDiff.saveRegion(subHeader, tagName).then(() => {
            expect(fs.existsSync(`${baselinePath}/${tagName}-${devices[deviceName]['name']}.png`)).toBe(true);
        });
    });

    describe('compare screen', () => {

        it('should compare successfully with a baseline', () => {
            browser.pixDiff.checkScreen('example-page', {blockOut: devices[deviceName]['blockOut']})
                .then((result) => {
                    expect(result.code).toEqual(BlinkDiff.RESULT_IDENTICAL);
                });
        });

        it('should save a difference and fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Hello, fail";', pageHeader.getWebElement());
            browser.pixDiff.checkScreen('example-page', {threshold: 1}).then((result) => {
                expect(result.code).toBe(BlinkDiff.RESULT_DIFFERENT);
                expect(fs.existsSync(`${differencePath}/examplePage-${devices[deviceName]['name']}.png`)).toBe(true);
            });
        });

        it('should throw an error when no baseline is found', () => {
            browser.pixDiff.checkScreen('noImage').then(() => {
                fail(new Error('This should not fail'))
            }, error => {
                expect(error.message).toContain('no such file or directory');
            });
        });
    });

    describe('compare region', () => {

        it('should compare successfully with a baseline', () => {
            browser.pixDiff.checkRegion(subHeader, 'examplePageRegion').then((result) => {
                expect(result.code).toEqual(BlinkDiff.RESULT_IDENTICAL);
            });
        });

        it('should save a difference and fail comparing with a baseline', (done) => {
            browser.executeScript('arguments[0].style.color = "#2d7091";', subHeader.getWebElement());
            browser.pixDiff.checkRegion(subHeader, 'examplePageRegion', {threshold: 1}).then((result) => {
                expect(result.code).toBe(BlinkDiff.RESULT_DIFFERENT);
                expect(fs.existsSync(`${differencePath}/examplePageRegion-${devices[deviceName]['name']}.png`)).toBe(true);
                done();
            });
        });

        it('should throw an error when no baseline is found', () => {
            browser.pixDiff.checkRegion(subHeader, 'noImage').then(() => {
                fail(new Error('This should not fail'))
            }, error => {
                expect(error.message).toContain('no such file or directory');
            });
        });
    });
});