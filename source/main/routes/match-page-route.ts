import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.get('/match/:id', (request, reply) => {
    reply.view('match/views/match-page.html', { matchId: (request.params as any).id })
})