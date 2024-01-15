import { remainsAuthenticatedMiddleware } from "../factories/main/middleware/remains-authenticated-middleware-factory"
import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.get('/create-match', async (request, reply) => {
    
    await remainsAuthenticatedMiddleware.handle(request, reply)

    if (!(<any>request.body).auth)
        return reply.redirect('/')

    return reply.view('match/views/create-match-page.html')

})