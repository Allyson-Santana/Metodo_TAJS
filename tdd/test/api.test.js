import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals'
import { server } from '../src/api.js'

/*
 - Deve cadastrar usuarios e definir uma categoria onde:
        - Jovens Adultos:
            - Usuarios de 18-25
        - Adultos:
            - Usuarios de 26-50
        - Idosos:
            - 51+
        - Menor
            - Estoura um erro!
*/
describe('API  Users E2E Suite', () => {

    function waitForServerStatus(server) {
        return new Promise((resolve, reject) => {
            server.once('error', (err) => reject(err))
            server.once('listening', () => resolve())
        })
    }

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

    let _testServer
    let _testServerAddress

    beforeAll(async () => {
        _testServer = server.listen();

        await waitForServerStatus(_testServer)

        const serverInfo = _testServer.address()
        _testServerAddress = `http://localhost:${serverInfo.port}`

        jest.useFakeTimers({
            now: new Date('2023-11-23T00:00')
        })
    })

    afterAll(done => {
        server.closeAllConnections()
        _testServer.close(done)
        jest.useRealTimers()
    })

    it('should register a new user with young-adult category', async () => {
        const expectedCategory = 'young-adult'
        // importante pois o ano que vem o teste pode quebrar
        // sempre que estiver usando datas, sempre mockar o tempo!
        const response = await createUser({
            name: 'Xuxa da Silva',
            birthDay: '2000-01-01' // 21 anos
        })
        expect(response.status).toBe(201) // 201 - created
        const result = await response.json()
        expect(result.id).not.toBeUndefined()

        const user = await findUserById(result.id)
        expect(user.category).toBe(expectedCategory)
    })

    it('should register a new user with adult category', async () => {
        const expectedCategory = 'adult';

        const response = await createUser({
            name: 'Xuxa da Silva', birthDay: '1990-01-01'
        });

        expect(response.status).toBe(201);
        const result = await response.json();
        expect(result.id).not.toBeUndefined();

        const user = await findUserById(result.id);
        expect(user.category).toBe(expectedCategory);
    })

    
    it('should register a new user with senior category', async () => {
        const expectedCategory = 'old-man';

        const response = await createUser({
            name: 'Xuxa da Silva', birthDay: '1970-01-01'
        });

        expect(response.status).toBe(201);
        const result = await response.json();
        expect(result.id).not.toBeUndefined();

        const user = await findUserById(result.id);
        expect(user.category).toBe(expectedCategory);
    })

    it('should throw an error when registering a under-age user', async function () {
        const response = await createUser({
            name: 'Xuxa da Silva',
            birthDay: '2018-01-01' // 5 anos
        })

        expect(response.status).toBe(400) // bad request
        const result = await response.json()
        expect(result).toEqual({
            message: 'User must be 18yo or older'
        })
    })

    it('should throw Internal Server Error', async function () {
        jest.spyOn(JSON, JSON.parse.name).mockImplementation(() => {
            throw new Error('Invalid JSON');
        });
        const response = await createUser({
            name: 'Invalid JSON',
            birthDay: '2018-01-01'
        })
        
        expect(response.status).toBe(500);
        expect(response.statusText).toEqual("Internal Server Error");
    })

    it('should default response', async function () {
        const response = await fetch(`${_testServerAddress}/ping`);
        const text = await response.text();

        expect(response.status).toBe(200);
        expect(text).toEqual('ok');
    })
})