import { parseCookies, serializeCookie } from "../../adapters/controllers/helpers/cookie-helper"
import { GetUserByAccessTokenUseCase } from "../../domain/usecases/get-user-by-access-token-usecase"
import { FastifyReply, FastifyRequest } from "fastify"

export class EnsureAuthenticatedMiddleware {

    private readonly getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase

    constructor(getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase) {
        this.getUserByAccessTokenUseCase = getUserByAccessTokenUseCase
    }

    async handle(request: FastifyRequest, reply: FastifyReply) {

        const parsedCookie = parseCookies(String(request.headers.cookie))
        const accessToken = parsedCookie['access-token']

        const userOrError = await this.getUserByAccessTokenUseCase.execute({ accessToken })

        if (userOrError.isLeft()) {

            reply.header('Set-Cookie', serializeCookie('access-token', '', {
                expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
                sameSite: true
            }))

            return reply.status(401).send({ 
                message: userOrError.value.message, 
                name: userOrError.value.name 
            })

        }

        const user = userOrError.value

        request.body = { ...<object>request.body, userId: user.id.value }

    }

}