
import { faker } from '@faker-js/faker';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { EventEmitter } from 'node:events';
import Handlers from './../src/handlers.js';


describe("#Handlers Suite", () => {
    let req, res;

    beforeEach(() => {
        req = new EventEmitter();
        req.method = '';
        req.url = '';

        res = {
            write: jest.fn(),
            setHeader: jest.fn(),
            writeHead: jest.fn(),
            end: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('Should return status code 204', async () => {
        const heanders = new Handlers(req, res);
        heanders.options();
        expect(res.writeHead).toHaveBeenCalledWith(204);
        expect(res.end).toBeCalled();
    });

    it('should call once with the correct arguments and handle the response correctly', async () => {
        jest.spyOn(console, 'log')

        const handlers = new Handlers(req, res);

        const promise = handlers.analytics();

        req.emit('data', '{"appId": "mocked-app-id", "args": {"mocked-arg": "mocked-value"}}');

        await promise

        expect(console.log).toHaveBeenCalledWith(
            "[app: mocked-app-id]", { "args": { "mocked-arg": "mocked-value" } }
        );

        expect(res.writeHead).toHaveBeenCalledTimes(1);
        expect(res.writeHead).toHaveBeenCalledWith(200);
        expect(res.end).toHaveBeenCalledTimes(1);
        expect(res.end).toHaveBeenCalledWith('ok');
        expect(res.end).toBeCalled();
    });

    it.each([
        [2], 
        ['']
    ])('Should generate e return fakes data', async (limit) => {
        faker.person.fullName = jest.fn().mockReturnValue('fullName')
        faker.number.int = jest.fn().mockReturnValue('int')
        faker.internet.email = jest.fn().mockReturnValue('email')
        faker.phone.number = jest.fn().mockReturnValue('number')
        faker.vehicle.model = jest.fn().mockReturnValue('model')

        const [skip, search] = ['', ''];
        
        req.url = `fake-data?limit=${limit}&skip=${skip}&search=${search}`

        const handlers = new Handlers(req, res);

        await handlers.generateData();

        const data = JSON.parse(`[
            ${res.write.mock.calls.map(call => call[0].trim()).join(',')}
        ]`)
        
        expect(data.length).toStrictEqual(limit || 10);

        expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });

        const requiredKeys = ['age', 'email', 'id', 'name', 'phone', 'vehicle'];
        
        for(const _data of data) {
            const _keys = Object.keys(_data);
            expect(requiredKeys.every(d => _keys.includes(d))).toStrictEqual(true);
        }

        expect(res.end).toBeCalled();
    })

});
