Feature: Create Users API
  Background:
    Given I have a running server
    Given The current date is "2023-11-23T00:00"

  Scenario: Create a new user that is 23 years old and categorize them as young-adult
    When I create a new young-adult user with the following details:
      | name          | birthDay   |
      | Erick Wendel  | 2000-01-01 |

    Then I request the young-adult user API with the user's ID
    Then I should receive a JSON response with the user's details
    Then The user's category should be "young-adult"

  Scenario: Error when creating a user who is younger than 18 years old
    When I create a new young user with the following details:
      | name  | birthDay   |
      | Alice | 2006-01-01 |
    Then I should receive an error message that the user must be at least 18 years old

  Scenario: Create an adult user
    Given I have a running server
    Given The current date is "2023-11-23T00:00"

    When I create a adult new user with the following details:
      | name     | birthDay   |
      | Jane     | 1980-01-01 |
    Then I request the adult user API with user's ID
    Then I should receive a JSON response with the adult user's details
    And The adult user's category should be "adult"

  Scenario: Create a senior user
    Given I have a running server
    Given The current date is "2023-11-23T00:00"

    When I create a senior new user with the following details:
      | name     | birthDay   |
      | Bob      | 1950-01-01 |
    Then I request the senior user API with user's ID
    Then I should receive a JSON response with the senior user's details
    And The senior user's category should be "senior"

  Scenario: Error when creating a user with an empty name
    Given I have a running server
    Given The current date is "2023-11-23T00:00"

    When I create a new user with invalid name the following details:
      | name  | birthDay   |
      |       | 1980-01-01 |
    Then I should receive an error message that the name cannot be empty

  Scenario: Error when creating a user with an invalid birth date
    Given I have a running server
    Given The current date is "2023-11-23T00:00"

    When I create a new user with invalid birth the following details:
      | name  | birthDay   |
      | Eve   | 01-2022-01 |
    Then I should receive an error message that the birth date is invalid