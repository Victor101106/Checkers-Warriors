import { HttpRequestHeaders } from "../../application/contracts/http-headers"
import { HttpHandler } from "../../application/contracts/http-handler"
import { HttpRequest } from "../../application/contracts/http-request"
import { FastifyReply, FastifyRequest } from "fastify"

export const fastifyMiddlewareAdapter = (middleware: HttpHandler) => {
    
    return async (request: FastifyRequest, reply: FastifyReply) => {
        
        const httpRequest: HttpRequest = {
            headers: <HttpRequestHeaders>request.headers,
            query: request.query || new Object(),
            body: request.body || new Object()
        }

        const httpResponse = await middleware.handle(httpRequest)

        httpResponse.headers?.forEach(header => {
            reply.header(header.name, header.value)
        })

        if (httpResponse.code === 200)
            return request.body = { ...<object>request.body, ...httpResponse.body }
            
        reply.status(httpResponse.code).send(httpResponse.body)

    }

}