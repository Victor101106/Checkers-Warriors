import { GetUserByAccessTokenUseCase } from "../../domain/usecases/get-user-by-access-token-usecase"
import { parseCookies, serializeCookie } from "../helpers/cookie-helper"
import { HttpResponse } from "../contracts/http-response"
import { HttpRequest } from "../contracts/http-request"
import { HttpHandler } from "../contracts/http-handler"
import { ok } from "../helpers/http-helper"

export class RemainsAuthenticatedMiddleware extends HttpHandler {

    private readonly getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase

    constructor(getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase) {
        super()
        this.getUserByAccessTokenUseCase = getUserByAccessTokenUseCase
    }

    async perform(request: HttpRequest): Promise<HttpResponse> {
        
        const parsedCookie = parseCookies(String(request.headers.cookie))
        const accessToken = parsedCookie['access-token']

        const userOrError = await this.getUserByAccessTokenUseCase.execute({ accessToken })
        const headers = new Array()

        if (userOrError.isLeft())
            headers.push({ name: 'Set-Cookie', value: serializeCookie('access-token', '', { sameSite: true, expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT') }) })

        return ok({ auth: userOrError.isRight() }, headers)

    }

}