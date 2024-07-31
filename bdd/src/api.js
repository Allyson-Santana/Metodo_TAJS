import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { createServer } from 'node:http';

class BadRequestError extends Error {
    constructor(message) {
        super(message);

        this.name = 'BadRequestError';
        this.status_code = 400
    }
}

// Database
const usersDb = [];

function getUserCategory(birthDay) {
    const age = new Date().getFullYear() - new Date(birthDay).getUTCFullYear();

    if (age < 18) {
        throw new BadRequestError('User must be 18 years old or older');
    }

    if (age >= 18 && age <= 25) {
        return 'young-adult';
    }

    if (age >= 26 && age <= 50) {
        return 'adult';
    }

    return 'senior';
}

function validateDataUser({ name, birthDay }) {
    name = typeof name === 'string' ? name.trim() : null;

    if (!name) {
        throw new BadRequestError('Invalid name');
    }

    if (!isValidDate(birthDay)) {
        throw new BadRequestError('Invalid birthDay');
    }

    return { name, birthDay };
}

function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(dateString)) {
        return false;
    }

    const date = new Date(dateString);
    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
        return false;
    }

    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(5, 7), 10);
    const day = parseInt(dateString.substring(8, 10), 10);

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() + 1 === month &&
        date.getUTCDate() === day
    );
}

const server = createServer(async (request, response) => {
    try {
        if (request.url === '/users' && request.method === 'POST') {
            const user = JSON.parse(await once(request, 'data'));
            const validatedUser = validateDataUser(user);

            const newUser = {
                ...validatedUser,
                id: randomUUID(),
                category: getUserCategory(validatedUser.birthDay),
            };

            usersDb.push(newUser);

            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ id: newUser.id }));
            return;
        }

        const userIdRegex = /^\/users\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        
        if (userIdRegex.test(request.url) && request.method === 'GET') {
            const userId = request.url.split('/')[2];
            const user = usersDb.find(user => user.id === userId);

            if (!user) {
                response.writeHead(404, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'User not found' }));
                return;
            }

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(user));
            return;
        }

        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Not Found');
    } catch (error) {
        if (error instanceof BadRequestError) {
            response.writeHead(error.status_code, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: error.message }));
        } else {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    }
});

export { server };
