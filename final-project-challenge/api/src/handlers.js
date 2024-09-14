import { faker } from '@faker-js/faker';
import { once } from 'node:events';
import { setTimeout } from 'node:timers/promises';

export default class Handlers {
    #request = null;
    #response = null;

    constructor (req, res) {
        this.#request = req
        this.#response = res
    }

    async options() {
        this.#response.writeHead(204);
        this.#response.end();
        return;
    }
    
    async analytics() {
        const { appId, ...args } = JSON.parse(await once(this.#request, 'data'));
        console.log(`[app: ${appId}]`, args);
        this.#response.writeHead(200);
        this.#response.end('ok');
        return;
    }
    
    async generateData() {
        const params = new URLSearchParams(this.#request.url.split('?')[1]);
        const limit = parseInt(params.get('limit')) || 10;
        // const skip = parseInt(params.get('skip')) || 0;
        // const search = params.get('search') || '';
    
        this.#response.writeHead(200, { 'Content-Type': 'application/json' });
    
        for (let i = 0; i < limit; i++) {
            const data = {
                id: i + 1,
                name: faker.person.fullName(),
                age: faker.number.int(18, 100),
                email: faker.internet.email(),
                phone: faker.phone.number(),
                vehicle: faker.vehicle.model(),
            }
            this.#response.write(JSON.stringify(data).concat('\n'))
            await setTimeout(100)
        }
    
        this.#response.end()
        return;
    }
}
