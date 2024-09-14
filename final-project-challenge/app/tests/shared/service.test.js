import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import Service from '../../shared/service.js';
import fetch from '../model/fetchResponse.js';

describe('#Suite Service', () => {
    let service;

    beforeEach(() => {
        service = new Service({ url: '' });
    });

    it('shouldn\'t return error with valid response', async () => {
        const response = fetch.aResponse().build();
        global.fetch = jest.fn(() => Promise.resolve(response));
        const results = [];
        for await (const result of service.getData()) results.push(result);

        const expected = [
            {
                id: 1,
                name: 'Mrs. Misty Rempel-Lehner',
                age: 8,
                email: 'Monique.Leffler@yahoo.com',
                phone: '(551) 801-5964',
                vehicle: 'Land Cruiser'
            }
        ];

        expect(results).toEqual(expected);
    });

    it.each([
        [
            'misty',
            [{
                id: 1,
                name: 'Mrs. Misty Rempel-Lehner',
                age: 8,
                email: 'Monique.Leffler@yahoo.com',
                phone: '(551) 801-5964',
                vehicle: 'Land Cruiser'
            }]
        ],
        [
            'Misty2',
            []
        ]
    ])('Filter data by name', async (search, expected) => {
        const response = fetch.aResponse().build();
        global.fetch = jest.fn(() => Promise.resolve(response));
        const results = [];
        for await (const result of service.getData()) results.push(result);

        const dataFilter = service.searchLocallyByName(search)
        expect(dataFilter).toEqual(expected)
    })

    describe('Response Errors', () => {
        it('should not contain items when an internal server error happens', async () => {
            const response = fetch.aResponse().withStatus500().build();
            global.fetch = jest.fn(() => Promise.resolve(response));
            const results = [];
            for await (const result of service.getData()) results.push(result);
            const expected = [];

            expect(results).toEqual(expected);
        });

        it('should not contain items when a not found error happens', async () => {
            const response = fetch.aResponse().withStatus404().build();
            global.fetch = jest.fn(() => Promise.resolve(response));
            const results = [];
            for await (const result of service.getData()) results.push(result);
            const expected = [];

            expect(results).toEqual(expected);
        });

        it('should not throw if the body response is invalid', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {})

            const response = fetch.aResponse().withInvalidBody().build();
            global.fetch = jest.fn(() => Promise.resolve(response));
            const results = [];
            for await (const result of service.getData()) results.push(result);
            const expected = [];

            expect(results).toEqual(expected);
        });
    });

});
