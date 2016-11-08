Examples
========

**Configuration file setup:**
```javascript
exports.config = {
   // your config here ...

    onPrepare: function() {
        const pixDiff = require('pix-diff');
        browser.pixDiff = new pixDiff(
            {
                basePath: 'path/to/baseline/',
                diffPath: 'path/to/diff/',
                width: 1366,
                height: 768
            }
        );
    },
}
```

**Jasmine:**
```javascript
const pixDiff = require('pix-diff');

describe("Example page", function() {

    beforeEach(function() {
        browser.pixDiff = new pixDiff({
            baselineFolder: './baseline/',
            screenshotPath: './.tmp/'
        });
        browser.get('http://www.example.com/');
    });

    it("should match the page", () => {
        expect(browser.pixDiff.checkScreen('examplePage')).toEqual(0);
    });

    it("should not match the page", () => {
        element(By.buttonText('yes')).click();
        expect(browser.pixDiff.checkScreen('examplePage')).not.toEqual(0);
    });

    it("should match the title", () => {
        expect(browser.pixDiff.checkRegion(element(By.id('title')), 'examplePageTitle')).toEqual(0);
    });

    it("should match the title with blockout", () => {
        expect(browser.pixDiff.checkRegion(element(By.id('title')), 'examplePageTitle', {
            blockOut: [{x: 10, y: 132, width: 100, height: 50}]})).toEqual(0);
    });
});
```

**Cucumber:**
```javascript
const expect = require('chai').expect,
      pixDiff = require('pix-diff');

function CucumberSteps() {

    browser.pixDiff = new pixDiff({
        baselineFolder: './baseline/',
        screenshotPath: './.tmp/'
    });

    this.Given(/^I load the url$/, function () {
        return browser.get('http://www.example.com/');
    });

    this.Then(/^pix\-diff should match the page$/, function () {
        return expect(browser.pixDiff.checkScreen('examplePage')).to.eventually.equal(0);
    });

    this.Then(/^pix\-diff should not match the page$/, function () {
        element(By.buttonText('yes')).click();
        return expect(browser.pixDiff.checkScreen('examplePage')).to.eventually.not.equal(0);
    });

    this.Then(/^pix\-diff should match the title$/, function () {
        return expect(browser.pixDiff.checkRegion(element(By.id('title')), 'examplePageTitle')).to.eventually.equal(0);
    });

    this.Then(/^pix\-diff should match the title with blockout$/, function () {
        return expect(browser.pixDiff.checkRegion(element(By.id('title')), 'examplePageTitle', {
                blockOut: [{x: 10, y: 132, width: 100, height: 50}]}))
            .to.eventually.equal(0);
    });
}

module.exports = CucumberSteps;
```