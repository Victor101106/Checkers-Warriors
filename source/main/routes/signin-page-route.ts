import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.get('/signin', (request, reply) => reply.view('authentication/views/signin-page.html'))