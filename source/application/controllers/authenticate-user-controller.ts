import { AuthenticateUserUseCase } from "../../domain/usecases/authenticate-user-usecase"
import { serializeCookie } from "../helpers/cookie-helper"
import { ValidationBuilder } from "../validation/builder"
import { ok, unauthorized } from "../helpers/http-helper"
import { HttpResponse } from "../contracts/http-response"
import { HttpHandler } from "../contracts/http-handler"
import { HttpRequest } from "../contracts/http-request"
import { Validator } from "../validation/validator"

export class AuthenticateUserController extends HttpHandler {

    private readonly authenticateUserUseCase: AuthenticateUserUseCase

    constructor(authenticateUserUseCase: AuthenticateUserUseCase) {
        super()
        this.authenticateUserUseCase = authenticateUserUseCase
    }

    protected buildValidators(httpRequest: HttpRequest): Validator[] {
        return [
            ...ValidationBuilder.of('body', httpRequest.body).required().object().build(),
            ...ValidationBuilder.of('password', httpRequest.body.password).required().string().build(),
            ...ValidationBuilder.of('email', httpRequest.body.email).required().string().build(),
        ]
    }

    async perform(request: HttpRequest): Promise<HttpResponse> {

        const { password, email } = request.body

        const accessTokenOrError = await this.authenticateUserUseCase.execute({ password, email })

        if (accessTokenOrError.isLeft())
            return unauthorized(accessTokenOrError.value)

        const accessToken = accessTokenOrError.value
        const year2038Problem = 2147483647000

        const cookieHeader =  {
            value: serializeCookie('access-token', accessToken, { httpOnly: true, sameSite: true,  expires: new Date(year2038Problem) }),
            name: 'Set-Cookie'
        }

        return ok({ auth: true }, [ cookieHeader ])

    }

}