import { ensureAuthenticatedMiddleware } from "../factories/application/middlewares/ensure-authenticated-middleware-factory"
import { createMatchController } from "../factories/application/controllers/create-match-controller-factory"
import { fastifyMiddlewareAdapter } from "../adapters/fastify-middleware-adapter"
import { fastifyRouteAdapter } from "../adapters/fastify-route-adapter"
import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.post('/create-match', {
    preHandler: fastifyMiddlewareAdapter(ensureAuthenticatedMiddleware)
}, fastifyRouteAdapter(createMatchController))