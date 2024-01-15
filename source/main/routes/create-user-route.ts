import { createUserController } from "../factories/application/controllers/create-user-controller-factory"
import { fastifyRouteAdapter } from "../adapters/fastify-route-adapter"
import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.post('/signup', fastifyRouteAdapter(createUserController))