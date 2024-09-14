import { createServer } from 'node:http'
import router from './router.js'

export const server = createServer(router)