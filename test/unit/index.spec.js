'use strict';

const Promise = require('promise'),
    PixDiff = require('../../'),
    fs = require('fs'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect;

chai.use(chaiAsPromised);

global.browser = {};

let capabilities = caps => {
    return Promise.resolve({
        framework: 'custom',
        capabilities: Object.assign({
            browserName: 'Chrome',
            name: 'test name',
            logName: 'test logger'
        }, caps || {})
    })
};

describe('Pix-Diff', () => {

    describe('Static methods', () => {

        it('should get variables', () => {
            expect(PixDiff.THRESHOLD_PIXEL).to.equal('pixel');
            expect(PixDiff.THRESHOLD_PERCENT).to.equal('percent');
            expect(PixDiff.RESULT_UNKNOWN).to.equal(0);
            expect(PixDiff.RESULT_DIFFERENT).to.equal(1);
            expect(PixDiff.RESULT_SIMILAR).to.equal(7);
            expect(PixDiff.RESULT_IDENTICAL).to.equal(5);
            expect(PixDiff.OUTPUT_DIFFERENT).to.equal(10);
            expect(PixDiff.OUTPUT_SIMILAR).to.equal(20);
            expect(PixDiff.OUTPUT_ALL).to.equal(100);
        });
    });

    describe('Default values', () => {

        browser.getProcessedConfig = capabilities;

        beforeEach(() => {
            this.instance = new PixDiff({
                basePath: 'test/baseline',
                diffPath: 'test'
            });
        });

        it('should have the right values for basePath', () => {
            expect(this.instance.basePath).to.equal('test/baseline');
        });

        it('should have the right values for diffPath', () => {
            expect(this.instance.diffPath).to.equal('test/diff');
        });

        it('should have the right values for baseline', () => {
            expect(this.instance.baseline).to.be.false;
        });

        it('should have the right values for width', () => {
            expect(this.instance.width).to.be.undefined;
        });

        it('should have the right values for height', () => {
            expect(this.instance.height).to.be.undefined;
        });

        it('should have the right values for formatOptions', () => {
            expect(this.instance.formatOptions).to.be.empty;
        });

        it('should have the right values for formatString', () => {
            expect(this.instance.formatString).to.equal('{tag}-{browserName}-{width}x{height}-dpr-{dpr}');
        });

        it('should have the right values for offsets', () => {
            expect(this.instance.offsets).to.be.an('object');
            expect(this.instance.offsets.ios).to.deep.equal({statusBar: 20, addressBar: 44});
            expect(this.instance.offsets.android).to.deep.equal({statusBar: 24, addressBar: 56, toolBar: 48});
        });

        it('should have the right values for devicePixelRatio', () => {
            expect(this.instance.devicePixelRatio).to.equal(1);
        });

    });

    describe('Mobile iOS', () => {

        beforeEach(() => {
            browser.getProcessedConfig = () => {
                return capabilities({platformName: 'iOS', browserName: 'Safari', deviceName: 'iPhone 6s'});
            };

            this.instance = new PixDiff({
                basePath: 'test/baseline',
                diffPath: 'test',
                offsets: {ios: {statusBar: 10}}
            });
        });

        it('should have webdriver capabilities', () => {
            return expect(this.instance._formatCapabilities()).to.eventually.be.fulfilled.then(() => {
                expect(this.instance._isIOS(), 'boolean is iOS').to.be.true;
                expect(this.instance.platformName).to.have.string('ios');
                expect(this.instance.browserName).to.have.string('safari');
                expect(this.instance.deviceName).to.have.string('iPhone6s');
            });
        });

        it('should have custom offsets', () => {
            expect(this.instance.offsets.ios).to.deep.equal({statusBar: 10, addressBar: 44});
        });
    });

    describe('Mobile Android', () => {

        beforeEach(() => {
            browser.getProcessedConfig = () => {
                return capabilities({platformName: 'Android', browserName: 'Chrome', deviceName: 'samsung galaxy s6'});
            };

            this.instance = new PixDiff({
                basePath: 'test/baseline',
                diffPath: 'test',
                offsets: {android: {toolBar: 50}}
            });
        });

        it('should have webdriver capabilities', () => {
            return expect(this.instance._formatCapabilities()).to.eventually.be.fulfilled.then(() => {
                expect(this.instance._isAndroid(), 'boolean is Android').to.be.true;
                expect(this.instance.platformName).to.have.string('android');
                expect(this.instance.browserName).to.have.string('chrome');
                expect(this.instance.deviceName).to.have.string('samsungGalaxyS6');
            });
        });

        it('should have custom offsets', () => {
            expect(this.instance.offsets.android).to.deep.equal({statusBar: 24, addressBar: 56, toolBar: 50});
        });
    });
});