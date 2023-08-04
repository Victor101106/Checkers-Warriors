import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.get('/signup', (request, reply) => reply.view('signup-page.html'))