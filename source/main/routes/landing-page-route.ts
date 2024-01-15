import { remainsAuthenticatedMiddleware } from "../factories/application/middlewares/remains-authenticated-middleware-factory"
import { fastifyMiddlewareAdapter } from "../adapters/fastify-middleware-adapter"
import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.get('/', async (request, reply) => {

    await fastifyMiddlewareAdapter(remainsAuthenticatedMiddleware)(request, reply)

    return reply.view('presentation/views/landing-page.html', { auth: (<any>request.body).auth })

})