import { remainsAuthenticatedMiddleware } from "../middleware/factory/remains-authenticated-middleware-factory"
import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.get('/', async (request, reply) => {

    await remainsAuthenticatedMiddleware.handle(request, reply)

    return reply.view('presentation/views/landing-page.html', { auth: (<any>request.body).auth })

})