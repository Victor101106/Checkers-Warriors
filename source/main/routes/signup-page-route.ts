import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.get('/signup', (request, reply) => reply.view('authentication/views/signup-page.html'))