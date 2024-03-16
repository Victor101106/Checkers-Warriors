import { remainsAuthenticatedMiddleware } from "../factories/application/middlewares/remains-authenticated-middleware-factory"
import { fastifyMiddlewareAdapter } from "../adapters/fastify-middleware-adapter"
import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.get('/signin', async (request, reply) => {
    
    await fastifyMiddlewareAdapter(remainsAuthenticatedMiddleware)(request, reply)

    if ((<any>request.body).auth)
        return reply.redirect('/')

    return reply.view('authentication/views/signin-page.html')

})