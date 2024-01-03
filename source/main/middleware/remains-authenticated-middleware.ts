import { parseCookies, serializeCookie } from "../../adapters/controllers/helpers/cookie-helper"
import { GetUserByAccessTokenUseCase } from "../../usecases/get-user-by-access-token-usecase"
import { FastifyReply, FastifyRequest } from "fastify"

export class RemainsAuthenticatedMiddleware {

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

        }

        request.body = { ...<object>request.body, auth: userOrError.isRight() }

    }

}