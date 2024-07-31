import { BeforeStep, Then, When } from '@cucumber/cucumber'
import assert from 'node:assert'

let _testServerAddress = ''
let _context = {}

function createUser(data) {
    return fetch(`${_testServerAddress}/users`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

async function findUserById(id) {
    const user = await fetch(`${_testServerAddress}/users/${id}`)
    return user.json()
}

BeforeStep(function () {
    _testServerAddress = this.testServerAddress;
})


// Scenario: Create a new user that is 23 years old and categorize them as young-adult *** \\


When(`I create a new young-adult user with the following details:`, async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 201);

    const { id } = await response.json();
    assert.ok(id);

    _context.response_young_adult_user_id = id
})

Then(`I request the young-adult user API with the user's ID`, async function () {
    const user = await findUserById(_context.response_young_adult_user_id);
    _context.response_young_adult_user = user;
})

Then(`I should receive a JSON response with the user's details`, async function () {
    const expectedKeys = [
        'name',
        'birthDay',
        'id',
        'category',
    ]

    assert.deepStrictEqual(
        Object.keys(_context.response_young_adult_user).sort(),
        expectedKeys.sort()
    )
})

Then(`The user's category should be {string}`, async function (category) {
    assert.strictEqual(_context.response_young_adult_user.category, category);
})


// Scenario: Error when creating a user who is younger than 18 years old *** \\


When(`I create a new young user with the following details:`, async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 400);

    _context.response_error_user_younger_than_18_years_old = {
        statusCode: response.status,
        message: (await response.json()),
    }
})

Then('I should receive an error message that the user must be at least 18 years old', async function () {
    const { message } = _context.response_error_user_younger_than_18_years_old;
    ;
    assert.deepEqual(message, { message: 'User must be 18 years old or older' });
})


// *** Scenario: Create an adult user  *** \\


When(`I create a adult new user with the following details:`, async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);

    assert.strictEqual(response.status, 201);

    const { id } = await response.json();
    assert.ok(id);

    _context.response_adult_user_id = id
})

Then(`I request the adult user API with user's ID`, async function () {
    const user = await findUserById(_context.response_adult_user_id);
    _context.response_adult_user = user;
})


Then(`I should receive a JSON response with the adult user's details`, async function () {
    const expectedKeys = [
        'name',
        'birthDay',
        'id',
        'category',
    ]

    assert.deepStrictEqual(
        Object.keys(_context.response_adult_user).sort(),
        expectedKeys.sort()
    )
})


Then(`The adult user's category should be {string}`, async function (category) {
    assert.strictEqual(_context.response_adult_user.category, category);
});


// *** Scenario: Create a senior user  *** \\

When(`I create a senior new user with the following details:`, async function (dataTable) {
    const [data] = await dataTable.hashes();
    const response = await createUser(data);

    assert.strictEqual(response.status, 201);

    const { id } = await response.json();
    assert.ok(id);

    _context.response_senior_user_id = id;
})

Then(`I request the senior user API with user's ID`, async function () {
    const user = await findUserById(_context.response_senior_user_id);
    _context.response_senior_user = user;
})

Then(`I should receive a JSON response with the senior user's details`, async function () {
    const expectedKeys = [
        'name',
        'birthDay',
        'id',
        'category',
    ]

    assert.deepStrictEqual(
        Object.keys(_context.response_senior_user).sort(),
        expectedKeys.sort()
    )
})


Then(`The senior user's category should be {string}`, async function (category) {
    assert.strictEqual(_context.response_senior_user.category, category);
});


// *** Scenario: Error when creating a user with an empty name *** \\

When(`I create a new user with invalid name the following details:`, async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);

    assert.strictEqual(response.status, 400);

    _context.response_error_user_invalid_name = {
        status_code: response.status,
        message: (await response.json()),
    }
})

Then(`I should receive an error message that the name cannot be empty`, async function () {
    assert.deepEqual(_context.response_error_user_invalid_name.message, { message: 'Invalid name' })
})


// *** Scenario: Error when creating a user with an invalid birth date *** \\

When(`I create a new user with invalid birth the following details:`, async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);

    assert.strictEqual(response.status, 400);

    _context.response_error_user_invalid_birth = {
        status_code: response.status,
        message: (await response.json()),
    }
})

Then(`I should receive an error message that the birth date is invalid`, async function () {
    assert.deepEqual(_context.response_error_user_invalid_birth.message, { message: 'Invalid birthDay' })
})