import { HttpRequestHeaders } from "../../adapters/controllers/ports/http-headers"
import { HttpController } from "../../adapters/controllers/ports/http-controller"
import { HttpRequest } from "../../adapters/controllers/ports/http-request"
import { FastifyReply, FastifyRequest } from "fastify"

export const fastifyRouteAdapter = (controller: HttpController) => {
    
    return async (request: FastifyRequest, reply: FastifyReply) => {
        
        const httpRequest: HttpRequest = {
            headers: <HttpRequestHeaders>request.headers,
            query: request.query || new Object(),
            body: request.body || new Object()
        }

        const httpResponse = await controller.handle(httpRequest)

        httpResponse.headers?.forEach(header => {
            reply.header(header.name, header.value)
        })

        reply.status(httpResponse.code).send(httpResponse.body)

    }

}