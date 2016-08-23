Feature: Pix-Diff

  Scenario: Method matchers save screen
    Given I set up the matchers environment
    Then Pix-Diff should save the screen

  Scenario: Method matchers save screen region
    Given I set up the matchers environment
    Then Pix-Diff should save the screen region

  Scenario: Method matchers match page
    Given I set up the matchers environment
    Then Pix-Diff should match the page

  Scenario: Method matchers not match page
    Given I set up the matchers environment
    Then Pix-Diff should not match the page

  Scenario: Method matchers image not found
    Given I set up the matchers environment
    Then Pix-Diff should not crash with image not found

  Scenario: Format image name
    Given I set up the format image name environment
    Then Pix-Diff should save screen with formatted basename