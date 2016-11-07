Examples
========

**Jasmine Example:**
```javascript
const imageComparison = require('image-comparison');

describe("Example page", function() {

    beforeEach(function() {
        browser.imageComparison = new imageComparison({
            baselineFolder: './baseline/',
            screenshotPath: './.tmp/'
        });
        browser.get('http://www.example.com/');
    });

    it("should match the page", () => {
        expect(browser.imageComparison.checkScreen('examplePage')).toEqual(0);
    });

    it("should not match the page", () => {
        element(By.buttonText('yes')).click();
        expect(browser.imageComparison.checkScreen('examplePage')).not.toEqual(0);
    });

    it("should match the title", () => {
        expect(browser.imageComparison.checkElement(element(By.id('title')), 'examplePageTitle')).toEqual(0);
    });

    it("should match the title with blockout", () => {
        expect(browser.imageComparison.checkElement(element(By.id('title')), 'examplePageTitle', {
            blockOut: [{x: 10, y: 132, width: 100, height: 50}]})).toEqual(0);
    });
});
```

**Cucumber Example:**
```javascript
const expect = require('chai').expect,
      imageComparison = require('image-comparison');

function CucumberSteps() {

    browser.imageComparison = new imageComparison({
        baselineFolder: './baseline/',
        screenshotPath: './.tmp/'
    });

    this.Given(/^I load the url$/, function () {
        return browser.get('http://www.example.com/');
    });

    this.Then(/^image\-comparison should match the page$/, function () {
        return expect(browser.imageComparison.checkScreen('examplePage')).to.eventually.equal(0);
    });

    this.Then(/^image\-comparison should not match the page$/, function () {
        element(By.buttonText('yes')).click();
        return expect(browser.imageComparison.checkScreen('examplePage')).to.eventually.not.equal(0);
    });

    this.Then(/^image\-comparison should match the title$/, function () {
        return expect(browser.imageComparison.checkElement(element(By.id('title')), 'examplePageTitle')).to.eventually.equal(0);
    });

    this.Then(/^image\-comparison should match the title with blockout$/, function () {
        return expect(browser.imageComparison.checkElement(element(By.id('title')), 'examplePageTitle', {
                blockOut: [{x: 10, y: 132, width: 100, height: 50}]}))
            .to.eventually.equal(0);
    });
}

module.exports = CucumberSteps;
```