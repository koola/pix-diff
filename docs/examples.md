Examples
========

## Configuration file setup:
Load it from the Protractor configuration file
```javascript
exports.config = {
   // your config here ...

    onPrepare: () => {
        const PixDiff = require('pix-diff');
        browser.pixDiff = new PixDiff(
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
const PixDiff = require('pix-diff');
PixDiff.loadMatchers();

describe("Example page", () => {

    beforeEach(() => {
        browser.pixDiff = new PixDiff({
            basePath: './test/desktop/',
            diffPath: './diff/'
        });
        browser.get('http://www.example.com/');
    });

    it("should match the page", () => {
        expect(browser.pixDiff.checkScreen('examplePage')).toPass();
    });

    it("should match the page title", () => {
        expect(browser.pixDiff.checkRegion(element(by.css('h1')), 'exampleRegion')).toPass();
    });

    it("should not match the page title", () => {
        expect(browser.pixDiff.checkRegion(element(by.cc('a')), 'exampleRegion')).not.toPass();
    });
});
```
With no Jasmine matchers
```javascript
const PixDiff = require('pix-diff');

describe("Example page", () => {

    beforeEach(() => {
        browser.pixDiff = new PixDiff({
            basePath: './test/desktop/',
            diffPath: './diff/'
        });
        browser.get('http://www.example.com/');
    });

    it("should match the page", () => {
        browser.pixDiff.checkScreen('examplePage')
          .then(result => {
              expect(result.code).toEqual(PixDiff.RESULT_IDENTICAL);
          });
    });

    it("should match the page title", () => {
        browser.pixDiff.checkRegion(element(by.css('h1')), 'exampleRegion')
          .then(result => {
              expect(result.code).toEqual(PixDiff.RESULT_IDENTICAL);
          });
    });

    it("should not match the page title", () => {
        browser.pixDiff.checkRegion(element(by.cc('a')), 'exampleRegion')
          .then(result => {
              expect(result.code).toEqual(PixDiff.RESULT_DIFFERENT);
          });
    });
});
```

## Cucumber
Load it in a step file
```javascript
const expect = require('chai').expect,
      PixDiff = require('pix-diff');

function CucumberSteps() {

    browser.pixDiff = new PixDiff({
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
