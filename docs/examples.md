Examples
========

**Jasmine Example:**
```javascript
describe("Example page", function() {

    beforeEach(function() {
        browser.get('http://www.example.com/');
    });

    it("should match the page", function () {
        expect(browser.pixDiff.checkScreen('examplePage')).toMatchScreen();
    });

    it("should not match the page", function () {
        element(By.buttonText('yes')).click();
        expect(browser.pixDiff.checkScreen('examplePage')).not.toMatchScreen();
    });

    it("should match the title", function () {
        expect(browser.pixDiff.checkRegion(element(By.id('title')), 'examplePageTitle')).toMatchScreen();
    });

    it("should match the title", function () {
        expect(browser.pixDiff.checkRegion(element(By.id('title')), 'examplePageTitle', {
            blockOut: [{x: 10, y: 132, width: 100, height: 50}]})).toMatchScreen();
    });
});
```

**Cucumber Example:**
```javascript
var expect = require('chai').expect;

function CucumberSteps() {
    this.Given(/^I load the url$/, function () {
        return browser.get('http://www.example.com/');
    });

    this.Then(/^Pix\-Diff should match the page$/, function () {
        return browser.pixDiff.checkScreen('examplePage')
            .then(function (result) {
                return expect(result.differences).to.equal(0);
            });
    });

    this.Then(/^Pix\-Diff should not match the page$/, function () {
        element(By.buttonText('yes')).click();
        return browser.pixDiff.checkScreen('examplePage')
            .then(function (result) {
                return expect(result.differences).to.not.equal(0);
            });
    });

    this.Then(/^Pix\-Diff should match the title$/, function () {
        return browser.pixDiff.checkRegion(element(By.id('title')), 'examplePageTitle')
            .then(function (result) {
                return expect(result.differences).to.equal(0);
            });
    });

    this.Then(/^Pix\-Diff should match the title with blockout$/, function () {
        return browser.pixDiff.checkRegion(element(By.id('title')), 'examplePageTitle', {
            blockOut: [{x: 10, y: 132, width: 100, height: 50}]})
            .then(function (result) {
                return expect(result.differences).to.equal(0);
            });
    });
}

module.exports = CucumberSteps;
```