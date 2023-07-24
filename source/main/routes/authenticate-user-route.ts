import { authenticateUserController } from "../../adapters/controllers/factory/authenticate-user-controller-factory"
import { fastifyRouteAdapter } from "../adapters/fastify-route-adapter"
import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.post('/signin', fastifyRouteAdapter(authenticateUserController))