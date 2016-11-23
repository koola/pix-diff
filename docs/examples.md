Examples
========

## Configuration file setup:
Load it from the Protractor configuration file
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

## Jasmine
Load it in a spec file
```javascript
const pixDiff = require('pix-diff');

describe("Example page", function() {

    beforeEach(function() {
        browser.pixDiff = new pixDiff({
            basePath: './test/desktop/',
            diffPath: './diff/'
        });
        browser.get('http://www.example.com/');
    });

    it("should match the page", () => {
        expect(browser.pixDiff.checkScreen('examplePage')).toMatchScreen();
    });

    it("should match the page title", () => {
        expect(browser.pixDiff.checkRegion(element(by.css('h1')), 'exampleRegion')).toMatchScreen();
    });

    it("should not match the page title", () => {
        expect(browser.pixDiff.checkRegion(element(by.cc('a')), 'exampleRegion')).not.toMatchScreen();
    });
});
```

## Cucumber
Load it in a step file
```javascript
const expect = require('chai').expect,
      pixDiff = require('pix-diff');

function CucumberSteps() {

    browser.pixDiff = new pixDiff({
        basePath: './test/desktop/',
        diffPath: './diff/'
    });

    this.Given(/^I load the url$/, function () {
        return browser.get('http://www.example.com/');
    });

    this.Then(/^pix\-diff should match the page$/, function () {
        return expect(browser.pixDiff.checkScreen('examplePage')).to.eventually.equal(0);
    });

    this.Then(/^pix\-diff should match the title$/, function () {
        return expect(browser.pixDiff.checkRegion(element(by.css('h1')), 'exampleRegion')).to.eventually.equal(0);
    });

    this.Then(/^pix\-diff should not match the title$/, function () {
        return expect(browser.pixDiff.checkRegion(element(by.css('a')), 'exampleRegion')).to.eventually.not.equal(0);
    });
}

module.exports = CucumberSteps;
```

Feature file:
```javascript
Feature: Pix-Diff

  Scenario: Method matchers match page
    Given I load the url
    Then Pix-Diff should match the page

  Scenario: Method matchers match page title
    Given I load the url
    Then Pix-Diff should match the title

  Scenario: Method matchers match page title
    Given I load the url
    Then Pix-Diff should not match the title
```
