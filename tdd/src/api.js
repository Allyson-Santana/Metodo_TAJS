import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { createServer } from 'node:http';

const usersDb = []

function getUserCategory(birthDay) {
    const age = new Date().getFullYear() - new Date(birthDay).getFullYear();

    if (age < 18) {
        throw new Error('User must be 18yo or older');
    }

    if (age > 17 && age < 26) {
        return 'young-adult';
    }

    if (age > 25 && age < 51) {
        return 'adult';
    }

    return 'old-man';
}

const server = createServer(async (request, response) => {
    try {
        if (request.url === '/users' && request.method === 'POST') {
            const user = JSON.parse(await once(request, 'data'))
            const updatedUser = {
                ...user,
                id: randomUUID(),
                category: getUserCategory(user.birthDay)
            }
            usersDb.push(updatedUser)
            response.writeHead(201, {
                'Content-Type': 'application/json'
            })
            response.end(JSON.stringify({
                id: updatedUser.id
            }))
            return;
        }
        
        const regex = /^\/users\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (regex.test(request.url) && request.method === 'GET') {
            const [, , id] = request.url.split('/')
            const user = usersDb.find(user => user.id === id)

            response.end(JSON.stringify(user))
            return;
        }

    } catch (error) {
        if(error.message.includes('18yo')) {
            response.writeHead(400, {
                'Content-Type': 'application/json'
            })
            response.end(JSON.stringify({
                message: error.message
            }))
            return;
        }
        response.writeHead(500, {
            'Content-Type': 'application/json'
        })
        response.end("Internal Server Error")
        return;
    }
    response.end('ok')
})

export { server };
