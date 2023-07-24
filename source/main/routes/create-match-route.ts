import { createMatchController } from "../../adapters/controllers/factory/create-match-controller-factory"
import { fastifyRouteAdapter } from "../adapters/fastify-route-adapter"
import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.post('/create-match', fastifyRouteAdapter(createMatchController))