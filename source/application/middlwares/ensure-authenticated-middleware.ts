import { GetUserByAccessTokenUseCase } from "../../domain/usecases/get-user-by-access-token-usecase"
import { ok, unauthorized } from "../helpers/http-helper"
import { HttpResponse } from "../contracts/http-response"
import { parseCookies } from "../helpers/cookie-helper"
import { HttpRequest } from "../contracts/http-request"
import { HttpHandler } from "../contracts/http-handler"

export class EnsureAuthenticatedMiddleware extends HttpHandler {

    private readonly getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase

    constructor(getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase) {
        super()
        this.getUserByAccessTokenUseCase = getUserByAccessTokenUseCase
    }

    async perform(request: HttpRequest): Promise<HttpResponse> {
        
        const parsedCookie = parseCookies(String(request.headers.cookie))
        const accessToken = parsedCookie['access-token']

        const userOrError = await this.getUserByAccessTokenUseCase.execute({ accessToken })

        if (userOrError.isLeft())
            return unauthorized({ message: userOrError.value.message, name: userOrError.value.name })

        const user = userOrError.value

        return ok({ userId: user.id.value })

    }

}