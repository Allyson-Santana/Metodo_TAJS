import Handlers from './handlers.js';


function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
}

async function router(req, res) {
    const handlers = new Handlers(req, res);
    
    setCorsHeaders(res)

    if (req.method === 'OPTIONS') {
        await handlers.options()
        return
    }

    if (req.url === '/analytics' && req.method === 'POST') {
        await handlers.analytics()
        return
    }

    if (req.url === '/faker-data') {
        await handlers.generateData()
        return
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
    return
}

export default router
